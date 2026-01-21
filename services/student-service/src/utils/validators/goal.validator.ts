import Joi from 'joi';

export const createGoalSchema = Joi.object({
  studentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  title: Joi.string().required().trim(),
  description: Joi.string(),
  type: Joi.string().valid('exercises', 'time', 'streak', 'score', 'level').required(),
  targetValue: Joi.number().required(),
  unit: Joi.string().required(),
  deadline: Joi.date().required(),
  createdBy: Joi.string().valid('student', 'parent', 'teacher', 'system'),
});

export const updateGoalSchema = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string(),
  targetValue: Joi.number(),
  currentValue: Joi.number(),
  deadline: Joi.date(),
  status: Joi.string().valid('active', 'completed', 'expired', 'cancelled'),
}).min(1);

export const updateGoalProgressSchema = Joi.object({
  currentValue: Joi.number().required(),
});

export const goalQuerySchema = Joi.object({
  status: Joi.string().valid('active', 'completed', 'expired', 'cancelled'),
  limit: Joi.number().integer().min(1).max(100),
  skip: Joi.number().integer().min(0),
});

export const objectIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const studentIdParamSchema = Joi.object({
  studentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});
