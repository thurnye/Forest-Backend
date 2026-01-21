"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readingLevelParamSchema = exports.objectIdSchema = exports.exerciseQuerySchema = exports.updateExerciseSchema = exports.createExerciseSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const questionSchema = joi_1.default.object({
    questionText: joi_1.default.string().required(),
    questionType: joi_1.default.string()
        .valid('multiple-choice', 'fill-blank', 'drag-drop', 'audio', 'matching')
        .required(),
    options: joi_1.default.array().items(joi_1.default.string()),
    correctAnswer: joi_1.default.string().required(),
    points: joi_1.default.number().integer().min(1),
    explanation: joi_1.default.string(),
});
exports.createExerciseSchema = joi_1.default.object({
    title: joi_1.default.string().required().trim(),
    description: joi_1.default.string(),
    type: joi_1.default.string()
        .valid('phonics', 'vocabulary', 'comprehension', 'fluency', 'spelling', 'grammar', 'writing')
        .required(),
    readingLevel: joi_1.default.string()
        .valid('pre-k', 'k', '1', '2', '3', '4', '5', '6', '7', '8')
        .required(),
    skillStrand: joi_1.default.string().required(),
    estimatedTime: joi_1.default.number().integer().min(1),
    points: joi_1.default.number().integer().min(1),
    order: joi_1.default.number().integer(),
    questions: joi_1.default.array().items(questionSchema).min(1).required(),
    tags: joi_1.default.array().items(joi_1.default.string()),
    prerequisites: joi_1.default.array().items(joi_1.default.string()),
});
exports.updateExerciseSchema = joi_1.default.object({
    title: joi_1.default.string().trim(),
    description: joi_1.default.string(),
    type: joi_1.default.string().valid('phonics', 'vocabulary', 'comprehension', 'fluency', 'spelling', 'grammar', 'writing'),
    readingLevel: joi_1.default.string().valid('pre-k', 'k', '1', '2', '3', '4', '5', '6', '7', '8'),
    skillStrand: joi_1.default.string(),
    estimatedTime: joi_1.default.number().integer().min(1),
    points: joi_1.default.number().integer().min(1),
    order: joi_1.default.number().integer(),
    questions: joi_1.default.array().items(questionSchema).min(1),
    tags: joi_1.default.array().items(joi_1.default.string()),
    prerequisites: joi_1.default.array().items(joi_1.default.string()),
    isActive: joi_1.default.boolean(),
}).min(1);
exports.exerciseQuerySchema = joi_1.default.object({
    readingLevel: joi_1.default.string()
        .valid('pre-k', 'k', '1', '2', '3', '4', '5', '6', '7', '8')
        .required(),
    skillStrand: joi_1.default.string(),
    type: joi_1.default.string(),
    limit: joi_1.default.number().integer().min(1).max(100),
    skip: joi_1.default.number().integer().min(0),
});
exports.objectIdSchema = joi_1.default.object({
    id: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
});
exports.readingLevelParamSchema = joi_1.default.object({
    readingLevel: joi_1.default.string()
        .valid('pre-k', 'k', '1', '2', '3', '4', '5', '6', '7', '8')
        .required(),
});
//# sourceMappingURL=exercise.validator.js.map