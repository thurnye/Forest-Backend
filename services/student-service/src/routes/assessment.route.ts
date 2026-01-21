import { Router } from 'express';
import { AssessmentController } from '../controllers';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validate';
import {
  createAssessmentSchema,
  completeAssessmentSchema,
  assessmentQuerySchema,
  objectIdSchema,
  studentIdParamSchema,
} from '../utils/validators/assessment.validator';

const router = Router();

// GET /assessments/student/:studentId - Get assessments for a student
router.get(
  '/student/:studentId',
  validateParams(studentIdParamSchema),
  validateQuery(assessmentQuerySchema),
  AssessmentController.getAssessments,
);

// GET /assessments/student/:studentId/diagnostic - Get latest diagnostic for a student
router.get(
  '/student/:studentId/diagnostic',
  validateParams(studentIdParamSchema),
  AssessmentController.getLatestDiagnostic,
);

// GET /assessments/:id - Get assessment by ID
router.get(
  '/:id',
  validateParams(objectIdSchema),
  AssessmentController.getAssessment,
);

// POST /assessments - Create a new assessment
router.post(
  '/',
  validateBody(createAssessmentSchema),
  AssessmentController.createAssessment,
);

// POST /assessments/:id/start - Start an assessment
router.post(
  '/:id/start',
  validateParams(objectIdSchema),
  AssessmentController.startAssessment,
);

// POST /assessments/:id/complete - Complete an assessment
router.post(
  '/:id/complete',
  validateParams(objectIdSchema),
  validateBody(completeAssessmentSchema),
  AssessmentController.completeAssessment,
);

export default router;
