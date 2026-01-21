import mongoose, { Document, Types } from 'mongoose';
export interface IGoal extends Document {
    _id: Types.ObjectId;
    studentId: Types.ObjectId;
    title: string;
    description?: string;
    type: 'exercises' | 'time' | 'streak' | 'score' | 'level';
    targetValue: number;
    currentValue: number;
    unit: string;
    deadline: Date;
    status: 'active' | 'completed' | 'expired' | 'cancelled';
    completedAt?: Date;
    createdBy: 'student' | 'parent' | 'teacher' | 'system';
    createdAt: Date;
    updatedAt: Date;
}
declare const Goal: mongoose.Model<IGoal, {}, {}, {}, mongoose.Document<unknown, {}, IGoal, {}, {}> & IGoal & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Goal;
//# sourceMappingURL=Goal.d.ts.map