import mongoose from 'mongoose';
import { StudentProgress } from '../db/models';

class ProgressService {
  /**
   * Get progress for a student
   */
  async getProgressByStudentId(studentId: string) {
    const progress = await StudentProgress.findOne({
      studentId: new mongoose.Types.ObjectId(studentId),
    });

    if (!progress) {
      // Return default progress if none exists
      return {
        studentId,
        currentLevel: 'pre-k',
        exercisesCompleted: 0,
        totalExercises: 0,
        averageScore: 0,
        streakDays: 0,
        lastActivityAt: null,
      };
    }

    return progress;
  }

  /**
   * Update progress for a student
   */
  async updateProgress(
    studentId: string,
    data: Partial<{
      currentLevel: string;
      exercisesCompleted: number;
      totalExercises: number;
      averageScore: number;
      streakDays: number;
      lastActivityAt: Date;
    }>,
  ) {
    const progress = await StudentProgress.findOneAndUpdate(
      { studentId: new mongoose.Types.ObjectId(studentId) },
      { $set: data },
      { new: true, upsert: true },
    );

    return progress;
  }

  /**
   * Increment exercises completed and update average score
   */
  async incrementExerciseCompletion(studentId: string, score: number) {
    const progress = await StudentProgress.findOne({
      studentId: new mongoose.Types.ObjectId(studentId),
    });

    if (!progress) {
      // Create new progress record
      return await StudentProgress.create({
        studentId: new mongoose.Types.ObjectId(studentId),
        exercisesCompleted: 1,
        averageScore: score,
        lastActivityAt: new Date(),
      });
    }

    // Calculate new average score
    const totalScore = progress.averageScore * progress.exercisesCompleted + score;
    const newExercisesCompleted = progress.exercisesCompleted + 1;
    const newAverageScore = totalScore / newExercisesCompleted;

    progress.exercisesCompleted = newExercisesCompleted;
    progress.averageScore = Math.round(newAverageScore * 100) / 100;
    progress.lastActivityAt = new Date();

    await progress.save();
    return progress;
  }

  /**
   * Update streak days
   */
  async updateStreak(studentId: string) {
    const progress = await StudentProgress.findOne({
      studentId: new mongoose.Types.ObjectId(studentId),
    });

    if (!progress) {
      return await StudentProgress.create({
        studentId: new mongoose.Types.ObjectId(studentId),
        streakDays: 1,
        lastActivityAt: new Date(),
      });
    }

    const now = new Date();
    const lastActivity = progress.lastActivityAt;

    if (lastActivity) {
      const daysSinceLastActivity = Math.floor(
        (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysSinceLastActivity === 1) {
        // Consecutive day - increment streak
        progress.streakDays += 1;
      } else if (daysSinceLastActivity > 1) {
        // Streak broken - reset to 1
        progress.streakDays = 1;
      }
      // Same day - no change to streak
    } else {
      progress.streakDays = 1;
    }

    progress.lastActivityAt = now;
    await progress.save();
    return progress;
  }
}

export default new ProgressService();
