"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentIdParamSchema = exports.goalQuerySchema = exports.exerciseQuerySchema = exports.updateDiagnosticSchema = exports.createGoalSchema = exports.createAssignmentSchema = exports.linkStudentSchema = exports.registerStudentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerStudentSchema = joi_1.default.object({
    password: joi_1.default.string().min(6).required(),
    firstName: joi_1.default.string().required().trim(),
    lastName: joi_1.default.string().required().trim(),
    username: joi_1.default.string().trim(),
    avatar: joi_1.default.string(),
    dateOfBirth: joi_1.default.date(),
    grade: joi_1.default.string(),
    targetGradeLevel: joi_1.default.string(),
    diagnosticEnabled: joi_1.default.boolean().default(true),
});
exports.linkStudentSchema = joi_1.default.object({
    studentEmail: joi_1.default.string().email().required(),
});
exports.createAssignmentSchema = joi_1.default.object({
    exerciseId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    dueDate: joi_1.default.date(),
});
exports.createGoalSchema = joi_1.default.object({
    studentId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    title: joi_1.default.string().required().trim(),
    description: joi_1.default.string().trim(),
    type: joi_1.default.string().valid('exercises', 'time', 'streak', 'score', 'level').required(),
    targetValue: joi_1.default.number().required(),
    unit: joi_1.default.string().required(),
    deadline: joi_1.default.date().required(),
});
exports.updateDiagnosticSchema = joi_1.default.object({
    enabled: joi_1.default.boolean().required(),
});
exports.exerciseQuerySchema = joi_1.default.object({
    readingLevel: joi_1.default.string(),
    skillStrand: joi_1.default.string(),
    type: joi_1.default.string(),
    limit: joi_1.default.number().integer().min(1).max(100),
    skip: joi_1.default.number().integer().min(0),
});
exports.goalQuerySchema = joi_1.default.object({
    status: joi_1.default.string().valid('active', 'completed', 'expired', 'cancelled'),
    limit: joi_1.default.number().integer().min(1).max(100),
    skip: joi_1.default.number().integer().min(0),
});
exports.studentIdParamSchema = joi_1.default.object({
    studentId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
});
//# sourceMappingURL=guardian.validator.js.map