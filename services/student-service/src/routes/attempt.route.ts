import { Router } from 'express';
import { AttemptController } from '../controllers';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validate';
import {
  startAttemptSchema,
  updateAnswersSchema,
  completeAttemptSchema,
  attemptQuerySchema,
  objectIdSchema,
  studentIdParamSchema,
  historyParamSchema,
} from '../utils/validators/attempt.validator';

const router = Router();

// GET /attempts/student/:studentId - Get attempts for a student
router.get(
  '/student/:studentId',
  validateParams(studentIdParamSchema),
  validateQuery(attemptQuerySchema),
  AttemptController.getAttempts,
);

// GET /attempts/history/:studentId/:exerciseId - Get attempt history for an exercise
router.get(
  '/history/:studentId/:exerciseId',
  validateParams(historyParamSchema),
  AttemptController.getAttemptHistory,
);

// GET /attempts/:id - Get attempt by ID
router.get(
  '/:id',
  validateParams(objectIdSchema),
  AttemptController.getAttempt,
);

// POST /attempts - Start a new exercise attempt
router.post(
  '/',
  validateBody(startAttemptSchema),
  AttemptController.startAttempt,
);

// PATCH /attempts/:id/answers - Update answers during an attempt
router.patch(
  '/:id/answers',
  validateParams(objectIdSchema),
  validateBody(updateAnswersSchema),
  AttemptController.updateAnswers,
);

// POST /attempts/:id/complete - Complete an attempt
router.post(
  '/:id/complete',
  validateParams(objectIdSchema),
  validateBody(completeAttemptSchema),
  AttemptController.completeAttempt,
);

// POST /attempts/:id/abandon - Abandon an attempt
router.post(
  '/:id/abandon',
  validateParams(objectIdSchema),
  AttemptController.abandonAttempt,
);

export default router;
