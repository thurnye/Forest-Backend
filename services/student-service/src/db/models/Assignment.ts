import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAssignment extends Document {
  _id: Types.ObjectId;
  studentId: Types.ObjectId;
  exerciseId: Types.ObjectId;
  assignedBy: Types.ObjectId; // guardianId
  assignedAt: Date;
  dueDate?: Date;
  status: 'pending' | 'in-progress' | 'completed';
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
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
    assignedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Guardian',
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for performance
AssignmentSchema.index({ studentId: 1, status: 1 });
AssignmentSchema.index({ studentId: 1, assignedAt: -1 });
AssignmentSchema.index({ assignedBy: 1 });
AssignmentSchema.index({ studentId: 1, exerciseId: 1 }, { unique: true });

const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);

export default Assignment;
