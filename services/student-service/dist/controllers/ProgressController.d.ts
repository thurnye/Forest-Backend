import { Request, Response, NextFunction } from 'express';
declare class ProgressController {
    createInitialProgress(req: Request, res: Response, next: NextFunction): Promise<void>;
    getProgress(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateProgress(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateStreak(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: ProgressController;
export default _default;
//# sourceMappingURL=ProgressController.d.ts.map