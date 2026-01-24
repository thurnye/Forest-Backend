"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentServiceAPI = exports.createGuardianHeaders = exports.studentServiceClient = void 0;
const axios_1 = __importDefault(require("axios"));
const libs_1 = require("@readingForest/libs");
const STUDENT_SERVICE_URL = process.env.STUDENT_SERVICE_URL_INTERNAL || 'http://localhost:3003';
exports.studentServiceClient = axios_1.default.create({
    baseURL: STUDENT_SERVICE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
exports.studentServiceClient.interceptors.request.use((config) => {
    libs_1.logger.info('Outgoing request to student-service', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
    });
    return config;
}, (error) => {
    libs_1.logger.error('Request error to student-service', { error: error.message });
    return Promise.reject(error);
});
exports.studentServiceClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response) {
        libs_1.logger.error('Student service error response', {
            status: error.response.status,
            data: error.response.data,
            url: error.config?.url,
        });
    }
    else if (error.request) {
        libs_1.logger.error('Student service no response', {
            url: error.config?.url,
            message: error.message,
        });
    }
    else {
        libs_1.logger.error('Student service request error', { message: error.message });
    }
    return Promise.reject(error);
});
const createGuardianHeaders = (guardianId, role) => ({
    'x-user-id': guardianId,
    'x-user-role': role || 'PARENT',
});
exports.createGuardianHeaders = createGuardianHeaders;
exports.StudentServiceAPI = {
    getStudentsByGuardian: (guardianId, headers) => exports.studentServiceClient.get(`/students/guardian/${guardianId}`, { headers }),
    getStudentDetail: (studentId, headers) => exports.studentServiceClient.get(`/students/${studentId}`, { headers }),
    createStudent: (data, headers) => exports.studentServiceClient.post('/students', data, { headers }),
    updateStudent: (studentId, data, headers) => exports.studentServiceClient.patch(`/students/${studentId}`, data, { headers }),
    lookupStudentByEmail: (email, headers) => exports.studentServiceClient.get(`/students/lookup`, { params: { email }, headers }),
    linkStudent: (studentId, headers) => exports.studentServiceClient.post(`/students/${studentId}/link`, {}, { headers }),
    unlinkStudent: (studentId, headers) => exports.studentServiceClient.post(`/students/${studentId}/unlink`, {}, { headers }),
    verifyOwnership: (studentId, headers) => exports.studentServiceClient.get(`/students/${studentId}/verify-ownership`, { headers }),
    getExercises: (params, headers) => exports.studentServiceClient.get('/exercises', { params, headers }),
    createGoal: (data, headers) => exports.studentServiceClient.post('/goals', data, { headers }),
    getGoalsByStudent: (studentId, params, headers) => exports.studentServiceClient.get(`/goals/student/${studentId}`, { params, headers }),
    createAssignment: (data, headers) => exports.studentServiceClient.post('/assignments', data, { headers }),
    getAssignmentsByStudent: (studentId, params, headers) => exports.studentServiceClient.get(`/assignments/student/${studentId}`, { params, headers }),
    createInitialProgress: (studentId, headers) => exports.studentServiceClient.post(`/progress/${studentId}/init`, {}, { headers }),
};
exports.default = exports.StudentServiceAPI;
//# sourceMappingURL=studentServiceClient.js.map