import mongoose from 'mongoose';
import { Assessment, Student } from '../db/models';
import { Errors } from '@readingForest/libs';

class AssessmentService {
  /**
   * Get assessments for a student
   */
  async getAssessmentsByStudentId(
    studentId: string,
    options?: {
      type?: string;
      status?: string;
      limit?: number;
      skip?: number;
    },
  ) {
    const query: Record<string, unknown> = {
      studentId: new mongoose.Types.ObjectId(studentId),
    };

    if (options?.type) {
      query.type = options.type;
    }

    if (options?.status) {
      query.status = options.status;
    }

    const assessments = await Assessment.find(query)
      .sort({ completedAt: -1, createdAt: -1 })
      .skip(options?.skip || 0)
      .limit(options?.limit || 20);

    return assessments;
  }

  /**
   * Get assessment by ID
   */
  async getAssessmentById(assessmentId: string) {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      throw Errors.notFound('Assessment not found');
    }
    return assessment;
  }

  /**
   * Create a new assessment
   */
  async createAssessment(data: {
    studentId: string;
    type: 'diagnostic' | 'placement' | 'progress' | 'mastery';
  }) {
    const assessment = await Assessment.create({
      studentId: new mongoose.Types.ObjectId(data.studentId),
      type: data.type,
      status: 'pending',
    });

    return assessment;
  }

  /**
   * Start an assessment
   */
  async startAssessment(assessmentId: string) {
    const assessment = await Assessment.findByIdAndUpdate(
      assessmentId,
      {
        status: 'in-progress',
        startedAt: new Date(),
      },
      { new: true },
    );

    if (!assessment) {
      throw Errors.notFound('Assessment not found');
    }

    return assessment;
  }

  /**
   * Complete an assessment with results
   */
  async completeAssessment(
    assessmentId: string,
    data: {
      results: Array<{
        skillStrand: string;
        score: number;
        level: string;
      }>;
      overallScore: number;
      determinedLevel: string;
      recommendations?: string[];
      timeSpent: number;
    },
  ) {
    const assessment = await Assessment.findByIdAndUpdate(
      assessmentId,
      {
        status: 'completed',
        results: data.results,
        overallScore: data.overallScore,
        determinedLevel: data.determinedLevel,
        recommendations: data.recommendations || [],
        timeSpent: data.timeSpent,
        completedAt: new Date(),
      },
      { new: true },
    );

    if (!assessment) {
      throw Errors.notFound('Assessment not found');
    }

    // If this is a diagnostic assessment, update student's reading level
    if (assessment.type === 'diagnostic') {
      await Student.findByIdAndUpdate(assessment.studentId, {
        readingLevel: data.determinedLevel,
        hasCompletedDiagnostic: true,
      });
    }

    return assessment;
  }

  /**
   * Get latest diagnostic assessment for a student
   */
  async getLatestDiagnostic(studentId: string) {
    const assessment = await Assessment.findOne({
      studentId: new mongoose.Types.ObjectId(studentId),
      type: 'diagnostic',
      status: 'completed',
    }).sort({ completedAt: -1 });

    return assessment;
  }
}

export default new AssessmentService();
