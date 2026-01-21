"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const validate_1 = require("../middleware/validate");
const goal_validator_1 = require("../utils/validators/goal.validator");
const router = (0, express_1.Router)();
router.get('/student/:studentId', (0, validate_1.validateParams)(goal_validator_1.studentIdParamSchema), (0, validate_1.validateQuery)(goal_validator_1.goalQuerySchema), controllers_1.GoalController.getGoals);
router.get('/student/:studentId/active/count', (0, validate_1.validateParams)(goal_validator_1.studentIdParamSchema), controllers_1.GoalController.getActiveGoalsCount);
router.get('/:id', (0, validate_1.validateParams)(goal_validator_1.objectIdSchema), controllers_1.GoalController.getGoal);
router.post('/', (0, validate_1.validateBody)(goal_validator_1.createGoalSchema), controllers_1.GoalController.createGoal);
router.patch('/:id', (0, validate_1.validateParams)(goal_validator_1.objectIdSchema), (0, validate_1.validateBody)(goal_validator_1.updateGoalSchema), controllers_1.GoalController.updateGoal);
router.patch('/:id/progress', (0, validate_1.validateParams)(goal_validator_1.objectIdSchema), (0, validate_1.validateBody)(goal_validator_1.updateGoalProgressSchema), controllers_1.GoalController.updateGoalProgress);
router.post('/:id/cancel', (0, validate_1.validateParams)(goal_validator_1.objectIdSchema), controllers_1.GoalController.cancelGoal);
exports.default = router;
//# sourceMappingURL=goal.route.js.map