import mongoose, { Document, Types } from 'mongoose';
export interface IStudentProgress extends Document {
    _id: Types.ObjectId;
    studentId: Types.ObjectId;
    currentLevel: string;
    exercisesCompleted: number;
    totalExercises: number;
    averageScore: number;
    totalTimeSpent: number;
    streakDays: number;
    lastActivityAt: Date;
    skillScores: {
        phonologicalAwareness: number;
        phonics: number;
        vocabulary: number;
        comprehension: number;
        fluency: number;
    };
    levelProgress: {
        level: string;
        completedAt?: Date;
        score?: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
declare const StudentProgress: mongoose.Model<IStudentProgress, {}, {}, {}, mongoose.Document<unknown, {}, IStudentProgress, {}, {}> & IStudentProgress & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default StudentProgress;
//# sourceMappingURL=StudentProgress.d.ts.map