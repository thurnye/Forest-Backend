import mongoose from 'mongoose';
declare class AttemptService {
    getAttemptsByStudentId(studentId: string, options?: {
        exerciseId?: string;
        status?: string;
        limit?: number;
        skip?: number;
    }): Promise<(mongoose.Document<unknown, {}, import("../db/models").IExerciseAttempt, {}, {}> & import("../db/models").IExerciseAttempt & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getAttemptById(attemptId: string): Promise<mongoose.Document<unknown, {}, import("../db/models").IExerciseAttempt, {}, {}> & import("../db/models").IExerciseAttempt & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    startAttempt(studentId: string, exerciseId: string): Promise<mongoose.Document<unknown, {}, import("../db/models").IExerciseAttempt, {}, {}> & import("../db/models").IExerciseAttempt & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateAnswers(attemptId: string, answers: Record<string, string>): Promise<mongoose.Document<unknown, {}, import("../db/models").IExerciseAttempt, {}, {}> & import("../db/models").IExerciseAttempt & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    completeAttempt(attemptId: string, data: {
        answers: Record<string, string>;
        timeSpent: number;
    }): Promise<mongoose.Document<unknown, {}, import("../db/models").IExerciseAttempt, {}, {}> & import("../db/models").IExerciseAttempt & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    private updateStudentProgress;
    abandonAttempt(attemptId: string): Promise<mongoose.Document<unknown, {}, import("../db/models").IExerciseAttempt, {}, {}> & import("../db/models").IExerciseAttempt & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAttemptHistory(studentId: string, exerciseId: string): Promise<(mongoose.Document<unknown, {}, import("../db/models").IExerciseAttempt, {}, {}> & import("../db/models").IExerciseAttempt & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
declare const _default: AttemptService;
export default _default;
//# sourceMappingURL=AttemptService.d.ts.map