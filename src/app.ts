import express, { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import globalErrorHandler from './middlewares/globalErrorHandler';
import userRouter from './user/userRouter';
import bookRouter from './book/bookRouter';
import cookieParser  from "cookie-parser";


const app = express();
app.use(express.json());

app.use(cookieParser());

// Routes
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  // Simulate an error
  const error = createHttpError(500, 'Oops!');
  next(error);
});

// User routes
app.use('/users', userRouter);

//book routes
app.use('/books', bookRouter);

// 404 Handler (AFTER routes)
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler (LAST middleware)
app.use(globalErrorHandler);

export default app;