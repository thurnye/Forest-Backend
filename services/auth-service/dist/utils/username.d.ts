type EnsureUsernameOpts = {
    preferredUsername?: string | null;
    excludeStudentId?: string;
    firstName?: string;
    lastName?: string;
    maxAttempts?: number;
};
export declare function generateUniqueUsername(opts: EnsureUsernameOpts): Promise<string>;
export declare function resolveUsernameOnGuardianTransfer(params: {
    studentId: string;
    currentUsername: string;
    firstName?: string;
    lastName?: string;
}): Promise<string>;
export {};
//# sourceMappingURL=username.d.ts.map