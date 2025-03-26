import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';

// Corrected error handler (direct middleware function)
const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Never send stack traces in production
  res.status(statusCode).json({
    message: err.message,
    ...(!isProduction && { stack: err.stack }),
  });
};

export default globalErrorHandler;