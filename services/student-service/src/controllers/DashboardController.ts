import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services';
import { success } from '@readingForest/libs';

class DashboardController {
  /**
   * GET /dashboard/:studentId
   * Get all dashboard data (progress + goals) for a student
   */
  async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const dashboardData = await DashboardService.getDashboardData(studentId);
      success(res, dashboardData, 'Dashboard data fetched successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
