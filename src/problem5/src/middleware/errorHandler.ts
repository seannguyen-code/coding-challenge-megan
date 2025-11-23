import { NextFunction, Request, Response } from 'express';
import { NotFoundError, ValidationError } from '../domain/resource';
import { ZodError } from 'zod';
import { appLogger } from './logger';

interface ErrorResponse {
  error: {
    message: string;
    details?: unknown;
  };
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  appLogger.error('Error occurred', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Validation errors (custom)
  if (err instanceof ValidationError) {
    res.status(400).json({
      error: {
        message: err.message,
      },
    } as ErrorResponse);
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        message: 'Validation failed',
        details: err.errors,
      },
    } as ErrorResponse);
    return;
  }

  // Not found errors
  if (err instanceof NotFoundError) {
    res.status(404).json({
      error: {
        message: err.message,
      },
    } as ErrorResponse);
    return;
  }

  // Database errors
  if (err.name === 'DatabaseError' || (err as any).code) {
    res.status(500).json({
      error: {
        message: 'Database error occurred',
      },
    } as ErrorResponse);
    return;
  }

  // Default to 500 server error
  res.status(500).json({
    error: {
      message: 'Internal server error',
    },
  } as ErrorResponse);
};
