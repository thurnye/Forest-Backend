import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
export declare const validateBody: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateParams: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => void;
export declare const validateQuery: (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.d.ts.map