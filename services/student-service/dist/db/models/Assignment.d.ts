import mongoose, { Document, Types } from 'mongoose';
export interface IAssignment extends Document {
    _id: Types.ObjectId;
    studentId: Types.ObjectId;
    exerciseId: Types.ObjectId;
    assignedBy: Types.ObjectId;
    assignedAt: Date;
    dueDate?: Date;
    status: 'pending' | 'in-progress' | 'completed';
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
declare const Assignment: mongoose.Model<IAssignment, {}, {}, {}, mongoose.Document<unknown, {}, IAssignment, {}, {}> & IAssignment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Assignment;
//# sourceMappingURL=Assignment.d.ts.map