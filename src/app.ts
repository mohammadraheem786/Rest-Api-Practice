import express, { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';

const app = express();

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// 404 handler for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler (must have 4 parameters to be recognized as error middleware)
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  return res.status(statusCode).json({
    message: err.message,
    ...(!isProduction && { stack: err.stack }), // Only show stack in development
  });
});

export default app;