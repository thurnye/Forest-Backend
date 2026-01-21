import mongoose, { Schema, Document, Types } from 'mongoose';

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

const StudentSchema = new Schema<IStudent>(
  {
    guardianId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Guardian',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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
    },
    avatar: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    grade: {
      type: String,
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
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
StudentSchema.index({ guardianId: 1 });
StudentSchema.index({ email: 1 }, { unique: true });
StudentSchema.index({ guardianId: 1, isActive: 1, createdAt: -1 });

const Student = mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
