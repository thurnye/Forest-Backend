import { Request, Response, NextFunction } from 'express';
declare class GoalController {
    getGoals(req: Request, res: Response, next: NextFunction): Promise<void>;
    getGoal(req: Request, res: Response, next: NextFunction): Promise<void>;
    createGoal(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateGoal(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateGoalProgress(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelGoal(req: Request, res: Response, next: NextFunction): Promise<void>;
    getActiveGoalsCount(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: GoalController;
export default _default;
//# sourceMappingURL=GoalController.d.ts.map