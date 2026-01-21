import { Request, Response, NextFunction } from 'express';
declare class AssignmentController {
    getAssignments(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAssignment(req: Request, res: Response, next: NextFunction): Promise<void>;
    createAssignment(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteAssignment(req: Request, res: Response, next: NextFunction): Promise<void>;
    getPendingCount(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: AssignmentController;
export default _default;
//# sourceMappingURL=AssignmentController.d.ts.map