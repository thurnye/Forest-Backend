import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStudentProgress extends Document {
  _id: Types.ObjectId;
  studentId: Types.ObjectId;
  currentLevel: string;
  exercisesCompleted: number;
  totalExercises: number;
  averageScore: number;
  totalTimeSpent: number; // in minutes
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

const StudentProgressSchema = new Schema<IStudentProgress>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'Student',
    },
    currentLevel: {
      type: String,
      default: 'pre-k',
    },
    exercisesCompleted: {
      type: Number,
      default: 0,
    },
    totalExercises: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    totalTimeSpent: {
      type: Number,
      default: 0,
    },
    streakDays: {
      type: Number,
      default: 0,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
    skillScores: {
      phonologicalAwareness: { type: Number, default: 0 },
      phonics: { type: Number, default: 0 },
      vocabulary: { type: Number, default: 0 },
      comprehension: { type: Number, default: 0 },
      fluency: { type: Number, default: 0 },
    },
    levelProgress: [
      {
        level: { type: String, required: true },
        completedAt: { type: Date },
        score: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
StudentProgressSchema.index({ studentId: 1 }, { unique: true });
StudentProgressSchema.index({ lastActivityAt: -1 });

const StudentProgress = mongoose.model<IStudentProgress>('StudentProgress', StudentProgressSchema);

export default StudentProgress;
