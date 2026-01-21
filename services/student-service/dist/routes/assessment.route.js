"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const validate_1 = require("../middleware/validate");
const assessment_validator_1 = require("../utils/validators/assessment.validator");
const router = (0, express_1.Router)();
router.get('/student/:studentId', (0, validate_1.validateParams)(assessment_validator_1.studentIdParamSchema), (0, validate_1.validateQuery)(assessment_validator_1.assessmentQuerySchema), controllers_1.AssessmentController.getAssessments);
router.get('/student/:studentId/diagnostic', (0, validate_1.validateParams)(assessment_validator_1.studentIdParamSchema), controllers_1.AssessmentController.getLatestDiagnostic);
router.get('/:id', (0, validate_1.validateParams)(assessment_validator_1.objectIdSchema), controllers_1.AssessmentController.getAssessment);
router.post('/', (0, validate_1.validateBody)(assessment_validator_1.createAssessmentSchema), controllers_1.AssessmentController.createAssessment);
router.post('/:id/start', (0, validate_1.validateParams)(assessment_validator_1.objectIdSchema), controllers_1.AssessmentController.startAssessment);
router.post('/:id/complete', (0, validate_1.validateParams)(assessment_validator_1.objectIdSchema), (0, validate_1.validateBody)(assessment_validator_1.completeAssessmentSchema), controllers_1.AssessmentController.completeAssessment);
exports.default = router;
//# sourceMappingURL=assessment.route.js.map