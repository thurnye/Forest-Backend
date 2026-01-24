"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guardianService_1 = __importDefault(require("../services/guardianService"));
const libs_1 = require("@readingForest/libs");
class GuardianController {
    async getStudents(req, res, next) {
        try {
            const students = await guardianService_1.default.getStudents(req.guardianId);
            (0, libs_1.success)(res, students, 'Students fetched successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async getStudentDetail(req, res, next) {
        try {
            const { studentId } = req.params;
            const student = await guardianService_1.default.getStudentDetail(req.guardianId, studentId);
            (0, libs_1.success)(res, student, 'Student detail fetched successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async registerStudent(req, res, next) {
        try {
            const student = await guardianService_1.default.registerStudent(req.guardianId, req.body);
            (0, libs_1.success)(res, student, 'Student registered successfully', undefined, 201);
        }
        catch (error) {
            next(error);
        }
    }
    async linkStudent(req, res, next) {
        try {
            const { studentEmail } = req.body;
            const student = await guardianService_1.default.linkStudentByEmail(req.guardianId, studentEmail);
            (0, libs_1.success)(res, student, 'Student linked successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async unlinkStudent(req, res, next) {
        try {
            const { studentId } = req.params;
            const result = await guardianService_1.default.unlinkStudent(req.guardianId, studentId);
            (0, libs_1.success)(res, result, 'Student unlinked successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async getExercises(req, res, next) {
        try {
            const { readingLevel, skillStrand, type, limit, skip } = req.query;
            const exercises = await guardianService_1.default.getExercises(req.guardianId, {
                readingLevel: readingLevel,
                skillStrand: skillStrand,
                type: type,
                limit: limit ? parseInt(limit, 10) : undefined,
                skip: skip ? parseInt(skip, 10) : undefined,
            });
            (0, libs_1.success)(res, exercises, 'Exercises fetched successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async createAssignment(req, res, next) {
        try {
            const { studentId } = req.params;
            const { exerciseId, dueDate } = req.body;
            const assignment = await guardianService_1.default.createAssignment(req.guardianId, studentId, exerciseId, dueDate ? new Date(dueDate) : undefined);
            (0, libs_1.success)(res, assignment, 'Assignment created successfully', undefined, 201);
        }
        catch (error) {
            next(error);
        }
    }
    async createGoal(req, res, next) {
        try {
            const goal = await guardianService_1.default.createGoal(req.guardianId, {
                ...req.body,
                deadline: new Date(req.body.deadline),
            });
            (0, libs_1.success)(res, goal, 'Goal created successfully', undefined, 201);
        }
        catch (error) {
            next(error);
        }
    }
    async getStudentGoals(req, res, next) {
        try {
            const { studentId } = req.params;
            const { status, limit, skip } = req.query;
            const goals = await guardianService_1.default.getStudentGoals(req.guardianId, studentId, {
                status: status,
                limit: limit ? parseInt(limit, 10) : undefined,
                skip: skip ? parseInt(skip, 10) : undefined,
            });
            (0, libs_1.success)(res, goals, 'Goals fetched successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async updateDiagnostic(req, res, next) {
        try {
            const { studentId } = req.params;
            const { enabled } = req.body;
            const student = await guardianService_1.default.updateDiagnosticSetting(req.guardianId, studentId, enabled);
            (0, libs_1.success)(res, student, 'Diagnostic setting updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new GuardianController();
//# sourceMappingURL=guardianController.js.map