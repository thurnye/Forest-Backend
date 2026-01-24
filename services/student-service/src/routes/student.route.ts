import { Router } from 'express';
import { StudentController } from '../controllers';
import { validateBody, validateParams } from '../middleware/validate';
import {
  createStudentSchema,
  updateStudentSchema,
  objectIdSchema,
  guardianIdSchema,
} from '../utils/validators/student.validator';

const router = Router();

// GET /students/lookup - Lookup student by email (must be before :id route)
router.get('/lookup', StudentController.lookupByEmail);

// GET /students/guardian/:guardianId - Get all students for a guardian
router.get(
  '/guardian/:guardianId',
  validateParams(guardianIdSchema),
  StudentController.getStudentsByGuardian,
);

// GET /students/:id/verify-ownership - Verify student belongs to guardian
router.get(
  '/:id/verify-ownership',
  validateParams(objectIdSchema),
  StudentController.verifyOwnership,
);

// GET /students/:id - Get student detail
router.get(
  '/:id',
  validateParams(objectIdSchema),
  StudentController.getStudentDetail,
);

// POST /students - Create a new student
router.post(
  '/',
  validateBody(createStudentSchema),
  StudentController.createStudent,
);

// PATCH /students/:id - Update a student
router.patch(
  '/:id',
  validateParams(objectIdSchema),
  validateBody(updateStudentSchema),
  StudentController.updateStudent,
);

// DELETE /students/:id - Soft delete a student
router.delete(
  '/:id',
  validateParams(objectIdSchema),
  StudentController.deleteStudent,
);

// POST /students/:id/link - Link student to guardian
router.post(
  '/:id/link',
  validateParams(objectIdSchema),
  StudentController.linkToGuardian,
);

// POST /students/:id/unlink - Unlink student from guardian
router.post(
  '/:id/unlink',
  validateParams(objectIdSchema),
  StudentController.unlinkFromGuardian,
);

export default router;
