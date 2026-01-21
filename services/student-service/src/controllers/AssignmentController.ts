import { Request, Response, NextFunction } from 'express';
import { AssignmentService } from '../services';

class AssignmentController {
  /**
   * GET /assignments/student/:studentId
   * Get assignments for a student
   */
  async getAssignments(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const { status, limit, skip } = req.query;

      const assignments = await AssignmentService.getAssignmentsByStudentId(studentId, {
        status: status as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        skip: skip ? parseInt(skip as string, 10) : undefined,
      });

      res.json(assignments);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /assignments/:id
   * Get assignment by ID
   */
  async getAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const assignment = await AssignmentService.getAssignmentById(id);
      res.json(assignment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /assignments
   * Create a new assignment
   */
  async createAssignment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { studentId, exerciseId, dueDate } = req.body;
      const assignedBy = req.headers['x-user-id'] as string;

      if (!assignedBy) {
        res.status(401).json({ error: 'User ID required' });
        return;
      }

      const assignment = await AssignmentService.createAssignment({
        studentId,
        exerciseId,
        assignedBy,
        dueDate,
      });

      res.status(201).json(assignment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /assignments/:id/status
   * Update assignment status
   */
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const assignment = await AssignmentService.updateAssignmentStatus(id, status);
      res.json(assignment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /assignments/:id
   * Delete assignment
   */
  async deleteAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const assignment = await AssignmentService.deleteAssignment(id);
      res.json(assignment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /assignments/student/:studentId/pending/count
   * Get pending assignments count
   */
  async getPendingCount(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const count = await AssignmentService.getPendingAssignmentsCount(studentId);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  }
}

export default new AssignmentController();
