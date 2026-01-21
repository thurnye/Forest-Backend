import mongoose from 'mongoose';
declare class AssignmentService {
    getAssignmentsByStudentId(studentId: string, options?: {
        status?: string;
        limit?: number;
        skip?: number;
    }): Promise<(mongoose.Document<unknown, {}, import("../db/models").IAssignment, {}, {}> & import("../db/models").IAssignment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getAssignmentById(assignmentId: string): Promise<mongoose.Document<unknown, {}, import("../db/models").IAssignment, {}, {}> & import("../db/models").IAssignment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createAssignment(data: {
        studentId: string;
        exerciseId: string;
        assignedBy: string;
        dueDate?: Date;
    }): Promise<mongoose.Document<unknown, {}, import("../db/models").IAssignment, {}, {}> & import("../db/models").IAssignment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateAssignmentStatus(assignmentId: string, status: 'pending' | 'in-progress' | 'completed'): Promise<mongoose.Document<unknown, {}, import("../db/models").IAssignment, {}, {}> & import("../db/models").IAssignment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteAssignment(assignmentId: string): Promise<mongoose.Document<unknown, {}, import("../db/models").IAssignment, {}, {}> & import("../db/models").IAssignment & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getPendingAssignmentsCount(studentId: string): Promise<number>;
}
declare const _default: AssignmentService;
export default _default;
//# sourceMappingURL=AssignmentService.d.ts.map