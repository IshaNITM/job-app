import { z } from 'zod';
import { AppError } from '../utils/errors.js';

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      next(new AppError('Invalid request data', 400, 'VALIDATION_ERROR', details));
    } else {
      next(error);
    }
  }
};
