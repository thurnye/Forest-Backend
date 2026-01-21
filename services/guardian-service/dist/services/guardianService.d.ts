declare class GuardianService {
    getStudents(guardianId: string): Promise<any>;
    getStudentDetail(guardianId: string, studentId: string): Promise<any>;
    createStudent(guardianId: string, data: {
        email: string;
        firstName: string;
        lastName: string;
        targetGradeLevel?: string;
        diagnosticEnabled?: boolean;
    }): Promise<any>;
    linkStudentByEmail(guardianId: string, studentEmail: string): Promise<any>;
    unlinkStudent(guardianId: string, studentId: string): Promise<any>;
    getExercises(guardianId: string, params: {
        readingLevel?: string;
        skillStrand?: string;
        type?: string;
        limit?: number;
        skip?: number;
    }): Promise<any>;
    createAssignment(guardianId: string, studentId: string, exerciseId: string, dueDate?: Date): Promise<any>;
    createGoal(guardianId: string, data: {
        studentId: string;
        title: string;
        description?: string;
        type: string;
        targetValue: number;
        unit: string;
        deadline: Date;
    }): Promise<any>;
    getStudentGoals(guardianId: string, studentId: string, params?: {
        status?: string;
        limit?: number;
        skip?: number;
    }): Promise<any>;
    updateDiagnosticSetting(guardianId: string, studentId: string, enabled: boolean): Promise<any>;
}
declare const _default: GuardianService;
export default _default;
//# sourceMappingURL=guardianService.d.ts.map