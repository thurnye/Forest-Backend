import mongoose from 'mongoose';
declare class AssessmentService {
    getAssessmentsByStudentId(studentId: string, options?: {
        type?: string;
        status?: string;
        limit?: number;
        skip?: number;
    }): Promise<(mongoose.Document<unknown, {}, import("../db/models").IAssessment, {}, {}> & import("../db/models").IAssessment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getAssessmentById(assessmentId: string): Promise<mongoose.Document<unknown, {}, import("../db/models").IAssessment, {}, {}> & import("../db/models").IAssessment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createAssessment(data: {
        studentId: string;
        type: 'diagnostic' | 'placement' | 'progress' | 'mastery';
    }): Promise<mongoose.Document<unknown, {}, import("../db/models").IAssessment, {}, {}> & import("../db/models").IAssessment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    startAssessment(assessmentId: string): Promise<mongoose.Document<unknown, {}, import("../db/models").IAssessment, {}, {}> & import("../db/models").IAssessment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    completeAssessment(assessmentId: string, data: {
        results: Array<{
            skillStrand: string;
            score: number;
            level: string;
        }>;
        overallScore: number;
        determinedLevel: string;
        recommendations?: string[];
        timeSpent: number;
    }): Promise<mongoose.Document<unknown, {}, import("../db/models").IAssessment, {}, {}> & import("../db/models").IAssessment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getLatestDiagnostic(studentId: string): Promise<(mongoose.Document<unknown, {}, import("../db/models").IAssessment, {}, {}> & import("../db/models").IAssessment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
declare const _default: AssessmentService;
export default _default;
//# sourceMappingURL=AssessmentService.d.ts.map