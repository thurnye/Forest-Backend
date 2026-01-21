"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentIdParamSchema = exports.objectIdSchema = exports.assessmentQuerySchema = exports.completeAssessmentSchema = exports.createAssessmentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAssessmentSchema = joi_1.default.object({
    studentId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    type: joi_1.default.string().valid('diagnostic', 'placement', 'progress', 'mastery').required(),
});
const resultSchema = joi_1.default.object({
    skillStrand: joi_1.default.string().required(),
    score: joi_1.default.number().min(0).max(100).required(),
    level: joi_1.default.string().required(),
});
exports.completeAssessmentSchema = joi_1.default.object({
    results: joi_1.default.array().items(resultSchema).min(1).required(),
    overallScore: joi_1.default.number().min(0).max(100).required(),
    determinedLevel: joi_1.default.string().required(),
    recommendations: joi_1.default.array().items(joi_1.default.string()),
    timeSpent: joi_1.default.number().integer().min(0).required(),
});
exports.assessmentQuerySchema = joi_1.default.object({
    type: joi_1.default.string().valid('diagnostic', 'placement', 'progress', 'mastery'),
    status: joi_1.default.string().valid('pending', 'in-progress', 'completed'),
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
//# sourceMappingURL=assessment.validator.js.map