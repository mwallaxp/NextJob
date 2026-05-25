import catchAsync from './catchAsync.js';
import AppError from './AppError.js';
import { Application } from './models/application.model.js';
import Job from './models/job.model.js';

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

  // 3. Create a new application
  const newApplication = await Application.create({
    job: jobId,
    applicant: userId,
  });

  // 4. Update the Job document with the new application reference
  job.applications.push(newApplication._id);
  await job.save();

  res.status(201).json({ 
    status: 'success', 
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

  res.status(200).json({ status: 'success', applications });
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

  res.status(200).json({ status: 'success', job });
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

  res.status(200).json({ status: 'success', message: "Status updated successfully." });
});