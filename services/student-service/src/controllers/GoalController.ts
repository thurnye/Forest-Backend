import { Request, Response, NextFunction } from 'express';
import { GoalService } from '../services';

class GoalController {
  /**
   * GET /goals/student/:studentId
   * Get goals for a student
   */
  async getGoals(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const { status, limit, skip } = req.query;

      const goals = await GoalService.getGoalsByStudentId(studentId, {
        status: status as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        skip: skip ? parseInt(skip as string, 10) : undefined,
      });

      res.json(goals);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /goals/:id
   * Get goal by ID
   */
  async getGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const goal = await GoalService.getGoalById(id);
      res.json(goal);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /goals
   * Create a new goal
   */
  async createGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const goal = await GoalService.createGoal(req.body);
      res.status(201).json(goal);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /goals/:id
   * Update a goal
   */
  async updateGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const goal = await GoalService.updateGoal(id, req.body);
      res.json(goal);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /goals/:id/progress
   * Update goal progress
   */
  async updateGoalProgress(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { currentValue } = req.body;
      const goal = await GoalService.updateGoalProgress(id, currentValue);
      res.json(goal);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /goals/:id/cancel
   * Cancel a goal
   */
  async cancelGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const goal = await GoalService.cancelGoal(id);
      res.json(goal);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /goals/student/:studentId/active/count
   * Get active goals count for a student
   */
  async getActiveGoalsCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const count = await GoalService.getActiveGoalsCount(studentId);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  }
}

export default new GoalController();
