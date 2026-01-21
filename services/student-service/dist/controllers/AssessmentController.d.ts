import { Request, Response, NextFunction } from 'express';
declare class AssessmentController {
    getAssessments(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    createAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    startAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    completeAssessment(req: Request, res: Response, next: NextFunction): Promise<void>;
    getLatestDiagnostic(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: AssessmentController;
export default _default;
//# sourceMappingURL=AssessmentController.d.ts.map