import { Exercise } from '../db/models';
import { Errors } from '@readingForest/libs';

class ExerciseService {
  /**
   * Get exercises by reading level with optional filters
   */
  async getExercisesByLevel(
    readingLevel: string,
    options?: {
      skillStrand?: string;
      type?: string;
      limit?: number;
      skip?: number;
    },
  ) {
    const query: Record<string, unknown> = {
      readingLevel,
      isActive: true,
    };

    if (options?.skillStrand) {
      query.skillStrand = options.skillStrand;
    }

    if (options?.type) {
      query.type = options.type;
    }

    const exercises = await Exercise.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(options?.skip || 0)
      .limit(options?.limit || 20)
      .select('-questions.correctAnswer'); // Hide answers in listing

    return exercises;
  }

  /**
   * Get exercise by ID with full details (including answers for grading)
   */
  async getExerciseById(exerciseId: string) {
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      throw Errors.notFound('Exercise not found');
    }
    return exercise;
  }

  /**
   * Get exercise for student (without answers)
   */
  async getExerciseForStudent(exerciseId: string) {
    const exercise = await Exercise.findById(exerciseId).select('-questions.correctAnswer');
    if (!exercise) {
      throw Errors.notFound('Exercise not found');
    }
    return exercise;
  }

  /**
   * Create a new exercise
   */
  async createExercise(data: {
    title: string;
    description?: string;
    type: string;
    readingLevel: string;
    skillStrand: string;
    estimatedTime?: number;
    points?: number;
    order?: number;
    questions: Array<{
      questionText: string;
      questionType: string;
      options?: string[];
      correctAnswer: string;
      points?: number;
      explanation?: string;
    }>;
    tags?: string[];
    prerequisites?: string[];
  }) {
    const exercise = await Exercise.create(data);
    return exercise;
  }

  /**
   * Update an exercise
   */
  async updateExercise(
    exerciseId: string,
    data: Partial<{
      title: string;
      description: string;
      type: string;
      readingLevel: string;
      skillStrand: string;
      estimatedTime: number;
      points: number;
      order: number;
      questions: Array<{
        questionText: string;
        questionType: string;
        options?: string[];
        correctAnswer: string;
        points?: number;
        explanation?: string;
      }>;
      tags: string[];
      prerequisites: string[];
      isActive: boolean;
    }>,
  ) {
    const exercise = await Exercise.findByIdAndUpdate(exerciseId, data, { new: true });
    if (!exercise) {
      throw Errors.notFound('Exercise not found');
    }
    return exercise;
  }

  /**
   * Delete exercise (soft delete)
   */
  async deleteExercise(exerciseId: string) {
    const exercise = await Exercise.findByIdAndUpdate(
      exerciseId,
      { isActive: false },
      { new: true },
    );
    if (!exercise) {
      throw Errors.notFound('Exercise not found');
    }
    return exercise;
  }

  /**
   * Get exercises count by level
   */
  async getExerciseCountByLevel(readingLevel: string) {
    const count = await Exercise.countDocuments({
      readingLevel,
      isActive: true,
    });
    return count;
  }
}

export default new ExerciseService();
