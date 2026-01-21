"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guardianService_1 = __importDefault(require("../services/guardianService"));
class GuardianController {
    async getStudents(req, res, next) {
        try {
            const students = await guardianService_1.default.getStudents(req.guardianId);
            res.json(students);
        }
        catch (error) {
            next(error);
        }
    }
    async getStudentDetail(req, res, next) {
        try {
            const { studentId } = req.params;
            const student = await guardianService_1.default.getStudentDetail(req.guardianId, studentId);
            res.json(student);
        }
        catch (error) {
            next(error);
        }
    }
    async createStudent(req, res, next) {
        try {
            const student = await guardianService_1.default.createStudent(req.guardianId, req.body);
            res.status(201).json(student);
        }
        catch (error) {
            next(error);
        }
    }
    async linkStudent(req, res, next) {
        try {
            const { studentEmail } = req.body;
            const student = await guardianService_1.default.linkStudentByEmail(req.guardianId, studentEmail);
            res.json(student);
        }
        catch (error) {
            next(error);
        }
    }
    async unlinkStudent(req, res, next) {
        try {
            const { studentId } = req.params;
            const result = await guardianService_1.default.unlinkStudent(req.guardianId, studentId);
            res.json({ success: true, data: result });
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
            res.json(exercises);
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
            res.status(201).json(assignment);
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
            res.status(201).json(goal);
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
            res.json(goals);
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
            res.json(student);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new GuardianController();
//# sourceMappingURL=guardianController.js.map