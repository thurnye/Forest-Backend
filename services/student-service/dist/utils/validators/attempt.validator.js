"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyParamSchema = exports.studentIdParamSchema = exports.objectIdSchema = exports.attemptQuerySchema = exports.completeAttemptSchema = exports.updateAnswersSchema = exports.startAttemptSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.startAttemptSchema = joi_1.default.object({
    studentId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    exerciseId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
});
exports.updateAnswersSchema = joi_1.default.object({
    answers: joi_1.default.object().pattern(joi_1.default.string(), joi_1.default.string()).required(),
});
exports.completeAttemptSchema = joi_1.default.object({
    answers: joi_1.default.object().pattern(joi_1.default.string(), joi_1.default.string()).required(),
    timeSpent: joi_1.default.number().integer().min(0).required(),
});
exports.attemptQuerySchema = joi_1.default.object({
    exerciseId: joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/),
    status: joi_1.default.string().valid('in-progress', 'completed', 'abandoned'),
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
exports.historyParamSchema = joi_1.default.object({
    studentId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    exerciseId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
});
//# sourceMappingURL=attempt.validator.js.map