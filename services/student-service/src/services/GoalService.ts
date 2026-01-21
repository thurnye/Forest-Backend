import mongoose from 'mongoose';
import { Goal } from '../db/models';
import { Errors } from '@readingForest/libs';

class GoalService {
  /**
   * Get goals for a student
   */
  async getGoalsByStudentId(
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

    const goals = await Goal.find(query)
      .sort({ deadline: 1, createdAt: -1 })
      .skip(options?.skip || 0)
      .limit(options?.limit || 20);

    return goals;
  }

  /**
   * Get goal by ID
   */
  async getGoalById(goalId: string) {
    const goal = await Goal.findById(goalId);
    if (!goal) {
      throw Errors.notFound('Goal not found');
    }
    return goal;
  }

  /**
   * Create a new goal
   */
  async createGoal(data: {
    studentId: string;
    title: string;
    description?: string;
    type: 'exercises' | 'time' | 'streak' | 'score' | 'level';
    targetValue: number;
    unit: string;
    deadline: Date;
    createdBy?: 'student' | 'parent' | 'teacher' | 'system';
  }) {
    const goal = await Goal.create({
      ...data,
      studentId: new mongoose.Types.ObjectId(data.studentId),
    });

    return goal;
  }

  /**
   * Update a goal
   */
  async updateGoal(
    goalId: string,
    data: Partial<{
      title: string;
      description: string;
      targetValue: number;
      currentValue: number;
      deadline: Date;
      status: 'active' | 'completed' | 'expired' | 'cancelled';
    }>,
  ) {
    const goal = await Goal.findByIdAndUpdate(goalId, data, { new: true });
    if (!goal) {
      throw Errors.notFound('Goal not found');
    }
    return goal;
  }

  /**
   * Update goal progress
   */
  async updateGoalProgress(goalId: string, currentValue: number) {
    const goal = await Goal.findById(goalId);
    if (!goal) {
      throw Errors.notFound('Goal not found');
    }

    goal.currentValue = currentValue;

    // Check if goal is completed
    if (currentValue >= goal.targetValue && goal.status === 'active') {
      goal.status = 'completed';
      goal.completedAt = new Date();
    }

    await goal.save();
    return goal;
  }

  /**
   * Cancel a goal
   */
  async cancelGoal(goalId: string) {
    const goal = await Goal.findByIdAndUpdate(
      goalId,
      { status: 'cancelled' },
      { new: true },
    );

    if (!goal) {
      throw Errors.notFound('Goal not found');
    }

    return goal;
  }

  /**
   * Get active goals count for a student
   */
  async getActiveGoalsCount(studentId: string) {
    const count = await Goal.countDocuments({
      studentId: new mongoose.Types.ObjectId(studentId),
      status: 'active',
    });
    return count;
  }

  /**
   * Check and update expired goals
   */
  async checkExpiredGoals() {
    const now = new Date();
    const result = await Goal.updateMany(
      {
        status: 'active',
        deadline: { $lt: now },
      },
      {
        status: 'expired',
      },
    );
    return result.modifiedCount;
  }
}

export default new GoalService();
