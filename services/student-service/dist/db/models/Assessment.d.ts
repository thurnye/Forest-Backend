import mongoose, { Document, Types } from 'mongoose';
export interface IAssessmentResult {
    skillStrand: string;
    score: number;
    level: string;
}
export interface IAssessment extends Document {
    _id: Types.ObjectId;
    studentId: Types.ObjectId;
    type: 'diagnostic' | 'placement' | 'progress' | 'mastery';
    status: 'pending' | 'in-progress' | 'completed';
    results: IAssessmentResult[];
    overallScore: number;
    determinedLevel: string;
    recommendations: string[];
    startedAt?: Date;
    completedAt?: Date;
    timeSpent: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const Assessment: mongoose.Model<IAssessment, {}, {}, {}, mongoose.Document<unknown, {}, IAssessment, {}, {}> & IAssessment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Assessment;
//# sourceMappingURL=Assessment.d.ts.map