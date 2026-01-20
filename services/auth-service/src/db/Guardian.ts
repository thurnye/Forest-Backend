import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IGuardian extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  avatar?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: string[];
  role: 'parent' | 'teacher';
  reputation: number;
  createdAt: Date;
  updatedAt: Date;
}

const GuardianSchema = new Schema<IGuardian>(
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
      enum: ['parent', 'teacher'],
      default: 'parent',
    },
    reputation: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
GuardianSchema.index({ email: 1 });
GuardianSchema.index({ username: 1 });
GuardianSchema.index({ createdAt: -1 });

const Guardian = mongoose.model<IGuardian>('Guardian', GuardianSchema);

export default Guardian;
