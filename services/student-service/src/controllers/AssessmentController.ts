import { Request, Response, NextFunction } from 'express';
import { AssessmentService } from '../services';

class AssessmentController {
  /**
   * GET /assessments/student/:studentId
   * Get assessments for a student
   */
  async getAssessments(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const { type, status, limit, skip } = req.query;

      const assessments = await AssessmentService.getAssessmentsByStudentId(studentId, {
        type: type as string,
        status: status as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        skip: skip ? parseInt(skip as string, 10) : undefined,
      });

      res.json(assessments);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /assessments/:id
   * Get assessment by ID
   */
  async getAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const assessment = await AssessmentService.getAssessmentById(id);
      res.json(assessment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /assessments
   * Create a new assessment
   */
  async createAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const assessment = await AssessmentService.createAssessment(req.body);
      res.status(201).json(assessment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /assessments/:id/start
   * Start an assessment
   */
  async startAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const assessment = await AssessmentService.startAssessment(id);
      res.json(assessment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /assessments/:id/complete
   * Complete an assessment with results
   */
  async completeAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const assessment = await AssessmentService.completeAssessment(id, req.body);
      res.json(assessment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /assessments/student/:studentId/diagnostic
   * Get latest diagnostic assessment for a student
   */
  async getLatestDiagnostic(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const assessment = await AssessmentService.getLatestDiagnostic(studentId);
      res.json(assessment);
    } catch (error) {
      next(error);
    }
  }
}

export default new AssessmentController();
