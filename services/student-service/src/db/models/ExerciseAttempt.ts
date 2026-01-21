import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IExerciseAttempt extends Document {
  _id: Types.ObjectId;
  studentId: Types.ObjectId;
  exerciseId: Types.ObjectId;
  answers: Map<string, string>; // questionId -> answer
  score: number;
  totalPoints: number;
  percentage: number;
  status: 'in-progress' | 'completed' | 'abandoned';
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in seconds
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseAttemptSchema = new Schema<IExerciseAttempt>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Student',
    },
    exerciseId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Exercise',
    },
    answers: {
      type: Map,
      of: String,
      default: new Map(),
    },
    score: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['in-progress', 'completed', 'abandoned'],
      default: 'in-progress',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
ExerciseAttemptSchema.index({ studentId: 1, completedAt: -1 });
ExerciseAttemptSchema.index({ studentId: 1, exerciseId: 1 });
ExerciseAttemptSchema.index({ exerciseId: 1, status: 1 });

const ExerciseAttempt = mongoose.model<IExerciseAttempt>('ExerciseAttempt', ExerciseAttemptSchema);

export default ExerciseAttempt;
