import { AppError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof AppError)) {
    // Convert generic error to AppError
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new AppError(message, statusCode);
  }

  const response = {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      details: error.details,
    },
  };

  // Do not expose stack traces in production
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = error.stack;
  }

  res.status(error.statusCode).json(response);
};

export const notFoundHandler = (req, res, next) => {
  next(new AppError(`Not Found - ${req.originalUrl}`, 404, 'NOT_FOUND'));
};
