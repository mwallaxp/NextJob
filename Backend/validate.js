import AppError from '../AppError.js';

/**
 * Middleware to validate request data against a Zod schema
 * @param {import('zod').AnyZodObject} schema 
 */
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
      file: req.file,
    });
    next();
  } catch (error) {
    const message = error.errors.map((i) => `${i.path.join('.')}: ${i.message}`).join(", ");
    return next(new AppError(message, 400));
  }
};

export default validate;