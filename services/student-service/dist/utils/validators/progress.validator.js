"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentIdParamSchema = exports.updateProgressSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateProgressSchema = joi_1.default.object({
    currentLevel: joi_1.default.string(),
    exercisesCompleted: joi_1.default.number().integer().min(0),
    totalExercises: joi_1.default.number().integer().min(0),
    averageScore: joi_1.default.number().min(0).max(100),
    streakDays: joi_1.default.number().integer().min(0),
    lastActivityAt: joi_1.default.date(),
}).min(1);
exports.studentIdParamSchema = joi_1.default.object({
    studentId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
});
//# sourceMappingURL=progress.validator.js.map