import { Router } from 'express';
import { ExerciseController } from '../controllers';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validate';
import {
  createExerciseSchema,
  updateExerciseSchema,
  exerciseQuerySchema,
  objectIdSchema,
  readingLevelParamSchema,
} from '../utils/validators/exercise.validator';

const router = Router();

// GET /exercises - Get exercises by reading level
router.get(
  '/',
  validateQuery(exerciseQuerySchema),
  ExerciseController.getExercises,
);

// GET /exercises/count/:readingLevel - Get exercises count by level
router.get(
  '/count/:readingLevel',
  validateParams(readingLevelParamSchema),
  ExerciseController.getExerciseCount,
);

// GET /exercises/:id - Get exercise for student (without answers)
router.get(
  '/:id',
  validateParams(objectIdSchema),
  ExerciseController.getExercise,
);

// GET /exercises/:id/full - Get exercise with full details
router.get(
  '/:id/full',
  validateParams(objectIdSchema),
  ExerciseController.getExerciseFull,
);

// POST /exercises - Create a new exercise
router.post(
  '/',
  validateBody(createExerciseSchema),
  ExerciseController.createExercise,
);

// PATCH /exercises/:id - Update an exercise
router.patch(
  '/:id',
  validateParams(objectIdSchema),
  validateBody(updateExerciseSchema),
  ExerciseController.updateExercise,
);

// DELETE /exercises/:id - Soft delete an exercise
router.delete(
  '/:id',
  validateParams(objectIdSchema),
  ExerciseController.deleteExercise,
);

export default router;
