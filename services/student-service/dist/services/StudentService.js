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
        const result = await models_1.Student.aggregate([
            {
                $match: { _id: new mongoose_1.default.Types.ObjectId(studentId) },
            },
            {
                $lookup: {
                    from: 'studentprogresses',
                    localField: '_id',
                    foreignField: 'studentId',
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
        const students = await models_1.Student.aggregate([
            {
                $match: {
                    guardianId: new mongoose_1.default.Types.ObjectId(guardianId),
                    isActive: true,
                },
            },
            {
                $lookup: {
                    from: 'studentprogresses',
                    localField: '_id',
                    foreignField: 'studentId',
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
                $sort: { 'progress.lastActivityAt': -1, createdAt: -1 },
            },
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
                        exercisesCompleted: {
                            $ifNull: ['$progress.exercisesCompleted', 0],
                        },
                        averageScore: { $ifNull: ['$progress.averageScore', 0] },
                        streakDays: { $ifNull: ['$progress.streakDays', 0] },
                        lastActivityAt: '$progress.lastActivityAt',
                    },
                },
            },
        ]);
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
        const student = await models_1.Student.findOne({
            _id: new mongoose_1.default.Types.ObjectId(studentId),
            guardianId: new mongoose_1.default.Types.ObjectId(guardianId),
        });
        if (!student) {
            throw libs_1.Errors.notFound('Student not found or does not belong to this guardian');
        }
        student.guardianId = null;
        await student.save();
        return student;
    }
    async linkToGuardian(studentId, guardianId) {
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
        const student = await models_1.Student.findOne({
            _id: new mongoose_1.default.Types.ObjectId(studentId),
            guardianId: new mongoose_1.default.Types.ObjectId(guardianId),
            isActive: true,
        });
        return !!student;
    }
}
exports.default = new StudentService();
//# sourceMappingURL=StudentService.js.map