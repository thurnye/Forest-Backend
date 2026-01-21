import Joi from 'joi';

export const createStudentSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  password: Joi.string().min(6),
  targetGradeLevel: Joi.string(),
  diagnosticEnabled: Joi.boolean().default(true),
});

export const linkStudentSchema = Joi.object({
  studentEmail: Joi.string().email().required(),
});

export const createAssignmentSchema = Joi.object({
  exerciseId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  dueDate: Joi.date(),
});

export const createGoalSchema = Joi.object({
  studentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  title: Joi.string().required().trim(),
  description: Joi.string().trim(),
  type: Joi.string().valid('exercises', 'time', 'streak', 'score', 'level').required(),
  targetValue: Joi.number().required(),
  unit: Joi.string().required(),
  deadline: Joi.date().required(),
});

export const updateDiagnosticSchema = Joi.object({
  enabled: Joi.boolean().required(),
});

export const exerciseQuerySchema = Joi.object({
  readingLevel: Joi.string(),
  skillStrand: Joi.string(),
  type: Joi.string(),
  limit: Joi.number().integer().min(1).max(100),
  skip: Joi.number().integer().min(0),
});

export const goalQuerySchema = Joi.object({
  status: Joi.string().valid('active', 'completed', 'expired', 'cancelled'),
  limit: Joi.number().integer().min(1).max(100),
  skip: Joi.number().integer().min(0),
});

export const studentIdParamSchema = Joi.object({
  studentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});
