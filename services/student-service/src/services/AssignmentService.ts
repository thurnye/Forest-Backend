import mongoose from 'mongoose';
import { Assignment, Exercise } from '../db/models';
import { Errors } from '@readingForest/libs';

class AssignmentService {
  /**
   * Get assignments for a student
   */
  async getAssignmentsByStudentId(
    studentId: string,
    options?: {
      status?: string;
      limit?: number;
      skip?: number;
    },
  ) {
    const query: Record<string, unknown> = {
      studentId: new mongoose.Types.ObjectId(studentId),
    };

    if (options?.status) {
      query.status = options.status;
    }

    const assignments = await Assignment.find(query)
      .sort({ assignedAt: -1 })
      .skip(options?.skip || 0)
      .limit(options?.limit || 20)
      .populate('exerciseId', 'title readingLevel skillStrand type estimatedTime');

    return assignments;
  }

  /**
   * Get assignment by ID
   */
  async getAssignmentById(assignmentId: string) {
    const assignment = await Assignment.findById(assignmentId).populate(
      'exerciseId',
      'title readingLevel skillStrand type estimatedTime',
    );
    if (!assignment) {
      throw Errors.notFound('Assignment not found');
    }
    return assignment;
  }

  /**
   * Create a new assignment
   */
  async createAssignment(data: {
    studentId: string;
    exerciseId: string;
    assignedBy: string;
    dueDate?: Date;
  }) {
    // Verify exercise exists
    const exercise = await Exercise.findById(data.exerciseId);
    if (!exercise) {
      throw Errors.notFound('Exercise not found');
    }

    // Check if assignment already exists
    const existing = await Assignment.findOne({
      studentId: new mongoose.Types.ObjectId(data.studentId),
      exerciseId: new mongoose.Types.ObjectId(data.exerciseId),
    });

    if (existing) {
      throw Errors.conflict('Assignment already exists for this exercise');
    }

    const assignment = await Assignment.create({
      studentId: new mongoose.Types.ObjectId(data.studentId),
      exerciseId: new mongoose.Types.ObjectId(data.exerciseId),
      assignedBy: new mongoose.Types.ObjectId(data.assignedBy),
      dueDate: data.dueDate,
    });

    return assignment;
  }

  /**
   * Update assignment status
   */
  async updateAssignmentStatus(
    assignmentId: string,
    status: 'pending' | 'in-progress' | 'completed',
  ) {
    const updateData: Record<string, unknown> = { status };
    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const assignment = await Assignment.findByIdAndUpdate(assignmentId, updateData, {
      new: true,
    });

    if (!assignment) {
      throw Errors.notFound('Assignment not found');
    }

    return assignment;
  }

  /**
   * Delete assignment
   */
  async deleteAssignment(assignmentId: string) {
    const assignment = await Assignment.findByIdAndDelete(assignmentId);
    if (!assignment) {
      throw Errors.notFound('Assignment not found');
    }
    return assignment;
  }

  /**
   * Get pending assignments count for a student
   */
  async getPendingAssignmentsCount(studentId: string) {
    const count = await Assignment.countDocuments({
      studentId: new mongoose.Types.ObjectId(studentId),
      status: 'pending',
    });
    return count;
  }
}

export default new AssignmentService();
