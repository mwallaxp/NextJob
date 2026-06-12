import Joi from 'joi';
import AppError from '../AppError.js';

/**
 * Middleware to validate request body against a Joi schema.
 * @param {Joi.Schema} schema - The Joi schema to validate against.
 * @returns {Function} Express middleware function.
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false, // Include all errors
    allowUnknown: true, // Allow unknown keys that are ignored
    stripUnknown: true // Remove unknown keys
  });

  if (error) {
    const errors = error.details.map(err => err.message).join(', ');
    return next(new AppError(`Validation error: ${errors}`, 400));
  }
  req.validatedBody = value; // Attach the validated data to the request object
  next();
};

export default validate;