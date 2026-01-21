"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class AttemptController {
    async getAttempts(req, res, next) {
        try {
            const { studentId } = req.params;
            const { exerciseId, status, limit, skip } = req.query;
            const attempts = await services_1.AttemptService.getAttemptsByStudentId(studentId, {
                exerciseId: exerciseId,
                status: status,
                limit: limit ? parseInt(limit, 10) : undefined,
                skip: skip ? parseInt(skip, 10) : undefined,
            });
            res.json(attempts);
        }
        catch (error) {
            next(error);
        }
    }
    async getAttempt(req, res, next) {
        try {
            const { id } = req.params;
            const attempt = await services_1.AttemptService.getAttemptById(id);
            res.json(attempt);
        }
        catch (error) {
            next(error);
        }
    }
    async startAttempt(req, res, next) {
        try {
            const { studentId, exerciseId } = req.body;
            const attempt = await services_1.AttemptService.startAttempt(studentId, exerciseId);
            res.status(201).json(attempt);
        }
        catch (error) {
            next(error);
        }
    }
    async updateAnswers(req, res, next) {
        try {
            const { id } = req.params;
            const { answers } = req.body;
            const attempt = await services_1.AttemptService.updateAnswers(id, answers);
            res.json(attempt);
        }
        catch (error) {
            next(error);
        }
    }
    async completeAttempt(req, res, next) {
        try {
            const { id } = req.params;
            const attempt = await services_1.AttemptService.completeAttempt(id, req.body);
            res.json(attempt);
        }
        catch (error) {
            next(error);
        }
    }
    async abandonAttempt(req, res, next) {
        try {
            const { id } = req.params;
            const attempt = await services_1.AttemptService.abandonAttempt(id);
            res.json(attempt);
        }
        catch (error) {
            next(error);
        }
    }
    async getAttemptHistory(req, res, next) {
        try {
            const { studentId, exerciseId } = req.params;
            const attempts = await services_1.AttemptService.getAttemptHistory(studentId, exerciseId);
            res.json(attempts);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new AttemptController();
//# sourceMappingURL=AttemptController.js.map