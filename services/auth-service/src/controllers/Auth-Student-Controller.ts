import { Request, Response, NextFunction } from 'express';
import Student from '../db/Student';
import {
  hashPassword,
  comparePassword,
  generateToken,
} from '../domain/password';
import { generateTokens, verifyRefresh } from '../domain/token';
import { success, fail, logger } from '@readingForest/libs';

/**
 * Register new student
 */
export const register = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      studentName,
      targetGradeLevel,
      diagnosticEnabled,
    } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      fail(res, 'Student with this email already exists', 409);
      return;
    }

    // Check if studentName is taken
    if (studentName) {
      const existingStudentName = await Student.findOne({ studentName });
      if (existingStudentName) {
        fail(res, 'StudentName is already taken', 409);
        return;
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create student
    const student = await Student.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      studentName,
      targetGradeLevel,
      diagnosticEnabled,
    });

    logger.info('Student registered', {
      studentId: student._id,
      email: student.email,
      _id: student._id,
    });

    success(
      res,
      {
        id: student._id,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        bio: student.bio,
        avatar: student.avatar,
        role: student.role,
        readingLevel: student.readingLevel,
        targetGradeLevel: student.targetGradeLevel,
        hasCompletedDiagnostic: student.hasCompletedDiagnostic,
        diagnosticEnabled: student.diagnosticEnabled,
        guardian: student.guardian,
      },
      'Registration successful. Please check your email to verify your account.',
      undefined,
      201,
    );
  } catch (error) {
    logger.error('Registration error', { error });
    _next(error);
  }
};

/**
 * Login student
 */
export const login = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    // console.log('Login attempt for email:', { email, password });

    // Find student with password field
    const student = await Student.findOne({ email }).select(
      '+password +refreshTokens',
    );
    if (!student) {
      fail(res, 'Invalid email or password', 401);
      return;
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, student.password);
    if (!isPasswordValid) {
      fail(res, 'Invalid email or password', 401);
      return;
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      student._id.toString(),
      student.email,
      student.role,
    );

    // Store refresh token in database
    student.refreshTokens.push(refreshToken);
    await student.save();

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set access token in header
    res.setHeader('x-access-token', accessToken);

    logger.info('Student logged in', {
      studentId: student._id,
      email: student.email,
    });

    success(
      res,
      {
        id: student._id,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        bio: student.bio,
        avatar: student.avatar,
        role: student.role,
        readingLevel: student.readingLevel,
        targetGradeLevel: student.targetGradeLevel,
        hasCompletedDiagnostic: student.hasCompletedDiagnostic,
        diagnosticEnabled: student.diagnosticEnabled,
        guardian: student.guardian,
        accessToken,
      },
      'Login successful',
    );
  } catch (error) {
    logger.error('Login error', { error });
    _next(error);
  }
};

/**
 * Refresh access token
 */
export const refresh = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      fail(res, 'Refresh token not found', 401);
      return;
    }

    // Verify refresh token
    const payload = verifyRefresh(refreshToken);

    // Find student and check if refresh token exists in database
    const student = await Student.findById(payload.userId).select(
      '+refreshTokens',
    );
    if (!student || !student.refreshTokens.includes(refreshToken)) {
      fail(res, 'Invalid refresh token', 401);
      return;
    }

    // Remove old refresh token
    student.refreshTokens = student.refreshTokens.filter(
      (token) => token !== refreshToken,
    );

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      student._id.toString(),
      student.email,
      student.role,
    );

    // Store new refresh token
    student.refreshTokens.push(newRefreshToken);
    await student.save();

    // Update cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set access token in header
    res.setHeader('x-access-token', accessToken);

    logger.info('Token refreshed', { studentId: student._id });

    success(
      res,
      {
        id: student._id,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
        bio: student.bio,
        avatar: student.avatar,
        role: student.role,
        readingLevel: student.readingLevel,
        targetGradeLevel: student.targetGradeLevel,
        hasCompletedDiagnostic: student.hasCompletedDiagnostic,
        diagnosticEnabled: student.diagnosticEnabled,
        guardian: student.guardian,
        accessToken,
      },
      'Token refreshed successfully',
    );
  } catch (error) {
    logger.error('Token refresh error', { error });
    fail(res, 'Invalid or expired refresh token', 401);
  }
};

/**
 * Logout student
 */
export const logout = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Remove refresh token from database
      const payload = verifyRefresh(refreshToken);
      const student = await Student.findById(payload.userId).select(
        '+refreshTokens',
      );

      if (student) {
        student.refreshTokens = student.refreshTokens.filter(
          (token) => token !== refreshToken,
        );
        await student.save();
        logger.info('Student logged out', { studentId: student._id });
      }
    }

    // Clear cookie
    res.clearCookie('refreshToken');

    success(res, null, 'Logout successful');
  } catch (error) {
    logger.error('Logout error', { error });
    // Even if there's an error, clear the cookie
    res.clearCookie('refreshToken');
    success(res, null, 'Logout successful');
  }
};

/**
 * Verify email
 */
export const verifyEmail = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const { token } = req.body;

    const student = await Student.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!student) {
      fail(res, 'Invalid or expired verification token', 400);
      return;
    }

    student.isEmailVerified = true;
    student.emailVerificationToken = undefined;
    student.emailVerificationExpires = undefined;
    await student.save();

    logger.info('Email verified', {
      studentId: student._id,
      email: student.email,
    });

    success(res, null, 'Email verified successfully');
  } catch (error) {
    logger.error('Email verification error', { error });
    _next(error);
  }
};

/**
 * Resend verification email
 */
export const resendVerification = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;

    const student = await Student.findOne({ email }).select(
      '+emailVerificationToken',
    );

    if (!student) {
      // Don't reveal if student exists
      success(
        res,
        null,
        'If the email exists, a verification link has been sent',
      );
      return;
    }

    if (student.isEmailVerified) {
      fail(res, 'Email is already verified', 400);
      return;
    }

    // Generate new token
    const emailVerificationToken = generateToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    student.emailVerificationToken = emailVerificationToken;
    student.emailVerificationExpires = emailVerificationExpires;
    await student.save();

    logger.info('Verification email resent', {
      studentId: student._id,
      email: student.email,
    });

    // TODO: Send verification email

    success(res, null, 'Verification email sent');
  } catch (error) {
    logger.error('Resend verification error', { error });
    _next(error);
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.body;

    const student = await Student.findOne({ email }).select(
      '+passwordResetToken',
    );

    if (!student) {
      // Don't reveal if student exists
      success(
        res,
        null,
        'If the email exists, a password reset link has been sent',
      );
      return;
    }

    // Generate reset token
    const passwordResetToken = generateToken();
    const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    student.passwordResetToken = passwordResetToken;
    student.passwordResetExpires = passwordResetExpires;
    await student.save();

    logger.info('Password reset requested', {
      studentId: student._id,
      email: student.email,
    });

    // TODO: Send password reset email

    success(res, null, 'Password reset link sent to your email');
  } catch (error) {
    logger.error('Password reset request error', { error });
    _next(error);
  }
};

/**
 * Reset password
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    const student = await Student.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    }).select('+password +passwordResetToken +passwordResetExpires');

    if (!student) {
      fail(res, 'Invalid or expired reset token', 400);
      return;
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    student.password = hashedPassword;
    student.passwordResetToken = undefined;
    student.passwordResetExpires = undefined;
    await student.save();

    logger.info('Password reset successful', {
      studentId: student._id,
      email: student.email,
    });

    success(res, null, 'Password reset successful');
  } catch (error) {
    logger.error('Password reset error', { error });
    _next(error);
  }
};

/**
 * Change password (authenticated student)
 */
export const changePassword = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const studentId = req.headers['x-student-id'] as string;
    const { oldPassword, newPassword } = req.body;

    // console.log("CHANGE PASSWORD BODY:::", req.body)
    // console.log("CHANGE PASSWORD BODY studentId:::", studentId)

    if (!studentId) {
      fail(res, 'Unauthorized', 401);
      return;
    }

    const student = await Student.findById(studentId).select('+password');
    if (!student) {
      fail(res, 'Student not found', 404);
      return;
    }

    // Verify old password
    const isPasswordValid = await comparePassword(
      oldPassword,
      student.password,
    );
    if (!isPasswordValid) {
      fail(res, 'Current password is incorrect', 401);
      return;
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    student.password = hashedPassword;
    await student.save();

    logger.info('Password changed', {
      studentId: student._id,
      email: student.email,
    });

    success(res, null, 'Password changed successfully');
  } catch (error) {
    logger.error('Password change error', { error });
    _next(error);
  }
};
