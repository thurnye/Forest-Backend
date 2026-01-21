"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../db/models");
const libs_1 = require("@readingForest/libs");
class AssignmentService {
    async getAssignmentsByStudentId(studentId, options) {
        const query = {
            studentId: new mongoose_1.default.Types.ObjectId(studentId),
        };
        if (options?.status) {
            query.status = options.status;
        }
        const assignments = await models_1.Assignment.find(query)
            .sort({ assignedAt: -1 })
            .skip(options?.skip || 0)
            .limit(options?.limit || 20)
            .populate('exerciseId', 'title readingLevel skillStrand type estimatedTime');
        return assignments;
    }
    async getAssignmentById(assignmentId) {
        const assignment = await models_1.Assignment.findById(assignmentId).populate('exerciseId', 'title readingLevel skillStrand type estimatedTime');
        if (!assignment) {
            throw libs_1.Errors.notFound('Assignment not found');
        }
        return assignment;
    }
    async createAssignment(data) {
        const exercise = await models_1.Exercise.findById(data.exerciseId);
        if (!exercise) {
            throw libs_1.Errors.notFound('Exercise not found');
        }
        const existing = await models_1.Assignment.findOne({
            studentId: new mongoose_1.default.Types.ObjectId(data.studentId),
            exerciseId: new mongoose_1.default.Types.ObjectId(data.exerciseId),
        });
        if (existing) {
            throw libs_1.Errors.conflict('Assignment already exists for this exercise');
        }
        const assignment = await models_1.Assignment.create({
            studentId: new mongoose_1.default.Types.ObjectId(data.studentId),
            exerciseId: new mongoose_1.default.Types.ObjectId(data.exerciseId),
            assignedBy: new mongoose_1.default.Types.ObjectId(data.assignedBy),
            dueDate: data.dueDate,
        });
        return assignment;
    }
    async updateAssignmentStatus(assignmentId, status) {
        const updateData = { status };
        if (status === 'completed') {
            updateData.completedAt = new Date();
        }
        const assignment = await models_1.Assignment.findByIdAndUpdate(assignmentId, updateData, {
            new: true,
        });
        if (!assignment) {
            throw libs_1.Errors.notFound('Assignment not found');
        }
        return assignment;
    }
    async deleteAssignment(assignmentId) {
        const assignment = await models_1.Assignment.findByIdAndDelete(assignmentId);
        if (!assignment) {
            throw libs_1.Errors.notFound('Assignment not found');
        }
        return assignment;
    }
    async getPendingAssignmentsCount(studentId) {
        const count = await models_1.Assignment.countDocuments({
            studentId: new mongoose_1.default.Types.ObjectId(studentId),
            status: 'pending',
        });
        return count;
    }
}
exports.default = new AssignmentService();
//# sourceMappingURL=AssignmentService.js.map