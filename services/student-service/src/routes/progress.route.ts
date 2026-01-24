import { Router } from 'express';
import { ProgressController } from '../controllers';
import { validateBody, validateParams } from '../middleware/validate';
import {
  updateProgressSchema,
  studentIdParamSchema,
} from '../utils/validators/progress.validator';

const router = Router();

// POST /progress/:studentId/init - Create initial progress for a new student
router.post(
  '/:studentId/init',
  validateParams(studentIdParamSchema),
  ProgressController.createInitialProgress,
);

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
