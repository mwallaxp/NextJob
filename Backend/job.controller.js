import catchAsync from './catchAsync.js';
import AppError from './AppError.js';
import Job from './models/job.model.js'; 
import cloudinary from 'cloudinary';
import getDataUri from './utility/datauri.js'; 

export const postJob = catchAsync(async (req, res, next) => {
  const { title, description, requirements, salary, location, jobType, experienceLevel, position, companyId, skills } = req.body;
  
  let logoUrl = '';
  
  if (req.file) {
    const fileUri = getDataUri(req.file);
    const cloudResponse = await cloudinary.v2.uploader.upload(fileUri.content);
    logoUrl = cloudResponse.secure_url;
  }

  const job = await Job.create({
    title,
    description,
    requirements: requirements.split(","), // Turning comma-separated string into array
    salary: Number(salary),
    location,
    jobType,
    skills,
    experience: experienceLevel,
    position,
    company: companyId,
    logo: logoUrl,
    created_by: req.id // Set by your auth middleware
  });

  res.status(201).json({ status: 'success', message: "New job created successfully.", job });
});

/**
 * Get all jobs with optional keyword filtering
 */
export const getAllJobs = catchAsync(async (req, res, next) => {
  const keyword = req.query.keyword || "";
  const query = {
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  };

  const jobs = await Job.find(query)
    .populate({ path: "company" })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    jobs,
  });
});

/**
 * Get a single job by ID for the details page
 */
export const getJobById = catchAsync(async (req, res, next) => {
  const jobId = req.params.id;
  const job = await Job.findById(jobId).populate({
    path: "applications",
  });

  if (!job) {
    return next(new AppError("Job not found.", 404));
  }

  res.status(200).json({
    success: true,
    job,
  });
});

/**
 * Get jobs created by the logged-in admin/recruiter
 */
export const getAdminJobs = catchAsync(async (req, res, next) => {
  const adminId = req.id;
  const jobs = await Job.find({ created_by: adminId })
    .populate({ path: "company" })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    jobs,
  });
});