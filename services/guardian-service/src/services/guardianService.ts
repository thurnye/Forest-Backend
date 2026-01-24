import {
  StudentServiceAPI,
  createGuardianHeaders,
} from '../clients/studentServiceClient';
import { AuthServiceAPI } from '../clients/authServiceClient';
import { Errors } from '@readingForest/libs';
import { handleApiError } from '../utils';

class GuardianService {
  /**
   * Get all students for a guardian
   */
  async getStudents(guardianId: string) {
    try {
      const headers = createGuardianHeaders(guardianId);
      const response = await StudentServiceAPI.getStudentsByGuardian(
        guardianId,
        headers,
      );
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch students');
    }
  }

  /**
   * Get student detail (with ownership verification)
   */
  async getStudentDetail(guardianId: string, studentId: string) {
    try {
      const headers = createGuardianHeaders(guardianId);

      // First verify ownership
      const ownershipResponse = await StudentServiceAPI.verifyOwnership(
        studentId,
        headers,
      );
      if (!ownershipResponse.data.isOwner) {
        throw Errors.forbidden('Student does not belong to this guardian');
      }

      // Then get full detail
      const response = await StudentServiceAPI.getStudentDetail(
        studentId,
        headers,
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('does not belong')) {
        throw error;
      }
      handleApiError(error, 'Failed to fetch student detail');
    }
  }

  /**
   * Register a new student linked to guardian via auth-service
   */
  async registerStudent(
    guardianId: string,
    data: {
      password: string;
      firstName: string;
      lastName: string;
      username?: string;
      avatar?: string;
      dateOfBirth?: string;
      grade?: string;
      targetGradeLevel?: string;
      diagnosticEnabled?: boolean;
    },
  ) {
    try {
      const studentData = {
        ...data,
        guardianId: guardianId,
      };

      const response = await AuthServiceAPI.registerStudent(studentData);
      const studentData2 = response.data?.data || response.data;

      // Create initial progress record for the new student
      if (studentData2?.id) {
        const headers = createGuardianHeaders(guardianId);
        try {
          console.log('[GuardianService] Creating initial progress for studentId:', studentData2.id);
          await StudentServiceAPI.createInitialProgress(studentData2.id, headers);
          console.log('[GuardianService] Initial progress created successfully');
        } catch (progressError) {
          // Log but don't fail the registration if progress creation fails
          console.error('[GuardianService] Failed to create initial progress:', progressError);
        }
      } else {
        console.warn('[GuardianService] No student ID found in response:', response.data);
      }

      return studentData2;
    } catch (error) {
      handleApiError(error, 'Failed to register student');
    }
  }

  /**
   * Link an existing student to guardian by email
   */
  async linkStudentByEmail(guardianId: string, studentEmail: string) {
    try {
      const headers = createGuardianHeaders(guardianId);

      // First lookup student by email
      const lookupResponse = await StudentServiceAPI.lookupStudentByEmail(
        studentEmail,
        headers,
      );
      const student = lookupResponse.data;

      if (!student) {
        throw Errors.notFound('Student not found with this email');
      }

      // Then link the student to this guardian
      const linkResponse = await StudentServiceAPI.linkStudent(
        student._id,
        headers,
      );
      return linkResponse.data;
    } catch (error) {
      handleApiError(error, 'Failed to link student');
    }
  }

  /**
   * Unlink student from guardian
   */
  async unlinkStudent(guardianId: string, studentId: string) {
    try {
      const headers = createGuardianHeaders(guardianId);

      // Verify ownership first
      const ownershipResponse = await StudentServiceAPI.verifyOwnership(
        studentId,
        headers,
      );
      if (!ownershipResponse.data.isOwner) {
        throw Errors.forbidden('Student does not belong to this guardian');
      }

      // Unlink the student
      const response = await StudentServiceAPI.unlinkStudent(
        studentId,
        headers,
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('does not belong')) {
        throw error;
      }
      handleApiError(error, 'Failed to unlink student');
    }
  }

  /**
   * Get exercises (proxy to student-service)
   */
  async getExercises(
    guardianId: string,
    params: {
      readingLevel?: string;
      skillStrand?: string;
      type?: string;
      limit?: number;
      skip?: number;
    },
  ) {
    try {
      const headers = createGuardianHeaders(guardianId);
      const response = await StudentServiceAPI.getExercises(params, headers);
      return response.data;
    } catch (error) {
      handleApiError(error, 'Failed to fetch exercises');
    }
  }

  /**
   * Create an assignment for a student
   */
  async createAssignment(
    guardianId: string,
    studentId: string,
    exerciseId: string,
    dueDate?: Date,
  ) {
    try {
      const headers = createGuardianHeaders(guardianId);

      // Verify ownership first
      const ownershipResponse = await StudentServiceAPI.verifyOwnership(
        studentId,
        headers,
      );
      if (!ownershipResponse.data.isOwner) {
        throw Errors.forbidden('Student does not belong to this guardian');
      }

      const response = await StudentServiceAPI.createAssignment(
        { studentId, exerciseId, dueDate },
        headers,
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('does not belong')) {
        throw error;
      }
      handleApiError(error, 'Failed to create assignment');
    }
  }

  /**
   * Create a goal for a student
   */
  async createGoal(
    guardianId: string,
    data: {
      studentId: string;
      title: string;
      description?: string;
      type: string;
      targetValue: number;
      unit: string;
      deadline: Date;
    },
  ) {
    try {
      const headers = createGuardianHeaders(guardianId);

      // Verify ownership first
      const ownershipResponse = await StudentServiceAPI.verifyOwnership(
        data.studentId,
        headers,
      );
      if (!ownershipResponse.data.isOwner) {
        throw Errors.forbidden('Student does not belong to this guardian');
      }

      const goalData = {
        ...data,
        createdBy: 'parent',
      };

      const response = await StudentServiceAPI.createGoal(goalData, headers);
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('does not belong')) {
        throw error;
      }
      handleApiError(error, 'Failed to create goal');
    }
  }

  /**
   * Get goals for a student
   */
  async getStudentGoals(
    guardianId: string,
    studentId: string,
    params?: { status?: string; limit?: number; skip?: number },
  ) {
    try {
      const headers = createGuardianHeaders(guardianId);

      // Verify ownership first
      const ownershipResponse = await StudentServiceAPI.verifyOwnership(
        studentId,
        headers,
      );
      if (!ownershipResponse.data.isOwner) {
        throw Errors.forbidden('Student does not belong to this guardian');
      }

      const response = await StudentServiceAPI.getGoalsByStudent(
        studentId,
        params || {},
        headers,
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('does not belong')) {
        throw error;
      }
      handleApiError(error, 'Failed to fetch goals');
    }
  }

  /**
   * Update student diagnostic setting
   */
  async updateDiagnosticSetting(
    guardianId: string,
    studentId: string,
    enabled: boolean,
  ) {
    try {
      const headers = createGuardianHeaders(guardianId);

      // Verify ownership first
      const ownershipResponse = await StudentServiceAPI.verifyOwnership(
        studentId,
        headers,
      );
      if (!ownershipResponse.data.isOwner) {
        throw Errors.forbidden('Student does not belong to this guardian');
      }

      const response = await StudentServiceAPI.updateStudent(
        studentId,
        { diagnosticEnabled: enabled },
        headers,
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('does not belong')) {
        throw error;
      }
      handleApiError(error, 'Failed to update diagnostic setting');
    }
  }
}

export default new GuardianService();
