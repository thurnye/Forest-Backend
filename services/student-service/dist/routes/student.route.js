"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const validate_1 = require("../middleware/validate");
const student_validator_1 = require("../utils/validators/student.validator");
const router = (0, express_1.Router)();
router.get('/lookup', controllers_1.StudentController.lookupByEmail);
router.get('/guardian/:guardianId', (0, validate_1.validateParams)(student_validator_1.guardianIdSchema), controllers_1.StudentController.getStudentsByGuardian);
router.get('/:id/verify-ownership', (0, validate_1.validateParams)(student_validator_1.objectIdSchema), controllers_1.StudentController.verifyOwnership);
router.get('/:id', (0, validate_1.validateParams)(student_validator_1.objectIdSchema), controllers_1.StudentController.getStudentDetail);
router.post('/', (0, validate_1.validateBody)(student_validator_1.createStudentSchema), controllers_1.StudentController.createStudent);
router.patch('/:id', (0, validate_1.validateParams)(student_validator_1.objectIdSchema), (0, validate_1.validateBody)(student_validator_1.updateStudentSchema), controllers_1.StudentController.updateStudent);
router.delete('/:id', (0, validate_1.validateParams)(student_validator_1.objectIdSchema), controllers_1.StudentController.deleteStudent);
router.post('/:id/link', (0, validate_1.validateParams)(student_validator_1.objectIdSchema), controllers_1.StudentController.linkToGuardian);
router.post('/:id/unlink', (0, validate_1.validateParams)(student_validator_1.objectIdSchema), controllers_1.StudentController.unlinkFromGuardian);
exports.default = router;
//# sourceMappingURL=student.route.js.map