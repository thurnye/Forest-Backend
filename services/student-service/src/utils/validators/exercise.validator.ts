import Joi from 'joi';

const questionSchema = Joi.object({
  questionText: Joi.string().required(),
  questionType: Joi.string()
    .valid('multiple-choice', 'fill-blank', 'drag-drop', 'audio', 'matching')
    .required(),
  options: Joi.array().items(Joi.string()),
  correctAnswer: Joi.string().required(),
  points: Joi.number().integer().min(1),
  explanation: Joi.string(),
});

export const createExerciseSchema = Joi.object({
  title: Joi.string().required().trim(),
  description: Joi.string(),
  type: Joi.string()
    .valid(
      'phonics',
      'vocabulary',
      'comprehension',
      'fluency',
      'spelling',
      'grammar',
      'writing',
    )
    .required(),
  readingLevel: Joi.string()
    .valid('pre-k', 'k', '1', '2', '3', '4', '5', '6', '7', '8')
    .required(),
  skillStrand: Joi.string().required(),
  estimatedTime: Joi.number().integer().min(1),
  points: Joi.number().integer().min(1),
  order: Joi.number().integer(),
  questions: Joi.array().items(questionSchema).min(1).required(),
  tags: Joi.array().items(Joi.string()),
  prerequisites: Joi.array().items(Joi.string()),
});

export const updateExerciseSchema = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string(),
  type: Joi.string().valid(
    'phonics',
    'vocabulary',
    'comprehension',
    'fluency',
    'spelling',
    'grammar',
    'writing',
  ),
  readingLevel: Joi.string().valid('pre-k', 'k', '1', '2', '3', '4', '5', '6', '7', '8'),
  skillStrand: Joi.string(),
  estimatedTime: Joi.number().integer().min(1),
  points: Joi.number().integer().min(1),
  order: Joi.number().integer(),
  questions: Joi.array().items(questionSchema).min(1),
  tags: Joi.array().items(Joi.string()),
  prerequisites: Joi.array().items(Joi.string()),
  isActive: Joi.boolean(),
}).min(1);

export const exerciseQuerySchema = Joi.object({
  readingLevel: Joi.string()
    .valid('pre-k', 'k', '1', '2', '3', '4', '5', '6', '7', '8')
    .required(),
  skillStrand: Joi.string(),
  type: Joi.string(),
  limit: Joi.number().integer().min(1).max(100),
  skip: Joi.number().integer().min(0),
});

export const objectIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const readingLevelParamSchema = Joi.object({
  readingLevel: Joi.string()
    .valid('pre-k', 'k', '1', '2', '3', '4', '5', '6', '7', '8')
    .required(),
});
