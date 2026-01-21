"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class AssessmentController {
    async getAssessments(req, res, next) {
        try {
            const { studentId } = req.params;
            const { type, status, limit, skip } = req.query;
            const assessments = await services_1.AssessmentService.getAssessmentsByStudentId(studentId, {
                type: type,
                status: status,
                limit: limit ? parseInt(limit, 10) : undefined,
                skip: skip ? parseInt(skip, 10) : undefined,
            });
            res.json(assessments);
        }
        catch (error) {
            next(error);
        }
    }
    async getAssessment(req, res, next) {
        try {
            const { id } = req.params;
            const assessment = await services_1.AssessmentService.getAssessmentById(id);
            res.json(assessment);
        }
        catch (error) {
            next(error);
        }
    }
    async createAssessment(req, res, next) {
        try {
            const assessment = await services_1.AssessmentService.createAssessment(req.body);
            res.status(201).json(assessment);
        }
        catch (error) {
            next(error);
        }
    }
    async startAssessment(req, res, next) {
        try {
            const { id } = req.params;
            const assessment = await services_1.AssessmentService.startAssessment(id);
            res.json(assessment);
        }
        catch (error) {
            next(error);
        }
    }
    async completeAssessment(req, res, next) {
        try {
            const { id } = req.params;
            const assessment = await services_1.AssessmentService.completeAssessment(id, req.body);
            res.json(assessment);
        }
        catch (error) {
            next(error);
        }
    }
    async getLatestDiagnostic(req, res, next) {
        try {
            const { studentId } = req.params;
            const assessment = await services_1.AssessmentService.getLatestDiagnostic(studentId);
            res.json(assessment);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = new AssessmentController();
//# sourceMappingURL=AssessmentController.js.map