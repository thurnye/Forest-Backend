"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../db/models");
class ProgressService {
    async getProgressByStudentId(studentId) {
        const progress = await models_1.StudentProgress.findOne({
            studentId: new mongoose_1.default.Types.ObjectId(studentId),
        });
        if (!progress) {
            return {
                studentId,
                currentLevel: 'pre-k',
                exercisesCompleted: 0,
                totalExercises: 0,
                averageScore: 0,
                streakDays: 0,
                lastActivityAt: null,
            };
        }
        return progress;
    }
    async updateProgress(studentId, data) {
        const progress = await models_1.StudentProgress.findOneAndUpdate({ studentId: new mongoose_1.default.Types.ObjectId(studentId) }, { $set: data }, { new: true, upsert: true });
        return progress;
    }
    async incrementExerciseCompletion(studentId, score) {
        const progress = await models_1.StudentProgress.findOne({
            studentId: new mongoose_1.default.Types.ObjectId(studentId),
        });
        if (!progress) {
            return await models_1.StudentProgress.create({
                studentId: new mongoose_1.default.Types.ObjectId(studentId),
                exercisesCompleted: 1,
                averageScore: score,
                lastActivityAt: new Date(),
            });
        }
        const totalScore = progress.averageScore * progress.exercisesCompleted + score;
        const newExercisesCompleted = progress.exercisesCompleted + 1;
        const newAverageScore = totalScore / newExercisesCompleted;
        progress.exercisesCompleted = newExercisesCompleted;
        progress.averageScore = Math.round(newAverageScore * 100) / 100;
        progress.lastActivityAt = new Date();
        await progress.save();
        return progress;
    }
    async updateStreak(studentId) {
        const progress = await models_1.StudentProgress.findOne({
            studentId: new mongoose_1.default.Types.ObjectId(studentId),
        });
        if (!progress) {
            return await models_1.StudentProgress.create({
                studentId: new mongoose_1.default.Types.ObjectId(studentId),
                streakDays: 1,
                lastActivityAt: new Date(),
            });
        }
        const now = new Date();
        const lastActivity = progress.lastActivityAt;
        if (lastActivity) {
            const daysSinceLastActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
            if (daysSinceLastActivity === 1) {
                progress.streakDays += 1;
            }
            else if (daysSinceLastActivity > 1) {
                progress.streakDays = 1;
            }
        }
        else {
            progress.streakDays = 1;
        }
        progress.lastActivityAt = now;
        await progress.save();
        return progress;
    }
}
exports.default = new ProgressService();
//# sourceMappingURL=ProgressService.js.map