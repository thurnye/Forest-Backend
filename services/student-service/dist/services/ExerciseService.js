"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../db/models");
const libs_1 = require("@readingForest/libs");
class ExerciseService {
    async getExercisesByLevel(readingLevel, options) {
        const query = {
            readingLevel,
            isActive: true,
        };
        if (options?.skillStrand) {
            query.skillStrand = options.skillStrand;
        }
        if (options?.type) {
            query.type = options.type;
        }
        const exercises = await models_1.Exercise.find(query)
            .sort({ order: 1, createdAt: -1 })
            .skip(options?.skip || 0)
            .limit(options?.limit || 20)
            .select('-questions.correctAnswer');
        return exercises;
    }
    async getExerciseById(exerciseId) {
        const exercise = await models_1.Exercise.findById(exerciseId);
        if (!exercise) {
            throw libs_1.Errors.notFound('Exercise not found');
        }
        return exercise;
    }
    async getExerciseForStudent(exerciseId) {
        const exercise = await models_1.Exercise.findById(exerciseId).select('-questions.correctAnswer');
        if (!exercise) {
            throw libs_1.Errors.notFound('Exercise not found');
        }
        return exercise;
    }
    async createExercise(data) {
        const exercise = await models_1.Exercise.create(data);
        return exercise;
    }
    async updateExercise(exerciseId, data) {
        const exercise = await models_1.Exercise.findByIdAndUpdate(exerciseId, data, { new: true });
        if (!exercise) {
            throw libs_1.Errors.notFound('Exercise not found');
        }
        return exercise;
    }
    async deleteExercise(exerciseId) {
        const exercise = await models_1.Exercise.findByIdAndUpdate(exerciseId, { isActive: false }, { new: true });
        if (!exercise) {
            throw libs_1.Errors.notFound('Exercise not found');
        }
        return exercise;
    }
    async getExerciseCountByLevel(readingLevel) {
        const count = await models_1.Exercise.countDocuments({
            readingLevel,
            isActive: true,
        });
        return count;
    }
}
exports.default = new ExerciseService();
//# sourceMappingURL=ExerciseService.js.map