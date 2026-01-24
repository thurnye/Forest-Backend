"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const studentServiceClient_1 = require("../clients/studentServiceClient");
const authServiceClient_1 = require("../clients/authServiceClient");
const libs_1 = require("@readingForest/libs");
const utils_1 = require("../utils");
class GuardianService {
    async getStudents(guardianId) {
        try {
            const headers = (0, studentServiceClient_1.createGuardianHeaders)(guardianId);
            const response = await studentServiceClient_1.StudentServiceAPI.getStudentsByGuardian(guardianId, headers);
            return response.data;
        }
        catch (error) {
            (0, utils_1.handleApiError)(error, 'Failed to fetch students');
        }
    }
    async getStudentDetail(guardianId, studentId) {
        try {
            const headers = (0, studentServiceClient_1.createGuardianHeaders)(guardianId);
            const ownershipResponse = await studentServiceClient_1.StudentServiceAPI.verifyOwnership(studentId, headers);
            if (!ownershipResponse.data.isOwner) {
                throw libs_1.Errors.forbidden('Student does not belong to this guardian');
            }
            const response = await studentServiceClient_1.StudentServiceAPI.getStudentDetail(studentId, headers);
            return response.data;
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('does not belong')) {
                throw error;
            }
            (0, utils_1.handleApiError)(error, 'Failed to fetch student detail');
        }
    }
    async registerStudent(guardianId, data) {
        try {
            const studentData = {
                ...data,
                guardianId: guardianId,
            };
            const response = await authServiceClient_1.AuthServiceAPI.registerStudent(studentData);
            const studentData2 = response.data?.data || response.data;
            if (studentData2?.id) {
                const headers = (0, studentServiceClient_1.createGuardianHeaders)(guardianId);
                try {
                    console.log('[GuardianService] Creating initial progress for studentId:', studentData2.id);
                    await studentServiceClient_1.StudentServiceAPI.createInitialProgress(studentData2.id, headers);
                    console.log('[GuardianService] Initial progress created successfully');
                }
                catch (progressError) {
                    console.error('[GuardianService] Failed to create initial progress:', progressError);
                }
            }
            else {
                console.warn('[GuardianService] No student ID found in response:', response.data);
            }
            return studentData2;
        }
        catch (error) {
            (0, utils_1.handleApiError)(error, 'Failed to register student');
        }
    }
    async linkStudentByEmail(guardianId, studentEmail) {
        try {
            const headers = (0, studentServiceClient_1.createGuardianHeaders)(guardianId);
            const lookupResponse = await studentServiceClient_1.StudentServiceAPI.lookupStudentByEmail(studentEmail, headers);
            const student = lookupResponse.data;
            if (!student) {
                throw libs_1.Errors.notFound('Student not found with this email');
            }
            const linkResponse = await studentServiceClient_1.StudentServiceAPI.linkStudent(student._id, headers);
            return linkResponse.data;
        }
        catch (error) {
            (0, utils_1.handleApiError)(error, 'Failed to link student');
        }
    }
    async unlinkStudent(guardianId, studentId) {
        try {
            const headers = (0, studentServiceClient_1.createGuardianHeaders)(guardianId);
            const ownershipResponse = await studentServiceClient_1.StudentServiceAPI.verifyOwnership(studentId, headers);
            if (!ownershipResponse.data.isOwner) {
                throw libs_1.Errors.forbidden('Student does not belong to this guardian');
            }
            const response = await studentServiceClient_1.StudentServiceAPI.unlinkStudent(studentId, headers);
            return response.data;
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('does not belong')) {
                throw error;
            }
            (0, utils_1.handleApiError)(error, 'Failed to unlink student');
        }
    }
    async getExercises(guardianId, params) {
        try {
            const headers = (0, studentServiceClient_1.createGuardianHeaders)(guardianId);
            const response = await studentServiceClient_1.StudentServiceAPI.getExercises(params, headers);
            return response.data;
        }
        catch (error) {
            (0, utils_1.handleApiError)(error, 'Failed to fetch exercises');
        }
    }
    async createAssignment(guardianId, studentId, exerciseId, dueDate) {
        try {
            const headers = (0, studentServiceClient_1.createGuardianHeaders)(guardianId);
            const ownershipResponse = await studentServiceClient_1.StudentServiceAPI.verifyOwnership(studentId, headers);
            if (!ownershipResponse.data.isOwner) {
                throw libs_1.Errors.forbidden('Student does not belong to this guardian');
            }
            const response = await studentServiceClient_1.StudentServiceAPI.createAssignment({ studentId, exerciseId, dueDate }, headers);
            return response.data;
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('does not belong')) {
                throw error;
            }
            (0, utils_1.handleApiError)(error, 'Failed to create assignment');
        }
    }
    async createGoal(guardianId, data) {
        try {
            const headers = (0, studentServiceClient_1.createGuardianHeaders)(guardianId);
            const ownershipResponse = await studentServiceClient_1.StudentServiceAPI.verifyOwnership(data.studentId, headers);
            if (!ownershipResponse.data.isOwner) {
                throw libs_1.Errors.forbidden('Student does not belong to this guardian');
            }
            const goalData = {
                ...data,
                createdBy: 'parent',
            };
            const response = await studentServiceClient_1.StudentServiceAPI.createGoal(goalData, headers);
            return response.data;
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('does not belong')) {
                throw error;
            }
            (0, utils_1.handleApiError)(error, 'Failed to create goal');
        }
    }
    async getStudentGoals(guardianId, studentId, params) {
        try {
            const headers = (0, studentServiceClient_1.createGuardianHeaders)(guardianId);
            const ownershipResponse = await studentServiceClient_1.StudentServiceAPI.verifyOwnership(studentId, headers);
            if (!ownershipResponse.data.isOwner) {
                throw libs_1.Errors.forbidden('Student does not belong to this guardian');
            }
            const response = await studentServiceClient_1.StudentServiceAPI.getGoalsByStudent(studentId, params || {}, headers);
            return response.data;
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('does not belong')) {
                throw error;
            }
            (0, utils_1.handleApiError)(error, 'Failed to fetch goals');
        }
    }
    async updateDiagnosticSetting(guardianId, studentId, enabled) {
        try {
            const headers = (0, studentServiceClient_1.createGuardianHeaders)(guardianId);
            const ownershipResponse = await studentServiceClient_1.StudentServiceAPI.verifyOwnership(studentId, headers);
            if (!ownershipResponse.data.isOwner) {
                throw libs_1.Errors.forbidden('Student does not belong to this guardian');
            }
            const response = await studentServiceClient_1.StudentServiceAPI.updateStudent(studentId, { diagnosticEnabled: enabled }, headers);
            return response.data;
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('does not belong')) {
                throw error;
            }
            (0, utils_1.handleApiError)(error, 'Failed to update diagnostic setting');
        }
    }
}
exports.default = new GuardianService();
//# sourceMappingURL=guardianService.js.map