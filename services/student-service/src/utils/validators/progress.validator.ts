import Joi from 'joi';

export const updateProgressSchema = Joi.object({
  currentLevel: Joi.string(),
  exercisesCompleted: Joi.number().integer().min(0),
  totalExercises: Joi.number().integer().min(0),
  averageScore: Joi.number().min(0).max(100),
  streakDays: Joi.number().integer().min(0),
  lastActivityAt: Joi.date(),
}).min(1);

export const studentIdParamSchema = Joi.object({
  studentId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});
