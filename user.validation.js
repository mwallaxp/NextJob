import Joi from 'joi';

const registrationSchema = Joi.object({
  fullname: Joi.string().trim().min(3).max(100).required().messages({
    'string.base': 'Full name must be a string',
    'string.empty': 'Full name is required',
    'string.min': 'Full name should have a minimum length of {#limit}',
    'string.max': 'Full name should have a maximum length of {#limit}',
    'any.required': 'Full name is required'
  }),
  phonenumber: Joi.string().pattern(/^\d{10}$/).required().messages({
    'string.base': 'Phone number must be a string',
    'string.empty': 'Phone number is required',
    'string.pattern.base': 'Phone number must be a 10-digit number',
    'any.required': 'Phone number is required'
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(8).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid('candidate', 'recruiter').required().messages({
    'string.base': 'Role must be a string',
    'string.empty': 'Role is required',
    'any.only': 'Role must be either candidate or recruiter',
    'any.required': 'Role is required'
  }),
  // For file uploads (like profile photo), Multer handles req.file.
  // Joi validation here is for req.body fields.
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid('candidate', 'recruiter').required().messages({
    'string.base': 'Role must be a string',
    'string.empty': 'Role is required',
    'any.only': 'Role must be either candidate or recruiter',
    'any.required': 'Role is required'
  }),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
    'any.required': 'Email is required'
  }),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters long',
    'any.required': 'Password is required'
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'string.base': 'Confirm password must be a string',
    'string.empty': 'Confirm password is required',
    'any.only': 'Passwords do not match',
    'any.required': 'Confirm password is required'
  }),
});

const updateProfileSchema = Joi.object({
  fullname: Joi.string().trim().min(3).max(100).optional(),
  email: Joi.string().email().optional(),
  phonenumber: Joi.string().pattern(/^\d{10}$/).optional(),
  bio: Joi.string().trim().max(500).optional(),
  skills: Joi.alternatives().try(Joi.array().items(Joi.string().trim()), Joi.string().trim()).optional(),
});

export {
  registrationSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, updateProfileSchema,
};