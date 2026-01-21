import { Request, Response, NextFunction } from 'express';
declare class AttemptController {
    getAttempts(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAttempt(req: Request, res: Response, next: NextFunction): Promise<void>;
    startAttempt(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateAnswers(req: Request, res: Response, next: NextFunction): Promise<void>;
    completeAttempt(req: Request, res: Response, next: NextFunction): Promise<void>;
    abandonAttempt(req: Request, res: Response, next: NextFunction): Promise<void>;
    getAttemptHistory(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: AttemptController;
export default _default;
//# sourceMappingURL=AttemptController.d.ts.map