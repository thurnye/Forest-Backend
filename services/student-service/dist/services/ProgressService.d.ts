import mongoose from 'mongoose';
declare class ProgressService {
    createInitialProgress(studentId: string): Promise<mongoose.Document<unknown, {}, import("../db/models").IStudentProgress, {}, {}> & import("../db/models").IStudentProgress & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getProgressByStudentId(studentId: string): Promise<(mongoose.Document<unknown, {}, import("../db/models").IStudentProgress, {}, {}> & import("../db/models").IStudentProgress & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | {
        studentId: string;
        currentLevel: string;
        exercisesCompleted: number;
        totalExercises: number;
        averageScore: number;
        streakDays: number;
        lastActivityAt: null;
    }>;
    updateProgress(studentId: string, data: Partial<{
        currentLevel: string;
        exercisesCompleted: number;
        totalExercises: number;
        averageScore: number;
        streakDays: number;
        lastActivityAt: Date;
    }>): Promise<mongoose.Document<unknown, {}, import("../db/models").IStudentProgress, {}, {}> & import("../db/models").IStudentProgress & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    incrementExerciseCompletion(studentId: string, score: number): Promise<mongoose.Document<unknown, {}, import("../db/models").IStudentProgress, {}, {}> & import("../db/models").IStudentProgress & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateStreak(studentId: string): Promise<mongoose.Document<unknown, {}, import("../db/models").IStudentProgress, {}, {}> & import("../db/models").IStudentProgress & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
declare const _default: ProgressService;
export default _default;
//# sourceMappingURL=ProgressService.d.ts.map