import mongoose from 'mongoose';
declare class StudentService {
    getStudentDetail(studentId: string): Promise<any>;
    getStudentsByGuardianId(guardianId: string): Promise<any[]>;
    getStudentById(studentId: string): Promise<mongoose.Document<unknown, {}, import("../db/models").IStudent, {}, {}> & import("../db/models").IStudent & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createStudent(data: {
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
    }): Promise<mongoose.Document<unknown, {}, import("../db/models").IStudent, {}, {}> & import("../db/models").IStudent & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateStudent(studentId: string, data: Partial<{
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
    }>): Promise<mongoose.Document<unknown, {}, import("../db/models").IStudent, {}, {}> & import("../db/models").IStudent & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteStudent(studentId: string): Promise<mongoose.Document<unknown, {}, import("../db/models").IStudent, {}, {}> & import("../db/models").IStudent & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getStudentByEmail(email: string): Promise<(mongoose.Document<unknown, {}, import("../db/models").IStudent, {}, {}> & import("../db/models").IStudent & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    unlinkFromGuardian(studentId: string, guardianId: string): Promise<mongoose.Document<unknown, {}, import("../db/models").IStudent, {}, {}> & import("../db/models").IStudent & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    linkToGuardian(studentId: string, guardianId: string): Promise<mongoose.Document<unknown, {}, import("../db/models").IStudent, {}, {}> & import("../db/models").IStudent & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    verifyStudentOwnership(studentId: string, guardianId: string): Promise<boolean>;
}
declare const _default: StudentService;
export default _default;
//# sourceMappingURL=StudentService.d.ts.map