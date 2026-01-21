import { Request, Response, NextFunction } from 'express';
import { AttemptService } from '../services';

class AttemptController {
  /**
   * GET /attempts/student/:studentId
   * Get attempts for a student
   */
  async getAttempts(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const { exerciseId, status, limit, skip } = req.query;

      const attempts = await AttemptService.getAttemptsByStudentId(studentId, {
        exerciseId: exerciseId as string,
        status: status as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        skip: skip ? parseInt(skip as string, 10) : undefined,
      });

      res.json(attempts);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /attempts/:id
   * Get attempt by ID
   */
  async getAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const attempt = await AttemptService.getAttemptById(id);
      res.json(attempt);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /attempts
   * Start a new exercise attempt
   */
  async startAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId, exerciseId } = req.body;
      const attempt = await AttemptService.startAttempt(studentId, exerciseId);
      res.status(201).json(attempt);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /attempts/:id/answers
   * Update answers during an attempt
   */
  async updateAnswers(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { answers } = req.body;
      const attempt = await AttemptService.updateAnswers(id, answers);
      res.json(attempt);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /attempts/:id/complete
   * Complete an attempt
   */
  async completeAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const attempt = await AttemptService.completeAttempt(id, req.body);
      res.json(attempt);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /attempts/:id/abandon
   * Abandon an attempt
   */
  async abandonAttempt(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const attempt = await AttemptService.abandonAttempt(id);
      res.json(attempt);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /attempts/history/:studentId/:exerciseId
   * Get attempt history for a specific exercise
   */
  async getAttemptHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId, exerciseId } = req.params;
      const attempts = await AttemptService.getAttemptHistory(studentId, exerciseId);
      res.json(attempts);
    } catch (error) {
      next(error);
    }
  }
}

export default new AttemptController();
