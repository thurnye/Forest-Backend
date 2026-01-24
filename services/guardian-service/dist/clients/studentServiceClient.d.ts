import { AxiosInstance } from 'axios';
export declare const studentServiceClient: AxiosInstance;
export declare const createGuardianHeaders: (guardianId: string, role?: string) => {
    'x-user-id': string;
    'x-user-role': string;
};
export declare const StudentServiceAPI: {
    getStudentsByGuardian: (guardianId: string, headers: Record<string, string>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getStudentDetail: (studentId: string, headers: Record<string, string>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    createStudent: (data: Record<string, unknown>, headers: Record<string, string>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    updateStudent: (studentId: string, data: Record<string, unknown>, headers: Record<string, string>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    lookupStudentByEmail: (email: string, headers: Record<string, string>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    linkStudent: (studentId: string, headers: Record<string, string>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    unlinkStudent: (studentId: string, headers: Record<string, string>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    verifyOwnership: (studentId: string, headers: Record<string, string>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getExercises: (params: Record<string, unknown>, headers: Record<string, string>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    createGoal: (data: Record<string, unknown>, headers: Record<string, string>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getGoalsByStudent: (studentId: string, params: Record<string, unknown>, headers: Record<string, string>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    createAssignment: (data: Record<string, unknown>, headers: Record<string, string>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    getAssignmentsByStudent: (studentId: string, params: Record<string, unknown>, headers: Record<string, string>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
    createInitialProgress: (studentId: string, headers: Record<string, string>) => Promise<import("axios").AxiosResponse<any, any, {}>>;
};
export default StudentServiceAPI;
//# sourceMappingURL=studentServiceClient.d.ts.map