import { Request, Response, NextFunction } from 'express';
declare class ExerciseController {
    getExercises(req: Request, res: Response, next: NextFunction): Promise<void>;
    getExercise(req: Request, res: Response, next: NextFunction): Promise<void>;
    getExerciseFull(req: Request, res: Response, next: NextFunction): Promise<void>;
    createExercise(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateExercise(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteExercise(req: Request, res: Response, next: NextFunction): Promise<void>;
    getExerciseCount(req: Request, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: ExerciseController;
export default _default;
//# sourceMappingURL=ExerciseController.d.ts.map