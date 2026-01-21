"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class ProgressController {
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