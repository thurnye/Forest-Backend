import Joi from 'joi';

export const createAssessmentSchema = Joi.object({
  studentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  type: Joi.string().valid('diagnostic', 'placement', 'progress', 'mastery').required(),
});

const resultSchema = Joi.object({
  skillStrand: Joi.string().required(),
  score: Joi.number().min(0).max(100).required(),
  level: Joi.string().required(),
});

export const completeAssessmentSchema = Joi.object({
  results: Joi.array().items(resultSchema).min(1).required(),
  overallScore: Joi.number().min(0).max(100).required(),
  determinedLevel: Joi.string().required(),
  recommendations: Joi.array().items(Joi.string()),
  timeSpent: Joi.number().integer().min(0).required(),
});

export const assessmentQuerySchema = Joi.object({
  type: Joi.string().valid('diagnostic', 'placement', 'progress', 'mastery'),
  status: Joi.string().valid('pending', 'in-progress', 'completed'),
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
