import { Response, NextFunction } from 'express';
import { GuardianRequest } from '../middleware/guardianAuth';
declare class GuardianController {
    getStudents(req: GuardianRequest, res: Response, next: NextFunction): Promise<void>;
    getStudentDetail(req: GuardianRequest, res: Response, next: NextFunction): Promise<void>;
    registerStudent(req: GuardianRequest, res: Response, next: NextFunction): Promise<void>;
    linkStudent(req: GuardianRequest, res: Response, next: NextFunction): Promise<void>;
    unlinkStudent(req: GuardianRequest, res: Response, next: NextFunction): Promise<void>;
    getExercises(req: GuardianRequest, res: Response, next: NextFunction): Promise<void>;
    createAssignment(req: GuardianRequest, res: Response, next: NextFunction): Promise<void>;
    createGoal(req: GuardianRequest, res: Response, next: NextFunction): Promise<void>;
    getStudentGoals(req: GuardianRequest, res: Response, next: NextFunction): Promise<void>;
    updateDiagnostic(req: GuardianRequest, res: Response, next: NextFunction): Promise<void>;
}
declare const _default: GuardianController;
export default _default;
//# sourceMappingURL=guardianController.d.ts.map