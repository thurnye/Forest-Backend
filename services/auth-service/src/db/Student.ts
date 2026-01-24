import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStudent extends Document {
  _id: Types.ObjectId;
  guardianId: Types.ObjectId;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
  avatar?: string;
  dateOfBirth?: Date;
  grade: string;
  readingLevel: string;
  targetGradeLevel: string;
  hasCompletedDiagnostic: boolean;
  diagnosticEnabled: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    guardianId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Guardian',
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      required: true,
    },
    avatar: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    grade: {
      type: String,
      default: 'pre-k',
      required: true,
    },
    readingLevel: {
      type: String,
      default: 'pre-k',
    },
    targetGradeLevel: {
      type: String,
      default: 'grade-1',
    },
    hasCompletedDiagnostic: {
      type: Boolean,
      default: false,
    },
    diagnosticEnabled: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    refreshTokens: {
      type: [String],
      default: [],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
StudentSchema.index({ guardianId: 1 });
StudentSchema.index({ guardianId: 1, isActive: 1, createdAt: -1 });
StudentSchema.index({ username: 1 }, { unique: true });

const Student = mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
