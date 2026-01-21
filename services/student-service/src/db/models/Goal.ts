import mongoose, { Schema, Document, Types } from 'mongoose';

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

const GoalSchema = new Schema<IGoal>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Student',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ['exercises', 'time', 'streak', 'score', 'level'],
      required: true,
    },
    targetValue: {
      type: Number,
      required: true,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'expired', 'cancelled'],
      default: 'active',
    },
    completedAt: {
      type: Date,
    },
    createdBy: {
      type: String,
      enum: ['student', 'parent', 'teacher', 'system'],
      default: 'system',
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
GoalSchema.index({ studentId: 1, deadline: 1 });
GoalSchema.index({ studentId: 1, status: 1 });
GoalSchema.index({ deadline: 1, status: 1 });

const Goal = mongoose.model<IGoal>('Goal', GoalSchema);

export default Goal;
