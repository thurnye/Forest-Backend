import { TokenPayload } from '@readingForest/libs';
export declare const generateTokens: (userId: string, email: string, username?: string, role?: string) => {
    accessToken: string;
    refreshToken: string;
};
export declare const verifyAccess: (token: string) => TokenPayload;
export declare const verifyRefresh: (token: string) => TokenPayload;
//# sourceMappingURL=token.d.ts.map