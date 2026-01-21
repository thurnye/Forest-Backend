import { Router } from 'express';
import { GoalController } from '../controllers';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validate';
import {
  createGoalSchema,
  updateGoalSchema,
  updateGoalProgressSchema,
  goalQuerySchema,
  objectIdSchema,
  studentIdParamSchema,
} from '../utils/validators/goal.validator';

const router = Router();

// GET /goals/student/:studentId - Get goals for a student
router.get(
  '/student/:studentId',
  validateParams(studentIdParamSchema),
  validateQuery(goalQuerySchema),
  GoalController.getGoals,
);

// GET /goals/student/:studentId/active/count - Get active goals count
router.get(
  '/student/:studentId/active/count',
  validateParams(studentIdParamSchema),
  GoalController.getActiveGoalsCount,
);

// GET /goals/:id - Get goal by ID
router.get('/:id', validateParams(objectIdSchema), GoalController.getGoal);

// POST /goals - Create a new goal
router.post('/', validateBody(createGoalSchema), GoalController.createGoal);

// PATCH /goals/:id - Update a goal
router.patch(
  '/:id',
  validateParams(objectIdSchema),
  validateBody(updateGoalSchema),
  GoalController.updateGoal,
);

// PATCH /goals/:id/progress - Update goal progress
router.patch(
  '/:id/progress',
  validateParams(objectIdSchema),
  validateBody(updateGoalProgressSchema),
  GoalController.updateGoalProgress,
);

// POST /goals/:id/cancel - Cancel a goal
router.post(
  '/:id/cancel',
  validateParams(objectIdSchema),
  GoalController.cancelGoal,
);

export default router;
