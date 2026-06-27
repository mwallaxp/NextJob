import catchAsync from '../catchAsync.js';
import AppError from '../AppError.js';
import Application from '../modules/application.model.js';
import Job from "../modules/job.model.js";
import mongoose from 'mongoose';

/**
 * Helper function to calculate skill match percentage
 */
const calculateMatchScore = (jobSkills, userSkills) => {
  if (!jobSkills?.length || !userSkills?.length) return 0;

  const normalizedJobSkills = jobSkills.map(s => s.toLowerCase().trim());
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());

  const matches = normalizedJobSkills.filter(skill => normalizedUserSkills.includes(skill));
  return Math.round((matches.length / jobSkills.length) * 100);
};

const allowedStatuses = ["pending", "accepted", "rejected"];
const allowedStages = ["applied", "screening", "interview", "offer", "hired", "rejected"];

const ensureRecruiterOwnsApplication = async (applicationId, req) => {
  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new AppError("Invalid application ID format", 400);
  }

  const application = await Application.findById(applicationId).populate("job");
  if (!application) {
    throw new AppError("Application not found", 404);
  }

  if (req.role !== "admin" && String(application.job?.created_by) !== String(req.id)) {
    throw new AppError("You can only manage applicants for jobs you own", 403);
  }

  return application;
};

/**
 * Submit an application for a job using a transaction
 */
export const applyJob = catchAsync(async (req, res, next) => {
  const userId = req.id;
  const jobId = req.params.id;

  if (req.role && req.role !== "candidate") {
    return next(new AppError("Only candidates can apply for jobs", 403));
  }

  if (!jobId) {
    return next(new AppError("Job ID is required.", 400));
  }

  const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
  if (existingApplication) {
    return next(new AppError("You have already applied for this job", 400));
  }

  const job = await Job.findById(jobId);
  if (!job) {
    return next(new AppError("Job not found", 404));
  }
  if (job.status && job.status !== "active") {
    return next(new AppError("This job is not accepting applications", 400));
  }

  const session = await mongoose.startSession();
  let newApplication;
  
  await session.withTransaction(async () => {
    [newApplication] = await Application.create([{
      job: jobId,
      applicant: userId,
    }], { session });

    job.applications.push(newApplication._id);
    await job.save({ session });
  });

  session.endSession();

  res.status(201).json({ 
    success: true, 
    message: "Application submitted successfully.", 
    application: newApplication 
  });
});

/**
 * Get all jobs applied for by the logged-in user
 */
export const getAppliedJobs = catchAsync(async (req, res, next) => {
  const userId = req.id;

  const applications = await Application.find({ applicant: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "job",
      populate: { path: "company" },
    });

  res.status(200).json({ success: true, applications });
});

/**
 * Get Applicants for a Job with Match Scores
 */
export const getApplicants = catchAsync(async (req, res, next) => {
  const jobId = req.params.id;
  const { search = "", status, interviewStage, page = 1, limit = 10 } = req.query;

  const job = await Job.findById(jobId).populate({
    path: "applications",
    options: { sort: { createdAt: -1 } },
    populate: { path: "applicant" },
  });

  if (!job) {
    return next(new AppError("Job not found", 404));
  }
  if (req.role !== "admin" && String(job.created_by) !== String(req.id)) {
    return next(new AppError("You can only view applicants for jobs you own", 403));
  }

  const jobObj = job.toObject();
  const jobSkills = jobObj.skills || [];
  const normalizedSearch = String(search).trim().toLowerCase();

  let applications = jobObj.applications
    .filter((app) => !status || app.status === status)
    .filter((app) => !interviewStage || app.interviewStage === interviewStage)
    .filter((app) => {
      if (!normalizedSearch) return true;
      const candidateText = [
        app.applicant?.fullname,
        app.applicant?.email,
        app.applicant?.phonenumber,
        ...(app.applicant?.profile?.skills || []),
      ].filter(Boolean).join(" ").toLowerCase();
      return candidateText.includes(normalizedSearch);
    })
    .map(app => ({
      ...app,
      matchScore: calculateMatchScore(jobSkills, app.applicant?.profile?.skills || [])
    }));

  applications = applications.sort((a, b) => b.matchScore - a.matchScore);

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 50);
  const total = applications.length;

  jobObj.applications = applications.slice((pageNumber - 1) * limitNumber, pageNumber * limitNumber);

  res.status(200).json({
    success: true,
    job: jobObj,
    applicants: jobObj.applications,
    total,
    currentPage: pageNumber,
    totalPages: Math.ceil(total / limitNumber) || 1,
  });
});

/**
 * Update Application Status
 */
export const updateStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const applicationId = req.params.id;

  if (!status) return next(new AppError("Status is required", 400));
  const normalizedStatus = String(status).toLowerCase();
  if (!allowedStatuses.includes(normalizedStatus)) {
    return next(new AppError("Status must be pending, accepted, or rejected", 400));
  }

  const application = await ensureRecruiterOwnsApplication(applicationId, req);

  application.status = normalizedStatus;
  if (normalizedStatus === "accepted" && application.interviewStage === "applied") {
    application.interviewStage = "screening";
  }
  if (normalizedStatus === "rejected") {
    application.interviewStage = "rejected";
  }
  application.reviewedBy = req.id;
  await application.save();

  // Trigger real-time notification via Socket.io
  const io = req.app.get("io");
  if (io) {
    io.to(`user_${application.applicant}`).emit("notification", {
      type: "APPLICATION_STATUS_UPDATE",
      message: `Your application status has been updated to ${normalizedStatus}.`,
      applicationId: application._id
    });
  }

  res.status(200).json({ success: true, message: "Status updated successfully" });
});

export const updateApplicationReview = catchAsync(async (req, res, next) => {
  const { interviewStage, recruiterComment, note } = req.body;
  const application = await ensureRecruiterOwnsApplication(req.params.id, req);

  if (interviewStage) {
    const normalizedStage = String(interviewStage).toLowerCase();
    if (!allowedStages.includes(normalizedStage)) {
      return next(new AppError("Invalid interview stage", 400));
    }
    application.interviewStage = normalizedStage;
    if (normalizedStage === "hired") application.status = "accepted";
    if (normalizedStage === "rejected") application.status = "rejected";
  }

  if (recruiterComment !== undefined) {
    application.recruiterComment = recruiterComment;
  }

  if (note) {
    application.notes.push({
      text: note,
      createdBy: req.id,
    });
  }

  application.reviewedBy = req.id;
  await application.save();

  res.status(200).json({
    success: true,
    message: "Application review updated successfully",
    application,
  });
});
