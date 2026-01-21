"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class AssignmentController {
    async getAssignments(req, res, next) {
        try {
            const { studentId } = req.params;
            const { status, limit, skip } = req.query;
            const assignments = await services_1.AssignmentService.getAssignmentsByStudentId(studentId, {
                status: status,
                limit: limit ? parseInt(limit, 10) : undefined,
                skip: skip ? parseInt(skip, 10) : undefined,
            });
            res.json(assignments);
        }
        catch (error) {
            next(error);
        }
    }
    async getAssignment(req, res, next) {
        try {
            const { id } = req.params;
            const assignment = await services_1.AssignmentService.getAssignmentById(id);
            res.json(assignment);
        }
        catch (error) {
            next(error);
        }
    }
    async createAssignment(req, res, next) {
        try {
            const { studentId, exerciseId, dueDate } = req.body;
            const assignedBy = req.headers['x-user-id'];
            if (!assignedBy) {
                res.status(401).json({ error: 'User ID required' });
                return;
            }
            const assignment = await services_1.AssignmentService.createAssignment({
                studentId,
                exerciseId,
                assignedBy,
                dueDate,
            });
            res.status(201).json(assignment);
        }
        catch (error) {
            next(error);
        }
    }
    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const assignment = await services_1.AssignmentService.updateAssignmentStatus(id, status);
            res.json(assignment);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteAssignment(req, res, next) {
        try {
            const { id } = req.params;
            const assignment = await services_1.AssignmentService.deleteAssignment(id);
            res.json(assignment);
        }
        catch (error) {
            next(error);
        }
    }
    async getPendingCount(req, res, next) {
        try {
            const { studentId } = req.params;
            const count = await services_1.AssignmentService.getPendingAssignmentsCount(studentId);
            res.json({ count });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new AssignmentController();
//# sourceMappingURL=AssignmentController.js.map