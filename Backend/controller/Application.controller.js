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

/**
 * Submit an application for a job using a transaction
 */
export const applyJob = catchAsync(async (req, res, next) => {
  const userId = req.id;
  const jobId = req.params.id;

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

  const job = await Job.findById(jobId).populate({
    path: "applications",
    options: { sort: { createdAt: -1 } },
    populate: { path: "applicant" },
  });

  if (!job) {
    return next(new AppError("Job not found", 404));
  }

  const jobObj = job.toObject();
  const jobSkills = jobObj.skills || [];

  jobObj.applications = jobObj.applications.map(app => ({
    ...app,
    matchScore: calculateMatchScore(jobSkills, app.applicant?.profile?.skills || [])
  }));

  res.status(200).json({ success: true, applicants: jobObj.applications });
});

/**
 * Update Application Status
 */
export const updateStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const applicationId = req.params.id;

  if (!status) return next(new AppError("Status is required", 400));

  const application = await Application.findById(applicationId);
  if (!application) return next(new AppError("Application not found", 404));

  application.status = status.toLowerCase();
  await application.save();

  res.status(200).json({ success: true, message: "Status updated successfully" });
});
