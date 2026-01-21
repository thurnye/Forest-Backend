"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class GoalController {
    async getGoals(req, res, next) {
        try {
            const { studentId } = req.params;
            const { status, limit, skip } = req.query;
            const goals = await services_1.GoalService.getGoalsByStudentId(studentId, {
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
    async getGoal(req, res, next) {
        try {
            const { id } = req.params;
            const goal = await services_1.GoalService.getGoalById(id);
            res.json(goal);
        }
        catch (error) {
            next(error);
        }
    }
    async createGoal(req, res, next) {
        try {
            const goal = await services_1.GoalService.createGoal(req.body);
            res.status(201).json(goal);
        }
        catch (error) {
            next(error);
        }
    }
    async updateGoal(req, res, next) {
        try {
            const { id } = req.params;
            const goal = await services_1.GoalService.updateGoal(id, req.body);
            res.json(goal);
        }
        catch (error) {
            next(error);
        }
    }
    async updateGoalProgress(req, res, next) {
        try {
            const { id } = req.params;
            const { currentValue } = req.body;
            const goal = await services_1.GoalService.updateGoalProgress(id, currentValue);
            res.json(goal);
        }
        catch (error) {
            next(error);
        }
    }
    async cancelGoal(req, res, next) {
        try {
            const { id } = req.params;
            const goal = await services_1.GoalService.cancelGoal(id);
            res.json(goal);
        }
        catch (error) {
            next(error);
        }
    }
    async getActiveGoalsCount(req, res, next) {
        try {
            const { studentId } = req.params;
            const count = await services_1.GoalService.getActiveGoalsCount(studentId);
            res.json({ count });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new GoalController();
//# sourceMappingURL=GoalController.js.map