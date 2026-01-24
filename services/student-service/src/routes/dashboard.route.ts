import { Router } from 'express';
import { DashboardController } from '../controllers';
import { validateParams } from '../middleware/validate';
import { studentIdParamSchema } from '../utils/validators/progress.validator';

const router = Router();

// GET /dashboard/:studentId - Get all dashboard data (progress + goals) for a student
router.get(
  '/:studentId',
  validateParams(studentIdParamSchema),
  DashboardController.getDashboard,
);

export default router;
