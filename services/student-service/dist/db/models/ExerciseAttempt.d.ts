import mongoose, { Document, Types } from 'mongoose';
export interface IExerciseAttempt extends Document {
    _id: Types.ObjectId;
    studentId: Types.ObjectId;
    exerciseId: Types.ObjectId;
    answers: Map<string, string>;
    score: number;
    totalPoints: number;
    percentage: number;
    status: 'in-progress' | 'completed' | 'abandoned';
    startedAt: Date;
    completedAt?: Date;
    timeSpent: number;
    feedback?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const ExerciseAttempt: mongoose.Model<IExerciseAttempt, {}, {}, {}, mongoose.Document<unknown, {}, IExerciseAttempt, {}, {}> & IExerciseAttempt & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default ExerciseAttempt;
//# sourceMappingURL=ExerciseAttempt.d.ts.map