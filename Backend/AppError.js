class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Used to identify if error is a known operational error

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;