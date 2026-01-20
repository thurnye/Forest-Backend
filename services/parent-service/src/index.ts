import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger, mapErrorToResponse } from '@readingForest/libs';
import { healthCheck } from './health';

dotenv.config();



const app = express();
const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URI!;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN!,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Health check
app.get('/health', healthCheck);

// Routes
// app.use('/', profileRoutes); //update with actual routes

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error occurred', { error: err.message, stack: err.stack });
  const errorResponse = mapErrorToResponse(err);
  res.status(errorResponse.statusCode).json(errorResponse);
});

// MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(PORT, () => {
      logger.info('Parent service running on port ' + PORT);
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection error', { error: err.message });
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  mongoose.connection.close();
  process.exit(0);
});

export default app;