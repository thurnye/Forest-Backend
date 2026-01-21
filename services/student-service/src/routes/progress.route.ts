import { Router } from 'express';
import { ProgressController } from '../controllers';
import { validateBody, validateParams } from '../middleware/validate';
import {
  updateProgressSchema,
  studentIdParamSchema,
} from '../utils/validators/progress.validator';

const router = Router();

// GET /progress/:studentId - Get progress for a student
router.get(
  '/:studentId',
  validateParams(studentIdParamSchema),
  ProgressController.getProgress,
);

// PATCH /progress/:studentId - Update progress for a student
router.patch(
  '/:studentId',
  validateParams(studentIdParamSchema),
  validateBody(updateProgressSchema),
  ProgressController.updateProgress,
);

// POST /progress/:studentId/streak - Update streak for a student
router.post(
  '/:studentId/streak',
  validateParams(studentIdParamSchema),
  ProgressController.updateStreak,
);

export default router;
