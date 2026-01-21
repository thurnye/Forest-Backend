"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class ExerciseController {
    async getExercises(req, res, next) {
        try {
            const { readingLevel, skillStrand, type, limit, skip } = req.query;
            if (!readingLevel) {
                res.status(400).json({ error: 'readingLevel is required' });
                return;
            }
            const exercises = await services_1.ExerciseService.getExercisesByLevel(readingLevel, {
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
    async getExercise(req, res, next) {
        try {
            const { id } = req.params;
            const exercise = await services_1.ExerciseService.getExerciseForStudent(id);
            res.json(exercise);
        }
        catch (error) {
            next(error);
        }
    }
    async getExerciseFull(req, res, next) {
        try {
            const { id } = req.params;
            const exercise = await services_1.ExerciseService.getExerciseById(id);
            res.json(exercise);
        }
        catch (error) {
            next(error);
        }
    }
    async createExercise(req, res, next) {
        try {
            const exercise = await services_1.ExerciseService.createExercise(req.body);
            res.status(201).json(exercise);
        }
        catch (error) {
            next(error);
        }
    }
    async updateExercise(req, res, next) {
        try {
            const { id } = req.params;
            const exercise = await services_1.ExerciseService.updateExercise(id, req.body);
            res.json(exercise);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteExercise(req, res, next) {
        try {
            const { id } = req.params;
            const exercise = await services_1.ExerciseService.deleteExercise(id);
            res.json(exercise);
        }
        catch (error) {
            next(error);
        }
    }
    async getExerciseCount(req, res, next) {
        try {
            const { readingLevel } = req.params;
            const count = await services_1.ExerciseService.getExerciseCountByLevel(readingLevel);
            res.json({ count });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new ExerciseController();
//# sourceMappingURL=ExerciseController.js.map