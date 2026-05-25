import catchAsync from '../catchAsync.js';
import AppError from '../AppError.js';
import { Application } from '../models/application.model.js';

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