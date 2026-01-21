"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../db/models");
const libs_1 = require("@readingForest/libs");
class AssessmentService {
    async getAssessmentsByStudentId(studentId, options) {
        const query = {
            studentId: new mongoose_1.default.Types.ObjectId(studentId),
        };
        if (options?.type) {
            query.type = options.type;
        }
        if (options?.status) {
            query.status = options.status;
        }
        const assessments = await models_1.Assessment.find(query)
            .sort({ completedAt: -1, createdAt: -1 })
            .skip(options?.skip || 0)
            .limit(options?.limit || 20);
        return assessments;
    }
    async getAssessmentById(assessmentId) {
        const assessment = await models_1.Assessment.findById(assessmentId);
        if (!assessment) {
            throw libs_1.Errors.notFound('Assessment not found');
        }
        return assessment;
    }
    async createAssessment(data) {
        const assessment = await models_1.Assessment.create({
            studentId: new mongoose_1.default.Types.ObjectId(data.studentId),
            type: data.type,
            status: 'pending',
        });
        return assessment;
    }
    async startAssessment(assessmentId) {
        const assessment = await models_1.Assessment.findByIdAndUpdate(assessmentId, {
            status: 'in-progress',
            startedAt: new Date(),
        }, { new: true });
        if (!assessment) {
            throw libs_1.Errors.notFound('Assessment not found');
        }
        return assessment;
    }
    async completeAssessment(assessmentId, data) {
        const assessment = await models_1.Assessment.findByIdAndUpdate(assessmentId, {
            status: 'completed',
            results: data.results,
            overallScore: data.overallScore,
            determinedLevel: data.determinedLevel,
            recommendations: data.recommendations || [],
            timeSpent: data.timeSpent,
            completedAt: new Date(),
        }, { new: true });
        if (!assessment) {
            throw libs_1.Errors.notFound('Assessment not found');
        }
        if (assessment.type === 'diagnostic') {
            await models_1.Student.findByIdAndUpdate(assessment.studentId, {
                readingLevel: data.determinedLevel,
                hasCompletedDiagnostic: true,
            });
        }
        return assessment;
    }
    async getLatestDiagnostic(studentId) {
        const assessment = await models_1.Assessment.findOne({
            studentId: new mongoose_1.default.Types.ObjectId(studentId),
            type: 'diagnostic',
            status: 'completed',
        }).sort({ completedAt: -1 });
        return assessment;
    }
}
exports.default = new AssessmentService();
//# sourceMappingURL=AssessmentService.js.map