import AppError from '../AppError.js';

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return next(
        new AppError(`Role (${req.role}) is not allowed to access this resource`, 403)
      );
    }
    next();
  };
};