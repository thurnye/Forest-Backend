import Joi from 'joi';

export const createAssignmentSchema = Joi.object({
  studentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  exerciseId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
  dueDate: Joi.date(),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'in-progress', 'completed').required(),
});

export const assignmentQuerySchema = Joi.object({
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
