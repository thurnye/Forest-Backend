import { Request, Response } from 'express';
import { studentServiceClient } from './clients/studentServiceClient';

export const healthCheck = async (_req: Request, res: Response) => {
  try {
    // Check if student-service is reachable
    await studentServiceClient.get('/health');

    res.json({
      status: 'healthy',
      service: 'guardian-service',
      timestamp: new Date().toISOString(),
      dependencies: {
        'student-service': 'healthy',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'degraded',
      service: 'guardian-service',
      timestamp: new Date().toISOString(),
      dependencies: {
        'student-service': 'unhealthy',
      },
    });
  }
};
