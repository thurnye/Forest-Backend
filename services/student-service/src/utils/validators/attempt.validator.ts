import Joi from 'joi';

export const startAttemptSchema = Joi.object({
  studentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  exerciseId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const updateAnswersSchema = Joi.object({
  answers: Joi.object().pattern(Joi.string(), Joi.string()).required(),
});

export const completeAttemptSchema = Joi.object({
  answers: Joi.object().pattern(Joi.string(), Joi.string()).required(),
  timeSpent: Joi.number().integer().min(0).required(),
});

export const attemptQuerySchema = Joi.object({
  exerciseId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  status: Joi.string().valid('in-progress', 'completed', 'abandoned'),
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

export const historyParamSchema = Joi.object({
  studentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  exerciseId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});
