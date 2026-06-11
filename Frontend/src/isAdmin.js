import AppError from '../AppError.js';
import catchAsync from '../catchAsync.js';
import User from '../models/user.model.js';

/**
 * Middleware to verify if the authenticated user is an admin
 */
export const isAdmin = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.id);
  
  if (!user || user.role !== 'admin') {
    return next(new AppError("Access denied. Admin privileges required.", 403));
  }

  next();
});

export default isAdmin;