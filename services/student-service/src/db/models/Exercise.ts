import mongoose, { Schema, Document, Types } from 'mongoose';

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
  content?: string; // Story or passage content
  imageUrl?: string;
  audioUrl?: string;
  questions: IQuestion[];
  totalPoints: number;
  estimatedTime: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    questionId: {
      type: String,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    questionType: {
      type: String,
      enum: ['multiple-choice', 'fill-in-blank', 'true-false', 'matching', 'sequencing'],
      required: true,
    },
    options: {
      type: [String],
    },
    correctAnswer: {
      type: Schema.Types.Mixed,
      required: true,
    },
    explanation: {
      type: String,
    },
    points: {
      type: Number,
      default: 1,
    },
  },
  { _id: false },
);

const ExerciseSchema = new Schema<IExercise>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['reading-comprehension', 'phonics', 'vocabulary', 'fluency', 'sequencing'],
      required: true,
    },
    readingLevel: {
      type: String,
      required: true,
    },
    skillStrand: {
      type: String,
      enum: ['phonological-awareness', 'phonics', 'vocabulary', 'comprehension', 'fluency'],
      required: true,
    },
    content: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    audioUrl: {
      type: String,
    },
    questions: {
      type: [QuestionSchema],
      default: [],
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    estimatedTime: {
      type: Number,
      default: 5,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
ExerciseSchema.index({ readingLevel: 1, skillStrand: 1 });
ExerciseSchema.index({ type: 1, isActive: 1 });
ExerciseSchema.index({ tags: 1 });

const Exercise = mongoose.model<IExercise>('Exercise', ExerciseSchema);

export default Exercise;
