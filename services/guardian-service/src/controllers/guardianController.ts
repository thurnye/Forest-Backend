import { Response, NextFunction } from 'express';
import { GuardianRequest } from '../middleware/guardianAuth';
import GuardianService from '../services/guardianService';
import { success } from '@readingForest/libs';

class GuardianController {
  /**
   * GET /students
   * Get all students for the guardian
   */
  async getStudents(req: GuardianRequest, res: Response, next: NextFunction) {
    try {
      const students = await GuardianService.getStudents(req.guardianId);
      success(res, students, 'Students fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /students/:studentId
   * Get student detail
   */
  async getStudentDetail(req: GuardianRequest, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const student = await GuardianService.getStudentDetail(req.guardianId, studentId);
      success(res, student, 'Student detail fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /students/register
   * Register a new student via auth-service
   */
  async registerStudent(req: GuardianRequest, res: Response, next: NextFunction) {
    try {
      const student = await GuardianService.registerStudent(req.guardianId, req.body);
      success(res, student, 'Student registered successfully', undefined, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /students/link
   * Link student by email
   */
  async linkStudent(req: GuardianRequest, res: Response, next: NextFunction) {
    try {
      const { studentEmail } = req.body;
      const student = await GuardianService.linkStudentByEmail(req.guardianId, studentEmail);
      success(res, student, 'Student linked successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /students/:studentId
   * Unlink student from guardian
   */
  async unlinkStudent(req: GuardianRequest, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const result = await GuardianService.unlinkStudent(req.guardianId, studentId);
      success(res, result, 'Student unlinked successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /exercises
   * Get exercises (proxy to student-service)
   */
  async getExercises(req: GuardianRequest, res: Response, next: NextFunction) {
    try {
      const { readingLevel, skillStrand, type, limit, skip } = req.query;
      const exercises = await GuardianService.getExercises(req.guardianId, {
        readingLevel: readingLevel as string,
        skillStrand: skillStrand as string,
        type: type as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        skip: skip ? parseInt(skip as string, 10) : undefined,
      });
      success(res, exercises, 'Exercises fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /students/:studentId/assignments
   * Create assignment for student
   */
  async createAssignment(req: GuardianRequest, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const { exerciseId, dueDate } = req.body;
      const assignment = await GuardianService.createAssignment(
        req.guardianId,
        studentId,
        exerciseId,
        dueDate ? new Date(dueDate) : undefined,
      );
      success(res, assignment, 'Assignment created successfully', undefined, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /goals
   * Create goal for student
   */
  async createGoal(req: GuardianRequest, res: Response, next: NextFunction) {
    try {
      const goal = await GuardianService.createGoal(req.guardianId, {
        ...req.body,
        deadline: new Date(req.body.deadline),
      });
      success(res, goal, 'Goal created successfully', undefined, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /students/:studentId/goals
   * Get goals for student
   */
  async getStudentGoals(req: GuardianRequest, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const { status, limit, skip } = req.query;
      const goals = await GuardianService.getStudentGoals(req.guardianId, studentId, {
        status: status as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        skip: skip ? parseInt(skip as string, 10) : undefined,
      });
      success(res, goals, 'Goals fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /students/:studentId/diagnostic
   * Update diagnostic setting
   */
  async updateDiagnostic(req: GuardianRequest, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const { enabled } = req.body;
      const student = await GuardianService.updateDiagnosticSetting(
        req.guardianId,
        studentId,
        enabled,
      );
      success(res, student, 'Diagnostic setting updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new GuardianController();
