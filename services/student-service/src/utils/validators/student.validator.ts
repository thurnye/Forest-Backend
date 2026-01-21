import Joi from 'joi';

export const createStudentSchema = Joi.object({
  guardianId: Joi.string().required(),
  email: Joi.string().email().required(),
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  username: Joi.string().trim(),
  avatar: Joi.string(),
  dateOfBirth: Joi.date(),
  grade: Joi.string(),
  targetGradeLevel: Joi.string(),
  diagnosticEnabled: Joi.boolean(),
});

export const updateStudentSchema = Joi.object({
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
  username: Joi.string().trim(),
  avatar: Joi.string(),
  dateOfBirth: Joi.date(),
  grade: Joi.string(),
  readingLevel: Joi.string(),
  targetGradeLevel: Joi.string(),
  hasCompletedDiagnostic: Joi.boolean(),
  diagnosticEnabled: Joi.boolean(),
}).min(1);

export const objectIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const guardianIdSchema = Joi.object({
  guardianId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});
