import { Request, Response, NextFunction } from 'express';
import { ExerciseService } from '../services';

class ExerciseController {
  /**
   * GET /exercises
   * Get exercises by reading level with optional filters
   */
  async getExercises(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { readingLevel, skillStrand, type, limit, skip } = req.query;

      if (!readingLevel) {
        res.status(400).json({ error: 'readingLevel is required' });
        return;
      }

      const exercises = await ExerciseService.getExercisesByLevel(readingLevel as string, {
        skillStrand: skillStrand as string,
        type: type as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        skip: skip ? parseInt(skip as string, 10) : undefined,
      });

      res.json(exercises);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /exercises/:id
   * Get exercise for student (without answers)
   */
  async getExercise(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const exercise = await ExerciseService.getExerciseForStudent(id);
      res.json(exercise);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /exercises/:id/full
   * Get exercise with full details (for grading/admin)
   */
  async getExerciseFull(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const exercise = await ExerciseService.getExerciseById(id);
      res.json(exercise);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /exercises
   * Create a new exercise
   */
  async createExercise(req: Request, res: Response, next: NextFunction) {
    try {
      const exercise = await ExerciseService.createExercise(req.body);
      res.status(201).json(exercise);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /exercises/:id
   * Update an exercise
   */
  async updateExercise(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const exercise = await ExerciseService.updateExercise(id, req.body);
      res.json(exercise);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /exercises/:id
   * Soft delete an exercise
   */
  async deleteExercise(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const exercise = await ExerciseService.deleteExercise(id);
      res.json(exercise);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /exercises/count/:readingLevel
   * Get count of exercises for a reading level
   */
  async getExerciseCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { readingLevel } = req.params;
      const count = await ExerciseService.getExerciseCountByLevel(readingLevel);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  }
}

export default new ExerciseController();
