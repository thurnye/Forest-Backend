"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentIdParamSchema = exports.objectIdSchema = exports.assignmentQuerySchema = exports.updateStatusSchema = exports.createAssignmentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createAssignmentSchema = joi_1.default.object({
    studentId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    exerciseId: joi_1.default.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required(),
    dueDate: joi_1.default.date(),
});
exports.updateStatusSchema = joi_1.default.object({
    status: joi_1.default.string().valid('pending', 'in-progress', 'completed').required(),
});
exports.assignmentQuerySchema = joi_1.default.object({
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
//# sourceMappingURL=assignment.validator.js.map