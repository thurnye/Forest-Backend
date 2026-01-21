import { Request, Response, NextFunction } from 'express';
export interface GuardianRequest extends Request {
    guardianId: string;
    guardianRole: string;
}
export declare const guardianAuth: (req: Request, res: Response, next: NextFunction) => void;
export default guardianAuth;
//# sourceMappingURL=guardianAuth.d.ts.map