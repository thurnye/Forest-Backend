import mongoose from 'mongoose';
import { Student, StudentProgress } from '../db/models';
import { Errors } from '@readingForest/libs';

class StudentService {
  /**
   * Get student detail with aggregation pipeline
   * Returns student base info + progress + recentAssessments(limit 5) + recentExerciseAttempts(limit 5)
   * recentExerciseAttempts includes exercise title and readingLevel
   */
  async getStudentDetail(studentId: string) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw Errors.badRequest('Invalid studentId');
    }

    const result = await Student.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(studentId) },
      },

      // ✅ Lookup latest progress (prevents duplicates if multiple progress docs exist)
      {
        $lookup: {
          from: 'studentprogresses',
          let: { studentId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$studentId', '$$studentId'] } } },
            { $sort: { lastActivityAt: -1, updatedAt: -1, createdAt: -1 } },
            { $limit: 1 },
          ],
          as: 'progress',
        },
      },
      {
        $unwind: {
          path: '$progress',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Lookup recent assessments (limit 5)
      {
        $lookup: {
          from: 'assessments',
          let: { studentId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$studentId', '$$studentId'] } } },
            { $sort: { completedAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                _id: 1,
                type: 1,
                status: 1,
                overallScore: 1,
                determinedLevel: 1,
                completedAt: 1,
              },
            },
          ],
          as: 'recentAssessments',
        },
      },

      // Lookup recent exercise attempts with exercise details
      {
        $lookup: {
          from: 'exerciseattempts',
          let: { studentId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$studentId', '$$studentId'] } } },
            { $sort: { completedAt: -1 } },
            { $limit: 5 },
            {
              $lookup: {
                from: 'exercises',
                localField: 'exerciseId',
                foreignField: '_id',
                as: 'exercise',
              },
            },
            {
              $unwind: {
                path: '$exercise',
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                _id: 1,
                exerciseId: 1,
                score: 1,
                percentage: 1,
                status: 1,
                completedAt: 1,
                timeSpent: 1,
                exerciseTitle: '$exercise.title',
                exerciseReadingLevel: '$exercise.readingLevel',
              },
            },
          ],
          as: 'recentExerciseAttempts',
        },
      },

      // Project final shape
      {
        $project: {
          _id: 1,
          guardianId: 1,
          email: 1,
          firstName: 1,
          lastName: 1,
          username: 1,
          avatar: 1,
          dateOfBirth: 1,
          grade: 1,
          readingLevel: 1,
          targetGradeLevel: 1,
          hasCompletedDiagnostic: 1,
          diagnosticEnabled: 1,
          isActive: 1,
          createdAt: 1,
          progress: {
            $ifNull: [
              '$progress',
              {
                currentLevel: 'pre-k',
                exercisesCompleted: 0,
                totalExercises: 0,
                averageScore: 0,
                streakDays: 0,
                lastActivityAt: null,
              },
            ],
          },
          recentAssessments: 1,
          recentExerciseAttempts: 1,
        },
      },
    ]);

    if (!result || result.length === 0) {
      throw Errors.notFound('Student not found');
    }

    return result[0];
  }

  /**
   * Get all students for a guardian (parent dashboard)
   * Returns lightweight student list with progress only
   */
  async getStudentsByGuardianId(guardianId: string) {
    const guardianObjectId = mongoose.Types.ObjectId.isValid(guardianId)
      ? new mongoose.Types.ObjectId(guardianId)
      : null;

    // ✅ Safe guardian match (ObjectId + string fallback)
    const guardianMatch = guardianObjectId
      ? { $or: [{ guardianId: guardianObjectId }, { guardianId }] }
      : { guardianId };

    console.log(
      '[StudentService] getStudentsByGuardianId called with:',
      guardianId,
    );
    console.log('[StudentService] Converted to ObjectId:', guardianObjectId);

    // Debug: First do a simple find to see all students with this guardianId
    // NOTE: If guardianObjectId is null, don't include it in $or.
    const debugQuery = guardianObjectId
      ? { $or: [{ guardianId: guardianObjectId }, { guardianId }] }
      : { guardianId };

    const debugStudents = await Student.find(debugQuery).lean();
    console.log(
      '[StudentService] Debug find result count:',
      debugStudents.length,
    );
    console.log(
      '[StudentService] Debug students:',
      debugStudents.map((s: any) => ({
        _id: s._id,
        firstName: s.firstName,
        guardianId: s.guardianId,
        guardianIdType: typeof s.guardianId,
        isActive: s.isActive,
      })),
    );

    const students = await Student.aggregate([
      {
        $match: {
          $and: [
            guardianMatch,
            { $or: [{ isActive: true }, { isActive: { $exists: false } }] },
          ],
        },
      },

      // ✅ Lookup ONLY the latest progress record (prevents duplicates)
      {
        $lookup: {
          from: 'studentprogresses',
          let: { studentId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$studentId', '$$studentId'] } } },
            { $sort: { lastActivityAt: -1, updatedAt: -1, createdAt: -1 } },
            { $limit: 1 },
            {
              $project: {
                _id: 0,
                currentLevel: 1,
                exercisesCompleted: 1,
                averageScore: 1,
                streakDays: 1,
                lastActivityAt: 1,
              },
            },
          ],
          as: 'progress',
        },
      },
      {
        $unwind: {
          path: '$progress',
          preserveNullAndEmptyArrays: true,
        },
      },

      // ✅ Stable sort key (null lastActivityAt goes to bottom)
      {
        $addFields: {
          _lastActivityAt: {
            $ifNull: ['$progress.lastActivityAt', new Date(0)],
          },
        },
      },
      { $sort: { _lastActivityAt: -1, createdAt: -1 } },

      // ✅ Remove helper field without mixing inclusion/exclusion in $project
      { $unset: '_lastActivityAt' },

      // ✅ Final projection (inclusion-only)
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          username: 1,
          avatar: 1,
          grade: 1,
          readingLevel: 1,
          progress: {
            currentLevel: { $ifNull: ['$progress.currentLevel', 'pre-k'] },
            exercisesCompleted: { $ifNull: ['$progress.exercisesCompleted', 0] },
            averageScore: { $ifNull: ['$progress.averageScore', 0] },
            streakDays: { $ifNull: ['$progress.streakDays', 0] },
            lastActivityAt: '$progress.lastActivityAt',
          },
        },
      },
    ]);

    console.log(
      '[StudentService] getStudentsByGuardianId found students count:',
      students.length,
    );

    return students;
  }

  /**
   * Get student by ID
   */
  async getStudentById(studentId: string) {
    const student = await Student.findById(studentId);
    if (!student) {
      throw Errors.notFound('Student not found');
    }
    return student;
  }

  /**
   * Create a new student
   */
  async createStudent(data: {
    guardianId: string;
    email: string;
    firstName: string;
    lastName: string;
    username?: string;
    avatar?: string;
    dateOfBirth?: Date;
    grade?: string;
    targetGradeLevel?: string;
    diagnosticEnabled?: boolean;
  }) {
    if (!mongoose.Types.ObjectId.isValid(data.guardianId)) {
      throw Errors.badRequest('Invalid guardianId');
    }

    const student = await Student.create({
      ...data,
      guardianId: new mongoose.Types.ObjectId(data.guardianId),
    });

    // Create initial progress record
    await StudentProgress.create({
      studentId: student._id,
    });

    return student;
  }

  /**
   * Update student
   */
  async updateStudent(
    studentId: string,
    data: Partial<{
      firstName: string;
      lastName: string;
      username: string;
      avatar: string;
      dateOfBirth: Date;
      grade: string;
      readingLevel: string;
      targetGradeLevel: string;
      hasCompletedDiagnostic: boolean;
      diagnosticEnabled: boolean;
    }>,
  ) {
    const student = await Student.findByIdAndUpdate(studentId, data, {
      new: true,
    });
    if (!student) {
      throw Errors.notFound('Student not found');
    }
    return student;
  }

  /**
   * Delete student (soft delete)
   */
  async deleteStudent(studentId: string) {
    const student = await Student.findByIdAndUpdate(
      studentId,
      { isActive: false },
      { new: true },
    );
    if (!student) {
      throw Errors.notFound('Student not found');
    }
    return student;
  }

  /**
   * Get student by email
   */
  async getStudentByEmail(email: string) {
    const student = await Student.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });
    return student;
  }

  /**
   * Unlink student from guardian (set guardianId to null)
   */
  async unlinkFromGuardian(studentId: string, guardianId: string) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw Errors.badRequest('Invalid studentId');
    }

    const guardianObjectId = mongoose.Types.ObjectId.isValid(guardianId)
      ? new mongoose.Types.ObjectId(guardianId)
      : null;

    const guardianMatch = guardianObjectId
      ? { $or: [{ guardianId: guardianObjectId }, { guardianId }] }
      : { guardianId };

    const student = await Student.findOne({
      _id: new mongoose.Types.ObjectId(studentId),
      ...guardianMatch,
    });

    if (!student) {
      throw Errors.notFound(
        'Student not found or does not belong to this guardian',
      );
    }

    // Set guardianId to null to unlink
    student.guardianId = null as any;
    await student.save();
    return student;
  }

  /**
   * Link student to guardian
   */
  async linkToGuardian(studentId: string, guardianId: string) {
    if (!mongoose.Types.ObjectId.isValid(guardianId)) {
      throw Errors.badRequest('Invalid guardianId');
    }

    const student = await Student.findById(studentId);
    if (!student) {
      throw Errors.notFound('Student not found');
    }

    if (student.guardianId) {
      throw Errors.conflict('Student is already linked to a guardian');
    }

    student.guardianId = new mongoose.Types.ObjectId(guardianId);
    await student.save();
    return student;
  }

  /**
   * Verify student belongs to guardian
   */
  async verifyStudentOwnership(studentId: string, guardianId: string) {
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return false;
    }

    const guardianObjectId = mongoose.Types.ObjectId.isValid(guardianId)
      ? new mongoose.Types.ObjectId(guardianId)
      : null;

    const guardianMatch = guardianObjectId
      ? { $or: [{ guardianId: guardianObjectId }, { guardianId }] }
      : { guardianId };

    const student = await Student.findOne({
      _id: new mongoose.Types.ObjectId(studentId),
      ...guardianMatch,
      isActive: true,
    });

    return !!student;
  }
}

export default new StudentService();
