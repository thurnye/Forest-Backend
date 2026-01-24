import { Request, Response, NextFunction } from 'express';
declare class StudentController {
    getStudentDetail(req: Request, res: Response, next: NextFunction): Promise<void>;
    getStudentsByGuardian(req: Request, res: Response, next: NextFunction): Promise<void>;
    createStudent(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateStudent(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteStudent(req: Request, res: Response, next: NextFunction): Promise<void>;
    lookupByEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
    unlinkFromGuardian(req: Request, res: Response, next: NextFunction): Promise<void>;
    linkToGuardian(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyOwnership(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: StudentController;
export default _default;
//# sourceMappingURL=StudentController.d.ts.map