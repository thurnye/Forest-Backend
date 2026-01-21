import mongoose from 'mongoose';
import { ExerciseAttempt, Exercise, StudentProgress } from '../db/models';
import { Errors } from '@readingForest/libs';

class AttemptService {
  /**
   * Get attempts for a student
   */
  async getAttemptsByStudentId(
    studentId: string,
    options?: {
      exerciseId?: string;
      status?: string;
      limit?: number;
      skip?: number;
    },
  ) {
    const query: Record<string, unknown> = {
      studentId: new mongoose.Types.ObjectId(studentId),
    };

    if (options?.exerciseId) {
      query.exerciseId = new mongoose.Types.ObjectId(options.exerciseId);
    }

    if (options?.status) {
      query.status = options.status;
    }

    const attempts = await ExerciseAttempt.find(query)
      .sort({ completedAt: -1, createdAt: -1 })
      .skip(options?.skip || 0)
      .limit(options?.limit || 20)
      .populate('exerciseId', 'title readingLevel skillStrand');

    return attempts;
  }

  /**
   * Get attempt by ID
   */
  async getAttemptById(attemptId: string) {
    const attempt = await ExerciseAttempt.findById(attemptId).populate(
      'exerciseId',
      'title readingLevel skillStrand questions',
    );
    if (!attempt) {
      throw Errors.notFound('Attempt not found');
    }
    return attempt;
  }

  /**
   * Start a new exercise attempt
   */
  async startAttempt(studentId: string, exerciseId: string) {
    // Verify exercise exists
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      throw Errors.notFound('Exercise not found');
    }

    const attempt = await ExerciseAttempt.create({
      studentId: new mongoose.Types.ObjectId(studentId),
      exerciseId: new mongoose.Types.ObjectId(exerciseId),
      totalPoints: exercise.totalPoints,
      status: 'in-progress',
      startedAt: new Date(),
    });

    return attempt;
  }

  /**
   * Update answers during an attempt
   */
  async updateAnswers(attemptId: string, answers: Record<string, string>) {
    const attempt = await ExerciseAttempt.findById(attemptId);
    if (!attempt) {
      throw Errors.notFound('Attempt not found');
    }

    // Merge new answers with existing
    for (const [questionId, answer] of Object.entries(answers)) {
      attempt.answers.set(questionId, answer);
    }

    await attempt.save();
    return attempt;
  }

  /**
   * Complete an attempt and update student progress
   */
  async completeAttempt(
    attemptId: string,
    data: {
      answers: Record<string, string>;
      timeSpent: number;
    },
  ) {
    const attempt = await ExerciseAttempt.findById(attemptId);
    if (!attempt) {
      throw Errors.notFound('Attempt not found');
    }

    // Get exercise for grading
    const exercise = await Exercise.findById(attempt.exerciseId);
    if (!exercise) {
      throw Errors.notFound('Exercise not found');
    }

    // Update answers
    for (const [questionId, answer] of Object.entries(data.answers)) {
      attempt.answers.set(questionId, answer);
    }

    // Grade the attempt
    let score = 0;
    let totalPoints = 0;

    for (const question of exercise.questions) {
      const questionId = question.questionId;
      const studentAnswer = attempt.answers.get(questionId);
      const questionPoints = question.points || 1;
      totalPoints += questionPoints;

      // Handle both string and string[] correctAnswer types
      const correctAnswer = question.correctAnswer;
      if (studentAnswer) {
        const studentAnswerLower = studentAnswer.toLowerCase();
        const isCorrect = Array.isArray(correctAnswer)
          ? correctAnswer.some((ans) => ans.toLowerCase() === studentAnswerLower)
          : correctAnswer.toLowerCase() === studentAnswerLower;
        if (isCorrect) {
          score += questionPoints;
        }
      }
    }

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

    attempt.score = score;
    attempt.totalPoints = totalPoints;
    attempt.percentage = percentage;
    attempt.status = 'completed';
    attempt.completedAt = new Date();
    attempt.timeSpent = data.timeSpent;

    await attempt.save();

    // Update student progress
    await this.updateStudentProgress(attempt.studentId.toString(), percentage);

    return attempt;
  }

  /**
   * Update student progress after completing an attempt
   */
  private async updateStudentProgress(studentId: string, score: number) {
    const progress = await StudentProgress.findOne({
      studentId: new mongoose.Types.ObjectId(studentId),
    });

    if (!progress) {
      // Create new progress record
      await StudentProgress.create({
        studentId: new mongoose.Types.ObjectId(studentId),
        exercisesCompleted: 1,
        averageScore: score,
        lastActivityAt: new Date(),
      });
      return;
    }

    // Calculate new average score
    const totalScore = progress.averageScore * progress.exercisesCompleted + score;
    const newExercisesCompleted = progress.exercisesCompleted + 1;
    const newAverageScore = totalScore / newExercisesCompleted;

    progress.exercisesCompleted = newExercisesCompleted;
    progress.averageScore = Math.round(newAverageScore * 100) / 100;
    progress.lastActivityAt = new Date();

    await progress.save();
  }

  /**
   * Abandon an attempt
   */
  async abandonAttempt(attemptId: string) {
    const attempt = await ExerciseAttempt.findByIdAndUpdate(
      attemptId,
      { status: 'abandoned' },
      { new: true },
    );

    if (!attempt) {
      throw Errors.notFound('Attempt not found');
    }

    return attempt;
  }

  /**
   * Get attempt history for an exercise
   */
  async getAttemptHistory(studentId: string, exerciseId: string) {
    const attempts = await ExerciseAttempt.find({
      studentId: new mongoose.Types.ObjectId(studentId),
      exerciseId: new mongoose.Types.ObjectId(exerciseId),
    })
      .sort({ completedAt: -1 })
      .limit(10);

    return attempts;
  }
}

export default new AttemptService();
