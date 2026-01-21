"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentIdParamSchema = exports.objectIdSchema = exports.goalQuerySchema = exports.updateGoalProgressSchema = exports.updateGoalSchema = exports.createGoalSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createGoalSchema = joi_1.default.object({
    studentId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    title: joi_1.default.string().required().trim(),
    description: joi_1.default.string(),
    type: joi_1.default.string().valid('exercises', 'time', 'streak', 'score', 'level').required(),
    targetValue: joi_1.default.number().required(),
    unit: joi_1.default.string().required(),
    deadline: joi_1.default.date().required(),
    createdBy: joi_1.default.string().valid('student', 'parent', 'teacher', 'system'),
});
exports.updateGoalSchema = joi_1.default.object({
    title: joi_1.default.string().trim(),
    description: joi_1.default.string(),
    targetValue: joi_1.default.number(),
    currentValue: joi_1.default.number(),
    deadline: joi_1.default.date(),
    status: joi_1.default.string().valid('active', 'completed', 'expired', 'cancelled'),
}).min(1);
exports.updateGoalProgressSchema = joi_1.default.object({
    currentValue: joi_1.default.number().required(),
});
exports.goalQuerySchema = joi_1.default.object({
    status: joi_1.default.string().valid('active', 'completed', 'expired', 'cancelled'),
    limit: joi_1.default.number().integer().min(1).max(100),
    skip: joi_1.default.number().integer().min(0),
});
exports.objectIdSchema = joi_1.default.object({
    id: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
});
exports.studentIdParamSchema = joi_1.default.object({
    studentId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
});
//# sourceMappingURL=goal.validator.js.map