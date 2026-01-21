import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  requestPasswordReset,
  resetPassword,
  changePassword,
} from '../controllers/Auth-Student-Controller';
import { validate } from '@readingForest/libs';
import { registerStudentSchema, studentLoginSchema } from '../utils/validators';

const router = Router();

// POST /register - Register new user
router.post('/register', validate(registerStudentSchema), register);

// POST /login - Login user
router.post('/login', validate(studentLoginSchema), login);

// POST /refresh - Refresh access token
router.post('/refresh', refresh);

// POST /logout - Logout user
router.post('/logout', logout);

// POST /reset-request - Request password reset
router.post('/reset-request', requestPasswordReset);

// POST /reset-password - Reset password with token
router.post('/reset-password', resetPassword);

// POST /change-password - Change password (authenticated)
router.post('/change-password', changePassword);

export default router;
