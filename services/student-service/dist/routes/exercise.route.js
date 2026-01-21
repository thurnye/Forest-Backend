"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const validate_1 = require("../middleware/validate");
const exercise_validator_1 = require("../utils/validators/exercise.validator");
const router = (0, express_1.Router)();
router.get('/', (0, validate_1.validateQuery)(exercise_validator_1.exerciseQuerySchema), controllers_1.ExerciseController.getExercises);
router.get('/count/:readingLevel', (0, validate_1.validateParams)(exercise_validator_1.readingLevelParamSchema), controllers_1.ExerciseController.getExerciseCount);
router.get('/:id', (0, validate_1.validateParams)(exercise_validator_1.objectIdSchema), controllers_1.ExerciseController.getExercise);
router.get('/:id/full', (0, validate_1.validateParams)(exercise_validator_1.objectIdSchema), controllers_1.ExerciseController.getExerciseFull);
router.post('/', (0, validate_1.validateBody)(exercise_validator_1.createExerciseSchema), controllers_1.ExerciseController.createExercise);
router.patch('/:id', (0, validate_1.validateParams)(exercise_validator_1.objectIdSchema), (0, validate_1.validateBody)(exercise_validator_1.updateExerciseSchema), controllers_1.ExerciseController.updateExercise);
router.delete('/:id', (0, validate_1.validateParams)(exercise_validator_1.objectIdSchema), controllers_1.ExerciseController.deleteExercise);
exports.default = router;
//# sourceMappingURL=exercise.route.js.map