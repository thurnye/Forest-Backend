import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStudent extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string;
  bio?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: string[];
  role: string;
  readingLevel: string;
  targetGradeLevel: string | number;
  hasCompletedDiagnostic: boolean;
  diagnosticEnabled: boolean;
  guardian: mongoose.Types.ObjectId;
  reputation: number;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    avatar: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
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
    role: {
      type: String,
      default: 'student',
    },
    guardian: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    readingLevel: {
      type: String,
      default: '-',
    },
    targetGradeLevel: {
      type: Schema.Types.Mixed,
      default: '-',
    },
    hasCompletedDiagnostic: {
      type: Boolean,
      default: false,
    },
    diagnosticEnabled: {
      type: Boolean,
      default: false,
    },
    reputation: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
StudentSchema.index({ email: 1 });
StudentSchema.index({ username: 1 });
StudentSchema.index({ guardian: 1, isActive: 1, createdAt: -1 });
StudentSchema.index({ createdAt: -1 });

const Student = mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
