"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const validate_1 = require("../middleware/validate");
const attempt_validator_1 = require("../utils/validators/attempt.validator");
const router = (0, express_1.Router)();
router.get('/student/:studentId', (0, validate_1.validateParams)(attempt_validator_1.studentIdParamSchema), (0, validate_1.validateQuery)(attempt_validator_1.attemptQuerySchema), controllers_1.AttemptController.getAttempts);
router.get('/history/:studentId/:exerciseId', (0, validate_1.validateParams)(attempt_validator_1.historyParamSchema), controllers_1.AttemptController.getAttemptHistory);
router.get('/:id', (0, validate_1.validateParams)(attempt_validator_1.objectIdSchema), controllers_1.AttemptController.getAttempt);
router.post('/', (0, validate_1.validateBody)(attempt_validator_1.startAttemptSchema), controllers_1.AttemptController.startAttempt);
router.patch('/:id/answers', (0, validate_1.validateParams)(attempt_validator_1.objectIdSchema), (0, validate_1.validateBody)(attempt_validator_1.updateAnswersSchema), controllers_1.AttemptController.updateAnswers);
router.post('/:id/complete', (0, validate_1.validateParams)(attempt_validator_1.objectIdSchema), (0, validate_1.validateBody)(attempt_validator_1.completeAttemptSchema), controllers_1.AttemptController.completeAttempt);
router.post('/:id/abandon', (0, validate_1.validateParams)(attempt_validator_1.objectIdSchema), controllers_1.AttemptController.abandonAttempt);
exports.default = router;
//# sourceMappingURL=attempt.route.js.map