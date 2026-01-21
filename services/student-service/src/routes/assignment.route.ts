import { Router } from 'express';
import { AssignmentController } from '../controllers';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '../middleware/validate';
import {
  createAssignmentSchema,
  updateStatusSchema,
  assignmentQuerySchema,
  objectIdSchema,
  studentIdParamSchema,
} from '../utils/validators/assignment.validator';

const router = Router();

// GET /assignments/student/:studentId - Get assignments for a student
router.get(
  '/student/:studentId',
  validateParams(studentIdParamSchema),
  validateQuery(assignmentQuerySchema),
  AssignmentController.getAssignments,
);

// GET /assignments/student/:studentId/pending/count - Get pending count
router.get(
  '/student/:studentId/pending/count',
  validateParams(studentIdParamSchema),
  AssignmentController.getPendingCount,
);

// GET /assignments/:id - Get assignment by ID
router.get(
  '/:id',
  validateParams(objectIdSchema),
  AssignmentController.getAssignment,
);

// POST /assignments - Create a new assignment
router.post(
  '/',
  validateBody(createAssignmentSchema),
  AssignmentController.createAssignment,
);

// PATCH /assignments/:id/status - Update assignment status
router.patch(
  '/:id/status',
  validateParams(objectIdSchema),
  validateBody(updateStatusSchema),
  AssignmentController.updateStatus,
);

// DELETE /assignments/:id - Delete assignment
router.delete(
  '/:id',
  validateParams(objectIdSchema),
  AssignmentController.deleteAssignment,
);

export default router;
