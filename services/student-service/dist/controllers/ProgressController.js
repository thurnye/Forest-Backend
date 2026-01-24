"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const libs_1 = require("@readingForest/libs");
class ProgressController {
    async createInitialProgress(req, res, next) {
        try {
            const { studentId } = req.params;
            const progress = await services_1.ProgressService.createInitialProgress(studentId);
            (0, libs_1.success)(res, progress, 'Initial progress created successfully', undefined, 201);
        }
        catch (error) {
            next(error);
        }
    }
    async getProgress(req, res, next) {
        try {
            const { studentId } = req.params;
            const progress = await services_1.ProgressService.getProgressByStudentId(studentId);
            res.json(progress);
        }
        catch (error) {
            next(error);
        }
    }
    async updateProgress(req, res, next) {
        try {
            const { studentId } = req.params;
            const progress = await services_1.ProgressService.updateProgress(studentId, req.body);
            res.json(progress);
        }
        catch (error) {
            next(error);
        }
    }
    async updateStreak(req, res, next) {
        try {
            const { studentId } = req.params;
            const progress = await services_1.ProgressService.updateStreak(studentId);
            res.json(progress);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new ProgressController();
//# sourceMappingURL=ProgressController.js.map