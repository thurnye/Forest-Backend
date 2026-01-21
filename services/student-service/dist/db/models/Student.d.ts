import mongoose, { Document, Types } from 'mongoose';
export interface IStudent extends Document {
    _id: Types.ObjectId;
    guardianId: Types.ObjectId;
    email: string;
    firstName: string;
    lastName: string;
    username?: string;
    avatar?: string;
    dateOfBirth?: Date;
    grade?: string;
    readingLevel: string;
    targetGradeLevel: string;
    hasCompletedDiagnostic: boolean;
    diagnosticEnabled: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const Student: mongoose.Model<IStudent, {}, {}, {}, mongoose.Document<unknown, {}, IStudent, {}, {}> & IStudent & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Student;
//# sourceMappingURL=Student.d.ts.map