import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { logger } from '@readingForest/libs';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL_INTERNAL || 'http://localhost:3001';

/**
 * Axios instance for calling auth-service
 */
export const authServiceClient: AxiosInstance = axios.create({
  baseURL: AUTH_SERVICE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
authServiceClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    logger.info('Outgoing request to auth-service', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
    });
    return config;
  },
  (error: AxiosError) => {
    logger.error('Request error to auth-service', { error: error.message });
    return Promise.reject(error);
  },
);

// Response interceptor for logging and error handling
authServiceClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      logger.error('Auth service error response', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      logger.error('Auth service no response', {
        url: error.config?.url,
        message: error.message,
      });
    } else {
      logger.error('Auth service request error', { message: error.message });
    }
    return Promise.reject(error);
  },
);

/**
 * Auth Service API wrapper for student operations
 */
export const AuthServiceAPI = {
  /**
   * Register a new student via auth-service
   */
  
  registerStudent: (data: {
    password: string;
    firstName: string;
    lastName: string;
    username?: string;
    avatar?: string;
    dateOfBirth?: string;
    grade?: string;
    targetGradeLevel?: string;
    diagnosticEnabled?: boolean;
    guardianId: string;
  }) => {
    return authServiceClient.post('/student/register', data);
  },
};

export default AuthServiceAPI;
