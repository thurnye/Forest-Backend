"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guardianController_1 = __importDefault(require("../controllers/guardianController"));
const guardianAuth_1 = require("../middleware/guardianAuth");
const validate_1 = require("../middleware/validate");
const guardian_validator_1 = require("../utils/validators/guardian.validator");
const router = (0, express_1.Router)();
router.use(guardianAuth_1.guardianAuth);
router.get('/students', (req, res, next) => guardianController_1.default.getStudents(req, res, next));
router.get('/students/:studentId', (0, validate_1.validateParams)(guardian_validator_1.studentIdParamSchema), (req, res, next) => guardianController_1.default.getStudentDetail(req, res, next));
router.post('/students/register', (0, validate_1.validateBody)(guardian_validator_1.registerStudentSchema), (req, res, next) => guardianController_1.default.registerStudent(req, res, next));
router.post('/students/link', (0, validate_1.validateBody)(guardian_validator_1.linkStudentSchema), (req, res, next) => guardianController_1.default.linkStudent(req, res, next));
router.delete('/students/:studentId', (0, validate_1.validateParams)(guardian_validator_1.studentIdParamSchema), (req, res, next) => guardianController_1.default.unlinkStudent(req, res, next));
router.get('/exercises', (0, validate_1.validateQuery)(guardian_validator_1.exerciseQuerySchema), (req, res, next) => guardianController_1.default.getExercises(req, res, next));
router.post('/students/:studentId/assignments', (0, validate_1.validateParams)(guardian_validator_1.studentIdParamSchema), (0, validate_1.validateBody)(guardian_validator_1.createAssignmentSchema), (req, res, next) => guardianController_1.default.createAssignment(req, res, next));
router.post('/goals', (0, validate_1.validateBody)(guardian_validator_1.createGoalSchema), (req, res, next) => guardianController_1.default.createGoal(req, res, next));
router.get('/students/:studentId/goals', (0, validate_1.validateParams)(guardian_validator_1.studentIdParamSchema), (0, validate_1.validateQuery)(guardian_validator_1.goalQuerySchema), (req, res, next) => guardianController_1.default.getStudentGoals(req, res, next));
router.patch('/students/:studentId/diagnostic', (0, validate_1.validateParams)(guardian_validator_1.studentIdParamSchema), (0, validate_1.validateBody)(guardian_validator_1.updateDiagnosticSchema), (req, res, next) => guardianController_1.default.updateDiagnostic(req, res, next));
exports.default = router;
//# sourceMappingURL=guardian.route.js.map