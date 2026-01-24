import mongoose from 'mongoose';
import { Student, StudentProgress, Goal } from '../db/models';
import { Errors } from '@readingForest/libs';

class DashboardService {
  /**
   * Get all dashboard data for a student in a single call
   * Returns progress and goals combined
   */
  async getDashboardData(studentId: string) {
    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      throw Errors.notFound('Student not found');
    }

    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    // Fetch progress and goals in parallel
    const [progress, goals] = await Promise.all([
      StudentProgress.findOne({ studentId: studentObjectId }),
      Goal.find({ studentId: studentObjectId, status: 'active' })
        .sort({ deadline: 1, createdAt: -1 })
        .limit(10),
    ]);

    // Return default progress if none exists
    const progressData = progress || {
      studentId,
      currentLevel: student.grade || 'pre-k',
      exercisesCompleted: 0,
      totalExercises: 0,
      averageScore: 0,
      streakDays: 0,
      lastActivityAt: null,
    };

    return {
      progress: progressData,
      goals: goals || [],
    };
  }
}

export default new DashboardService();
