import { Request, Response, NextFunction } from 'express';
import { ProgressService } from '../services';

class ProgressController {
  /**
   * GET /progress/:studentId
   * Get progress for a student
   */
  async getProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const progress = await ProgressService.getProgressByStudentId(studentId);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /progress/:studentId
   * Update progress for a student
   */
  async updateProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const progress = await ProgressService.updateProgress(studentId, req.body);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /progress/:studentId/streak
   * Update streak for a student
   */
  async updateStreak(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const progress = await ProgressService.updateStreak(studentId);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProgressController();
