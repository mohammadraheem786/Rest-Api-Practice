import express, { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import globalErrorHandler from './middlewares/globalErrorHandler';

const app = express();

// Routes
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  // Simulate an error
  const error = createHttpError(500, 'Oops!');
  next(error);
});

// 404 Handler (AFTER routes)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler (LAST middleware)
app.use(globalErrorHandler);

export default app;