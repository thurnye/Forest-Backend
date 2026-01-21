import mongoose, { Document, Types } from 'mongoose';
export interface IQuestion {
    questionId: string;
    questionText: string;
    questionType: 'multiple-choice' | 'fill-in-blank' | 'true-false' | 'matching' | 'sequencing';
    options?: string[];
    correctAnswer: string | string[];
    explanation?: string;
    points: number;
}
export interface IExercise extends Document {
    _id: Types.ObjectId;
    title: string;
    description: string;
    type: 'reading-comprehension' | 'phonics' | 'vocabulary' | 'fluency' | 'sequencing';
    readingLevel: string;
    skillStrand: 'phonological-awareness' | 'phonics' | 'vocabulary' | 'comprehension' | 'fluency';
    content?: string;
    imageUrl?: string;
    audioUrl?: string;
    questions: IQuestion[];
    totalPoints: number;
    estimatedTime: number;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const Exercise: mongoose.Model<IExercise, {}, {}, {}, mongoose.Document<unknown, {}, IExercise, {}, {}> & IExercise & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Exercise;
//# sourceMappingURL=Exercise.d.ts.map