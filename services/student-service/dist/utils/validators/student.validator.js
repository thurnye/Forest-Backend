"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardianIdSchema = exports.objectIdSchema = exports.updateStudentSchema = exports.createStudentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createStudentSchema = joi_1.default.object({
    guardianId: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    firstName: joi_1.default.string().required().trim(),
    lastName: joi_1.default.string().required().trim(),
    username: joi_1.default.string().trim(),
    avatar: joi_1.default.string(),
    dateOfBirth: joi_1.default.date(),
    grade: joi_1.default.string(),
    targetGradeLevel: joi_1.default.string(),
    diagnosticEnabled: joi_1.default.boolean(),
});
exports.updateStudentSchema = joi_1.default.object({
    firstName: joi_1.default.string().trim(),
    lastName: joi_1.default.string().trim(),
    username: joi_1.default.string().trim(),
    avatar: joi_1.default.string(),
    dateOfBirth: joi_1.default.date(),
    grade: joi_1.default.string(),
    readingLevel: joi_1.default.string(),
    targetGradeLevel: joi_1.default.string(),
    hasCompletedDiagnostic: joi_1.default.boolean(),
    diagnosticEnabled: joi_1.default.boolean(),
}).min(1);
exports.objectIdSchema = joi_1.default.object({
    id: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
});
exports.guardianIdSchema = joi_1.default.object({
    guardianId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
});
//# sourceMappingURL=student.validator.js.map