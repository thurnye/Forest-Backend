"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const validate_1 = require("../middleware/validate");
const assignment_validator_1 = require("../utils/validators/assignment.validator");
const router = (0, express_1.Router)();
router.get('/student/:studentId', (0, validate_1.validateParams)(assignment_validator_1.studentIdParamSchema), (0, validate_1.validateQuery)(assignment_validator_1.assignmentQuerySchema), controllers_1.AssignmentController.getAssignments);
router.get('/student/:studentId/pending/count', (0, validate_1.validateParams)(assignment_validator_1.studentIdParamSchema), controllers_1.AssignmentController.getPendingCount);
router.get('/:id', (0, validate_1.validateParams)(assignment_validator_1.objectIdSchema), controllers_1.AssignmentController.getAssignment);
router.post('/', (0, validate_1.validateBody)(assignment_validator_1.createAssignmentSchema), controllers_1.AssignmentController.createAssignment);
router.patch('/:id/status', (0, validate_1.validateParams)(assignment_validator_1.objectIdSchema), (0, validate_1.validateBody)(assignment_validator_1.updateStatusSchema), controllers_1.AssignmentController.updateStatus);
router.delete('/:id', (0, validate_1.validateParams)(assignment_validator_1.objectIdSchema), controllers_1.AssignmentController.deleteAssignment);
exports.default = router;
//# sourceMappingURL=assignment.route.js.map