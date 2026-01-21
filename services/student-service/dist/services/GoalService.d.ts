import mongoose from 'mongoose';
declare class GoalService {
    getGoalsByStudentId(studentId: string, options?: {
        status?: string;
        limit?: number;
        skip?: number;
    }): Promise<(mongoose.Document<unknown, {}, import("../db/models").IGoal, {}, {}> & import("../db/models").IGoal & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getGoalById(goalId: string): Promise<mongoose.Document<unknown, {}, import("../db/models").IGoal, {}, {}> & import("../db/models").IGoal & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    createGoal(data: {
        studentId: string;
        title: string;
        description?: string;
        type: 'exercises' | 'time' | 'streak' | 'score' | 'level';
        targetValue: number;
        unit: string;
        deadline: Date;
        createdBy?: 'student' | 'parent' | 'teacher' | 'system';
    }): Promise<mongoose.Document<unknown, {}, import("../db/models").IGoal, {}, {}> & import("../db/models").IGoal & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateGoal(goalId: string, data: Partial<{
        title: string;
        description: string;
        targetValue: number;
        currentValue: number;
        deadline: Date;
        status: 'active' | 'completed' | 'expired' | 'cancelled';
    }>): Promise<mongoose.Document<unknown, {}, import("../db/models").IGoal, {}, {}> & import("../db/models").IGoal & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateGoalProgress(goalId: string, currentValue: number): Promise<mongoose.Document<unknown, {}, import("../db/models").IGoal, {}, {}> & import("../db/models").IGoal & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    cancelGoal(goalId: string): Promise<mongoose.Document<unknown, {}, import("../db/models").IGoal, {}, {}> & import("../db/models").IGoal & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getActiveGoalsCount(studentId: string): Promise<number>;
    checkExpiredGoals(): Promise<number>;
}
declare const _default: GoalService;
export default _default;
//# sourceMappingURL=GoalService.d.ts.map