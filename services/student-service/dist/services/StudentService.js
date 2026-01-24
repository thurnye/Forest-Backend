"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../db/models");
const libs_1 = require("@readingForest/libs");
class StudentService {
    async getStudentDetail(studentId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(studentId)) {
            throw libs_1.Errors.badRequest('Invalid studentId');
        }
        const result = await models_1.Student.aggregate([
            {
                $match: { _id: new mongoose_1.default.Types.ObjectId(studentId) },
            },
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
            throw libs_1.Errors.notFound('Student not found');
        }
        return result[0];
    }
    async getStudentsByGuardianId(guardianId) {
        const guardianObjectId = mongoose_1.default.Types.ObjectId.isValid(guardianId)
            ? new mongoose_1.default.Types.ObjectId(guardianId)
            : null;
        const guardianMatch = guardianObjectId
            ? { $or: [{ guardianId: guardianObjectId }, { guardianId }] }
            : { guardianId };
        console.log('[StudentService] getStudentsByGuardianId called with:', guardianId);
        console.log('[StudentService] Converted to ObjectId:', guardianObjectId);
        const debugQuery = guardianObjectId
            ? { $or: [{ guardianId: guardianObjectId }, { guardianId }] }
            : { guardianId };
        const debugStudents = await models_1.Student.find(debugQuery).lean();
        console.log('[StudentService] Debug find result count:', debugStudents.length);
        console.log('[StudentService] Debug students:', debugStudents.map((s) => ({
            _id: s._id,
            firstName: s.firstName,
            guardianId: s.guardianId,
            guardianIdType: typeof s.guardianId,
            isActive: s.isActive,
        })));
        const students = await models_1.Student.aggregate([
            {
                $match: {
                    $and: [
                        guardianMatch,
                        { $or: [{ isActive: true }, { isActive: { $exists: false } }] },
                    ],
                },
            },
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
            {
                $addFields: {
                    _lastActivityAt: {
                        $ifNull: ['$progress.lastActivityAt', new Date(0)],
                    },
                },
            },
            { $sort: { _lastActivityAt: -1, createdAt: -1 } },
            { $unset: '_lastActivityAt' },
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
        console.log('[StudentService] getStudentsByGuardianId found students count:', students.length);
        return students;
    }
    async getStudentById(studentId) {
        const student = await models_1.Student.findById(studentId);
        if (!student) {
            throw libs_1.Errors.notFound('Student not found');
        }
        return student;
    }
    async createStudent(data) {
        if (!mongoose_1.default.Types.ObjectId.isValid(data.guardianId)) {
            throw libs_1.Errors.badRequest('Invalid guardianId');
        }
        const student = await models_1.Student.create({
            ...data,
            guardianId: new mongoose_1.default.Types.ObjectId(data.guardianId),
        });
        await models_1.StudentProgress.create({
            studentId: student._id,
        });
        return student;
    }
    async updateStudent(studentId, data) {
        const student = await models_1.Student.findByIdAndUpdate(studentId, data, {
            new: true,
        });
        if (!student) {
            throw libs_1.Errors.notFound('Student not found');
        }
        return student;
    }
    async deleteStudent(studentId) {
        const student = await models_1.Student.findByIdAndUpdate(studentId, { isActive: false }, { new: true });
        if (!student) {
            throw libs_1.Errors.notFound('Student not found');
        }
        return student;
    }
    async getStudentByEmail(email) {
        const student = await models_1.Student.findOne({
            email: email.toLowerCase(),
            isActive: true,
        });
        return student;
    }
    async unlinkFromGuardian(studentId, guardianId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(studentId)) {
            throw libs_1.Errors.badRequest('Invalid studentId');
        }
        const guardianObjectId = mongoose_1.default.Types.ObjectId.isValid(guardianId)
            ? new mongoose_1.default.Types.ObjectId(guardianId)
            : null;
        const guardianMatch = guardianObjectId
            ? { $or: [{ guardianId: guardianObjectId }, { guardianId }] }
            : { guardianId };
        const student = await models_1.Student.findOne({
            _id: new mongoose_1.default.Types.ObjectId(studentId),
            ...guardianMatch,
        });
        if (!student) {
            throw libs_1.Errors.notFound('Student not found or does not belong to this guardian');
        }
        student.guardianId = null;
        await student.save();
        return student;
    }
    async linkToGuardian(studentId, guardianId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(guardianId)) {
            throw libs_1.Errors.badRequest('Invalid guardianId');
        }
        const student = await models_1.Student.findById(studentId);
        if (!student) {
            throw libs_1.Errors.notFound('Student not found');
        }
        if (student.guardianId) {
            throw libs_1.Errors.conflict('Student is already linked to a guardian');
        }
        student.guardianId = new mongoose_1.default.Types.ObjectId(guardianId);
        await student.save();
        return student;
    }
    async verifyStudentOwnership(studentId, guardianId) {
        if (!mongoose_1.default.Types.ObjectId.isValid(studentId)) {
            return false;
        }
        const guardianObjectId = mongoose_1.default.Types.ObjectId.isValid(guardianId)
            ? new mongoose_1.default.Types.ObjectId(guardianId)
            : null;
        const guardianMatch = guardianObjectId
            ? { $or: [{ guardianId: guardianObjectId }, { guardianId }] }
            : { guardianId };
        const student = await models_1.Student.findOne({
            _id: new mongoose_1.default.Types.ObjectId(studentId),
            ...guardianMatch,
            isActive: true,
        });
        return !!student;
    }
}
exports.default = new StudentService();
//# sourceMappingURL=StudentService.js.map