import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { logger } from '@readingForest/libs';

const STUDENT_SERVICE_URL = process.env.STUDENT_SERVICE_URL_INTERNAL || 'http://localhost:3003';

/**
 * Axios instance for calling student-service
 */
export const studentServiceClient: AxiosInstance = axios.create({
  baseURL: STUDENT_SERVICE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
studentServiceClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    logger.info('Outgoing request to student-service', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
    });
    return config;
  },
  (error: AxiosError) => {
    logger.error('Request error to student-service', { error: error.message });
    return Promise.reject(error);
  },
);

// Response interceptor for logging and error handling
studentServiceClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      logger.error('Student service error response', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      logger.error('Student service no response', {
        url: error.config?.url,
        message: error.message,
      });
    } else {
      logger.error('Student service request error', { message: error.message });
    }
    return Promise.reject(error);
  },
);

/**
 * Helper to create headers with guardian context
 */
export const createGuardianHeaders = (guardianId: string, role?: string) => ({
  'x-user-id': guardianId,
  'x-user-role': role || 'PARENT',
});

/**
 * Student Service API wrapper
 */
export const StudentServiceAPI = {
  // Students
  getStudentsByGuardian: (guardianId: string, headers: Record<string, string>) =>
    studentServiceClient.get(`/students/guardian/${guardianId}`, { headers }),

  getStudentDetail: (studentId: string, headers: Record<string, string>) =>
    studentServiceClient.get(`/students/${studentId}`, { headers }),

  createStudent: (data: Record<string, unknown>, headers: Record<string, string>) =>
    studentServiceClient.post('/students', data, { headers }),

  updateStudent: (studentId: string, data: Record<string, unknown>, headers: Record<string, string>) =>
    studentServiceClient.patch(`/students/${studentId}`, data, { headers }),

  lookupStudentByEmail: (email: string, headers: Record<string, string>) =>
    studentServiceClient.get(`/students/lookup`, { params: { email }, headers }),

  linkStudent: (studentId: string, headers: Record<string, string>) =>
    studentServiceClient.post(`/students/${studentId}/link`, {}, { headers }),

  unlinkStudent: (studentId: string, headers: Record<string, string>) =>
    studentServiceClient.post(`/students/${studentId}/unlink`, {}, { headers }),

  verifyOwnership: (studentId: string, headers: Record<string, string>) =>
    studentServiceClient.get(`/students/${studentId}/verify-ownership`, { headers }),

  // Exercises
  getExercises: (params: Record<string, unknown>, headers: Record<string, string>) =>
    studentServiceClient.get('/exercises', { params, headers }),

  // Goals
  createGoal: (data: Record<string, unknown>, headers: Record<string, string>) =>
    studentServiceClient.post('/goals', data, { headers }),

  getGoalsByStudent: (studentId: string, params: Record<string, unknown>, headers: Record<string, string>) =>
    studentServiceClient.get(`/goals/student/${studentId}`, { params, headers }),

  // Assignments
  createAssignment: (data: Record<string, unknown>, headers: Record<string, string>) =>
    studentServiceClient.post('/assignments', data, { headers }),

  getAssignmentsByStudent: (studentId: string, params: Record<string, unknown>, headers: Record<string, string>) =>
    studentServiceClient.get(`/assignments/student/${studentId}`, { params, headers }),

  // Progress
  createInitialProgress: (studentId: string, headers: Record<string, string>) =>
    studentServiceClient.post(`/progress/${studentId}/init`, {}, { headers }),
};

export default StudentServiceAPI;
