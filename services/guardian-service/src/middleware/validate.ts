import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { fail } from '@readingForest/libs';

/**
 * Validate request body
 */
export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      fail(res, errorMessage, 422);
      return;
    }

    req.body = value;
    next();
  };
};

/**
 * Validate request params
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      fail(res, errorMessage, 400);
      return;
    }

    req.params = value;
    next();
  };
};

/**
 * Validate request query
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      fail(res, errorMessage, 400);
      return;
    }

    req.query = value;
    next();
  };
};
