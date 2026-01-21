import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger, mapErrorToResponse } from '@readingForest/libs';
import { healthCheck } from './health';

// Load environment variables
dotenv.config();

// Import routes
import guardianRoutes from './routes/guardian.route';

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userId: req.headers['x-user-id'],
  });
  next();
});

// Health check
app.get('/health', healthCheck);

// Routes - all guardian routes are mounted at root since gateway prefixes with /api/guardian
app.use('/', guardianRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
  });

  const errorResponse = mapErrorToResponse(err);
  res.status(errorResponse.statusCode).json(errorResponse);
});

// Start server
app.listen(PORT, () => {
  logger.info(`Guardian service running on port ${PORT}`);
  logger.info(`Student service URL: ${process.env.STUDENT_SERVICE_URL_INTERNAL}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, closing server gracefully');
  process.exit(0);
});

export default app;
