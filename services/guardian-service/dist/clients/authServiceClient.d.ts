import { AxiosInstance } from 'axios';
export declare const authServiceClient: AxiosInstance;
export declare const AuthServiceAPI: {
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
    }) => Promise<import("axios").AxiosResponse<any, any, {}>>;
};
export default AuthServiceAPI;
//# sourceMappingURL=authServiceClient.d.ts.map