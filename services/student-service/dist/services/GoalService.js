"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../db/models");
const libs_1 = require("@readingForest/libs");
class GoalService {
    async getGoalsByStudentId(studentId, options) {
        const query = {
            studentId: new mongoose_1.default.Types.ObjectId(studentId),
        };
        if (options?.status) {
            query.status = options.status;
        }
        const goals = await models_1.Goal.find(query)
            .sort({ deadline: 1, createdAt: -1 })
            .skip(options?.skip || 0)
            .limit(options?.limit || 20);
        return goals;
    }
    async getGoalById(goalId) {
        const goal = await models_1.Goal.findById(goalId);
        if (!goal) {
            throw libs_1.Errors.notFound('Goal not found');
        }
        return goal;
    }
    async createGoal(data) {
        const goal = await models_1.Goal.create({
            ...data,
            studentId: new mongoose_1.default.Types.ObjectId(data.studentId),
        });
        return goal;
    }
    async updateGoal(goalId, data) {
        const goal = await models_1.Goal.findByIdAndUpdate(goalId, data, { new: true });
        if (!goal) {
            throw libs_1.Errors.notFound('Goal not found');
        }
        return goal;
    }
    async updateGoalProgress(goalId, currentValue) {
        const goal = await models_1.Goal.findById(goalId);
        if (!goal) {
            throw libs_1.Errors.notFound('Goal not found');
        }
        goal.currentValue = currentValue;
        if (currentValue >= goal.targetValue && goal.status === 'active') {
            goal.status = 'completed';
            goal.completedAt = new Date();
        }
        await goal.save();
        return goal;
    }
    async cancelGoal(goalId) {
        const goal = await models_1.Goal.findByIdAndUpdate(goalId, { status: 'cancelled' }, { new: true });
        if (!goal) {
            throw libs_1.Errors.notFound('Goal not found');
        }
        return goal;
    }
    async getActiveGoalsCount(studentId) {
        const count = await models_1.Goal.countDocuments({
            studentId: new mongoose_1.default.Types.ObjectId(studentId),
            status: 'active',
        });
        return count;
    }
    async checkExpiredGoals() {
        const now = new Date();
        const result = await models_1.Goal.updateMany({
            status: 'active',
            deadline: { $lt: now },
        }, {
            status: 'expired',
        });
        return result.modifiedCount;
    }
}
exports.default = new GoalService();
//# sourceMappingURL=GoalService.js.map