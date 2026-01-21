import { Router } from 'express';
import GuardianController from '../controllers/guardianController';
import { guardianAuth, GuardianRequest } from '../middleware/guardianAuth';
import { validateBody, validateParams, validateQuery } from '../middleware/validate';
import {
  createStudentSchema,
  linkStudentSchema,
  createAssignmentSchema,
  createGoalSchema,
  updateDiagnosticSchema,
  exerciseQuerySchema,
  goalQuerySchema,
  studentIdParamSchema,
} from '../utils/validators/guardian.validator';

const router = Router();

// Apply guardian auth to all routes
router.use(guardianAuth);

// ==================== STUDENTS ====================

// GET /students - Get all students for guardian
router.get('/students', (req, res, next) =>
  GuardianController.getStudents(req as GuardianRequest, res, next),
);

// GET /students/:studentId - Get student detail
router.get(
  '/students/:studentId',
  validateParams(studentIdParamSchema),
  (req, res, next) => GuardianController.getStudentDetail(req as GuardianRequest, res, next),
);

// POST /students - Create a new student
router.post(
  '/students',
  validateBody(createStudentSchema),
  (req, res, next) => GuardianController.createStudent(req as GuardianRequest, res, next),
);

// POST /students/link - Link existing student by email
router.post(
  '/students/link',
  validateBody(linkStudentSchema),
  (req, res, next) => GuardianController.linkStudent(req as GuardianRequest, res, next),
);

// DELETE /students/:studentId - Unlink student from guardian
router.delete(
  '/students/:studentId',
  validateParams(studentIdParamSchema),
  (req, res, next) => GuardianController.unlinkStudent(req as GuardianRequest, res, next),
);

// ==================== EXERCISES ====================

// GET /exercises - Get exercises
router.get(
  '/exercises',
  validateQuery(exerciseQuerySchema),
  (req, res, next) => GuardianController.getExercises(req as GuardianRequest, res, next),
);

// ==================== ASSIGNMENTS ====================

// POST /students/:studentId/assignments - Create assignment
router.post(
  '/students/:studentId/assignments',
  validateParams(studentIdParamSchema),
  validateBody(createAssignmentSchema),
  (req, res, next) => GuardianController.createAssignment(req as GuardianRequest, res, next),
);

// ==================== GOALS ====================

// POST /goals - Create a goal
router.post(
  '/goals',
  validateBody(createGoalSchema),
  (req, res, next) => GuardianController.createGoal(req as GuardianRequest, res, next),
);

// GET /students/:studentId/goals - Get goals for student
router.get(
  '/students/:studentId/goals',
  validateParams(studentIdParamSchema),
  validateQuery(goalQuerySchema),
  (req, res, next) => GuardianController.getStudentGoals(req as GuardianRequest, res, next),
);

// ==================== DIAGNOSTIC ====================

// PATCH /students/:studentId/diagnostic - Update diagnostic setting
router.patch(
  '/students/:studentId/diagnostic',
  validateParams(studentIdParamSchema),
  validateBody(updateDiagnosticSchema),
  (req, res, next) => GuardianController.updateDiagnostic(req as GuardianRequest, res, next),
);

export default router;
