import catchAsync from '../catchAsync.js';
import AppError from '../AppError.js';
import { Job } from '../models/job.model.js'; // Assuming your model path
import cloudinary from 'cloudinary';
import getDataUri from '../utils/datauri.js'; // Helper for multer to cloudinary

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