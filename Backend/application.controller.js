import catchAsync from './catchAsync.js';
import AppError from './AppError.js';
import Application from './modules/application.model.js';
import Job from './modules/job.model.js';
import mongoose from 'mongoose';

/**
 * Helper function to calculate skill match percentage
 */
const calculateMatchScore = (jobSkills, userSkills) => {
  if (!jobSkills || jobSkills.length === 0) return 0;
  if (!userSkills || userSkills.length === 0) return 0;

  const normalizedJobSkills = jobSkills.map(s => s.toLowerCase().trim());
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());

  const matches = normalizedJobSkills.filter(skill => 
    normalizedUserSkills.includes(skill)
  );

  return Math.round((matches.length / jobSkills.length) * 100);
};

/**
 * Submit a bid/application for a job
 */
export const applyJob = catchAsync(async (req, res, next) => {
  const userId = req.id;
  const jobId = req.params.id;

  if (!jobId) {
    return next(new AppError("Job ID is required.", 400));
  }

  // 1. Check if the user has already applied for this job
  const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
  if (existingApplication) {
    return next(new AppError("You have already applied for this job", 400));
  }

  // 2. Check if the job exists
  const job = await Job.findById(jobId);
  if (!job) {
    return next(new AppError("Job not found", 404));
  }
  if (job.status && job.status !== "active") {
    return next(new AppError("This job is not accepting applications.", 400));
  }

  // 3. Create a new application and update Job
  const newApplication = await Application.create({
    job: jobId,
    applicant: userId,
  });

  await Job.findByIdAndUpdate(jobId, { $push: { applications: newApplication._id } });

  res.status(201).json({ 
    success: true, 
    message: "Application submitted successfully.", 
    application: newApplication 
  });
});

/**
 * Get all jobs applied for by the logged-in freelancer
 */
export const getAppliedJobs = catchAsync(async (req, res, next) => {
  const userId = req.id; // From your auth middleware

  const applications = await Application.find({ applicant: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: 'job',
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'company',
      }
    });

  res.status(200).json({ success: true, applications });
});

/**
 * Get all applicants for a specific job (Recruiter view)
 * This populates the applicant's user details automatically.
 */
export const getApplicants = catchAsync(async (req, res, next) => {
  const jobId = req.params.id;
  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    interviewStage,
  } = req.query;
  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 50);
  
  // Find the job and populate the applications with the applicant's info
  const job = await Job.findById(jobId).populate({
    path: 'applications',
    options: { sort: { createdAt: -1 } },
    populate: {
      path: 'applicant'
    }
  });

  if (!job) {
    return next(new AppError("Job not found.", 404));
  }
  if (req.role === "recruiter" && String(job.created_by) !== String(req.id)) {
    return next(new AppError("You can only view applicants for your own jobs.", 403));
  }

  // Convert to lean objects so we can add the virtual matchScore field
  const jobObj = job.toObject();
  
  const jobSkills = jobObj.skills || [];

  // Calculate match score for each applicant
  let applications = jobObj.applications.map(app => {
    const userSkills = app.applicant?.profile?.skills || [];
    return {
      ...app,
      matchScore: calculateMatchScore(jobSkills, userSkills)
    };
  });

  if (status) applications = applications.filter((app) => app.status === status);
  if (interviewStage) applications = applications.filter((app) => app.interviewStage === interviewStage);
  if (search) {
    const normalizedSearch = search.toLowerCase();
    applications = applications.filter((app) => {
      const applicant = app.applicant || {};
      return [applicant.fullname, applicant.email, applicant.phonenumber]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch));
    });
  }

  const total = applications.length;
  jobObj.applications = applications.slice((pageNumber - 1) * limitNumber, pageNumber * limitNumber);

  res.status(200).json({
    success: true,
    job: jobObj,
    total,
    currentPage: pageNumber,
    totalPages: Math.ceil(total / limitNumber),
  });
});

/**
 * Update application status (Recruiter action: accept/reject)
 */
export const updateStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body; // 'accepted' or 'rejected'
  const applicationId = req.params.id;

  if (!status) {
    return next(new AppError("Status is required.", 400));
  }

  const application = await Application.findById(applicationId);
  if (!application) {
    return next(new AppError("Application not found.", 404));
  }
  const job = await Job.findOne({ _id: application.job, created_by: req.id });
  if (req.role === "recruiter" && !job) {
    return next(new AppError("You can only update applications for your own jobs.", 403));
  }

  application.status = status.toLowerCase();
  if (application.status === "accepted" && application.interviewStage === "applied") {
    application.interviewStage = "screening";
  }
  if (application.status === "rejected") {
    application.interviewStage = "rejected";
  }
  application.reviewedBy = req.id;
  await application.save();

  // Trigger real-time notification via Socket.io
  const io = req.app.get("io");
  if (io) {
    io.to(`user_${application.applicant}`).emit("notification", {
      type: "APPLICATION_STATUS_UPDATE",
      message: `Your application status has been updated to ${status}.`,
      applicationId: application._id
    });
  }

  res.status(200).json({ success: true, message: "Status updated successfully." });
});

/**
 * Update recruiter review metadata for an application.
 */
export const updateApplicationReview = catchAsync(async (req, res, next) => {
  const { interviewStage, recruiterComment, note } = req.body;
  const applicationId = req.params.id;

  const application = await Application.findById(applicationId);
  if (!application) {
    return next(new AppError("Application not found.", 404));
  }

  const job = await Job.findOne({ _id: application.job, created_by: req.id });
  if (req.role === "recruiter" && !job) {
    return next(new AppError("You can only review applications for your own jobs.", 403));
  }

  if (interviewStage) {
    const allowedStages = ["applied", "screening", "interview", "offer", "hired", "rejected"];
    if (!allowedStages.includes(interviewStage)) {
      return next(new AppError("Invalid interview stage.", 400));
    }
    application.interviewStage = interviewStage;
  }

  if (typeof recruiterComment === "string") {
    application.recruiterComment = recruiterComment;
  }

  if (note?.trim()) {
    application.notes.push({ text: note.trim(), createdBy: req.id });
  }

  application.reviewedBy = req.id;
  await application.save();

  res.status(200).json({
    success: true,
    message: "Application review updated successfully.",
    application,
  });
});
