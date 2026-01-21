import Joi from 'joi';
import { commonSchemas } from '@readingForest/libs';

/**
 * Registration validation schema
 */
export const registerGuardianSchema = Joi.object({
  email: commonSchemas.email,
  password: commonSchemas.password,
  firstName: Joi.string().optional().trim(),
  lastName: Joi.string().optional().trim(),
  username: Joi.string().alphanum().min(3).max(30).optional().trim(),
});

export const registerStudentSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional().trim(),
  password: commonSchemas.password,
  firstName: Joi.string().optional().trim(),
  lastName: Joi.string().optional().trim(),
  targetGradeLevel: Joi.string().trim().required(),
  diagnosticEnabled: Joi.boolean().optional(),
  guardianId: Joi.string().required().trim(),
});

/**
 * Login validation schema
 */
export const GuardianLoginSchema = Joi.object({
  email: commonSchemas.email,
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

export const studentLoginSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

/**
 * Password change validation schema
 */
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    'any.required': 'Current password is required',
  }),
  newPassword: commonSchemas.password,
});

/**
 * Password reset request validation schema
 */
export const resetRequestSchema = Joi.object({
  email: commonSchemas.email,
});

/**
 * Password reset validation schema
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Reset token is required',
  }),
  newPassword: commonSchemas.password,
});

/**
 * Email verification schema
 */
export const verifyEmailSchema = Joi.object({
  token: Joi.string().required().messages({
    'any.required': 'Verification token is required',
  }),
});
