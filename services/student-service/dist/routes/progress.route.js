"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const validate_1 = require("../middleware/validate");
const progress_validator_1 = require("../utils/validators/progress.validator");
const router = (0, express_1.Router)();
router.post('/:studentId/init', (0, validate_1.validateParams)(progress_validator_1.studentIdParamSchema), controllers_1.ProgressController.createInitialProgress);
router.get('/:studentId', (0, validate_1.validateParams)(progress_validator_1.studentIdParamSchema), controllers_1.ProgressController.getProgress);
router.patch('/:studentId', (0, validate_1.validateParams)(progress_validator_1.studentIdParamSchema), (0, validate_1.validateBody)(progress_validator_1.updateProgressSchema), controllers_1.ProgressController.updateProgress);
router.post('/:studentId/streak', (0, validate_1.validateParams)(progress_validator_1.studentIdParamSchema), controllers_1.ProgressController.updateStreak);
exports.default = router;
//# sourceMappingURL=progress.route.js.map