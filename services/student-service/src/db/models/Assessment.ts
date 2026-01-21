import mongoose, { Schema, Document, Types } from 'mongoose';

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
  timeSpent: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentResultSchema = new Schema<IAssessmentResult>(
  {
    skillStrand: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const AssessmentSchema = new Schema<IAssessment>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Student',
    },
    type: {
      type: String,
      enum: ['diagnostic', 'placement', 'progress', 'mastery'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    results: {
      type: [AssessmentResultSchema],
      default: [],
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    determinedLevel: {
      type: String,
      default: '',
    },
    recommendations: {
      type: [String],
      default: [],
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
AssessmentSchema.index({ studentId: 1, completedAt: -1 });
AssessmentSchema.index({ studentId: 1, type: 1 });
AssessmentSchema.index({ status: 1 });

const Assessment = mongoose.model<IAssessment>('Assessment', AssessmentSchema);

export default Assessment;
