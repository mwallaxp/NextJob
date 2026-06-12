import catchAsync from './catchAsync.js';
import AppError from './AppError.js';
import Application from './modules/application.model.js';
import Job from './modules/job.model.js';
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

  // 3. Create a new application and update Job using a Transaction
  const session = await mongoose.startSession();
  let newApplication;
  
  await session.withTransaction(async () => {
    [newApplication] = await Application.create([{
      job: jobId,
      applicant: userId,
    }], { session });

    await Job.findByIdAndUpdate(
      jobId, 
      { $push: { applications: newApplication._id } },
      { session }
    );
  });

  session.endSession();

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

  // Convert to lean objects so we can add the virtual matchScore field
  const jobObj = job.toObject(); 
  const jobSkills = jobObj.skills || [];

  // Calculate match score for each applicant
  jobObj.applications = jobObj.applications.map(app => {
    const userSkills = app.applicant?.profile?.skills || [];
    return {
      ...app,
      matchScore: calculateMatchScore(jobSkills, userSkills)
    };
  });

  res.status(200).json({ success: true, job: jobObj });
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

  application.status = status.toLowerCase();
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
