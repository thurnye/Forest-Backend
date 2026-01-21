"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../db/models");
const libs_1 = require("@readingForest/libs");
class AttemptService {
    async getAttemptsByStudentId(studentId, options) {
        const query = {
            studentId: new mongoose_1.default.Types.ObjectId(studentId),
        };
        if (options?.exerciseId) {
            query.exerciseId = new mongoose_1.default.Types.ObjectId(options.exerciseId);
        }
        if (options?.status) {
            query.status = options.status;
        }
        const attempts = await models_1.ExerciseAttempt.find(query)
            .sort({ completedAt: -1, createdAt: -1 })
            .skip(options?.skip || 0)
            .limit(options?.limit || 20)
            .populate('exerciseId', 'title readingLevel skillStrand');
        return attempts;
    }
    async getAttemptById(attemptId) {
        const attempt = await models_1.ExerciseAttempt.findById(attemptId).populate('exerciseId', 'title readingLevel skillStrand questions');
        if (!attempt) {
            throw libs_1.Errors.notFound('Attempt not found');
        }
        return attempt;
    }
    async startAttempt(studentId, exerciseId) {
        const exercise = await models_1.Exercise.findById(exerciseId);
        if (!exercise) {
            throw libs_1.Errors.notFound('Exercise not found');
        }
        const attempt = await models_1.ExerciseAttempt.create({
            studentId: new mongoose_1.default.Types.ObjectId(studentId),
            exerciseId: new mongoose_1.default.Types.ObjectId(exerciseId),
            totalPoints: exercise.totalPoints,
            status: 'in-progress',
            startedAt: new Date(),
        });
        return attempt;
    }
    async updateAnswers(attemptId, answers) {
        const attempt = await models_1.ExerciseAttempt.findById(attemptId);
        if (!attempt) {
            throw libs_1.Errors.notFound('Attempt not found');
        }
        for (const [questionId, answer] of Object.entries(answers)) {
            attempt.answers.set(questionId, answer);
        }
        await attempt.save();
        return attempt;
    }
    async completeAttempt(attemptId, data) {
        const attempt = await models_1.ExerciseAttempt.findById(attemptId);
        if (!attempt) {
            throw libs_1.Errors.notFound('Attempt not found');
        }
        const exercise = await models_1.Exercise.findById(attempt.exerciseId);
        if (!exercise) {
            throw libs_1.Errors.notFound('Exercise not found');
        }
        for (const [questionId, answer] of Object.entries(data.answers)) {
            attempt.answers.set(questionId, answer);
        }
        let score = 0;
        let totalPoints = 0;
        for (const question of exercise.questions) {
            const questionId = question.questionId;
            const studentAnswer = attempt.answers.get(questionId);
            const questionPoints = question.points || 1;
            totalPoints += questionPoints;
            const correctAnswer = question.correctAnswer;
            if (studentAnswer) {
                const studentAnswerLower = studentAnswer.toLowerCase();
                const isCorrect = Array.isArray(correctAnswer)
                    ? correctAnswer.some((ans) => ans.toLowerCase() === studentAnswerLower)
                    : correctAnswer.toLowerCase() === studentAnswerLower;
                if (isCorrect) {
                    score += questionPoints;
                }
            }
        }
        const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
        attempt.score = score;
        attempt.totalPoints = totalPoints;
        attempt.percentage = percentage;
        attempt.status = 'completed';
        attempt.completedAt = new Date();
        attempt.timeSpent = data.timeSpent;
        await attempt.save();
        await this.updateStudentProgress(attempt.studentId.toString(), percentage);
        return attempt;
    }
    async updateStudentProgress(studentId, score) {
        const progress = await models_1.StudentProgress.findOne({
            studentId: new mongoose_1.default.Types.ObjectId(studentId),
        });
        if (!progress) {
            await models_1.StudentProgress.create({
                studentId: new mongoose_1.default.Types.ObjectId(studentId),
                exercisesCompleted: 1,
                averageScore: score,
                lastActivityAt: new Date(),
            });
            return;
        }
        const totalScore = progress.averageScore * progress.exercisesCompleted + score;
        const newExercisesCompleted = progress.exercisesCompleted + 1;
        const newAverageScore = totalScore / newExercisesCompleted;
        progress.exercisesCompleted = newExercisesCompleted;
        progress.averageScore = Math.round(newAverageScore * 100) / 100;
        progress.lastActivityAt = new Date();
        await progress.save();
    }
    async abandonAttempt(attemptId) {
        const attempt = await models_1.ExerciseAttempt.findByIdAndUpdate(attemptId, { status: 'abandoned' }, { new: true });
        if (!attempt) {
            throw libs_1.Errors.notFound('Attempt not found');
        }
        return attempt;
    }
    async getAttemptHistory(studentId, exerciseId) {
        const attempts = await models_1.ExerciseAttempt.find({
            studentId: new mongoose_1.default.Types.ObjectId(studentId),
            exerciseId: new mongoose_1.default.Types.ObjectId(exerciseId),
        })
            .sort({ completedAt: -1 })
            .limit(10);
        return attempts;
    }
}
exports.default = new AttemptService();
//# sourceMappingURL=AttemptService.js.map