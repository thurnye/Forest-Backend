import { Request, Response, NextFunction } from 'express';
import Student from '../db/Student';
import {
  hashPassword,
  comparePassword,
  generateToken,
} from '../domain/password';
import { generateTokens, verifyRefresh } from '../domain/token';
import { success, fail, logger } from '@readingForest/libs';
import { generateUniqueUsername } from '../utils/username';

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
      password,
      firstName,
      lastName,
      username,
      avatar,
      dateOfBirth,
      grade,
      targetGradeLevel,
      diagnosticEnabled,
      guardianId,
    } = req.body;

    console.log('✌️ Registering student with data:', req.body);

    // Check if student already exists
    if(username) {
      const existingStudent = await Student.findOne({ username });
      if (existingStudent) {
        fail(res, 'Student with this username already exists', 409);
        return;
      }
    }


    // Generate/normalize username unique to this guardian
    const finalUsername = await generateUniqueUsername({
      preferredUsername: username
    });

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create student
    const student = await Student.create({
      password: hashedPassword,
      firstName,
      lastName,
      username: finalUsername,
      avatar,
      dateOfBirth,
      grade,
      targetGradeLevel,
      diagnosticEnabled,
      guardianId,
    });

    logger.info('Student registered', {
      studentId: student._id,
      username: student.username,
      _id: student._id,
    });

    success(
      res,
      {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        username: student.username,
        avatar: student.avatar,
      },
      'Student registration successful',
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
    const { username, password } = req.body;
    // console.log('Login attempt for username:', { username, password });

    // Find student with password field
    const student = await Student.findOne({ username }).select(
      '+password +refreshTokens',
    );
    if (!student) {
      fail(res, 'Invalid username or password', 401);
      return;
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, student.password);
    if (!isPasswordValid) {
      fail(res, 'Invalid username or password', 401);
      return;
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      student._id.toString(),
      '',
      student.username,
    );

    // Store refresh token in database
    student.refreshTokens.push(refreshToken);
    await student.save();

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // 'lax' works for most cases including cross-origin POST
      path: '/', // Cookie available for all paths
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set access token in header
    res.setHeader('x-access-token', accessToken);

    logger.info('Student logged in', {
      studentId: student._id,
      username: student.username,
    });

    success(
      res,
      {
        id: student._id,
        username: student.username,
        firstName: student.firstName,
        lastName: student.lastName,
        avatar: student.avatar,
        readingLevel: student.readingLevel,
        targetGradeLevel: student.targetGradeLevel,
        hasCompletedDiagnostic: student.hasCompletedDiagnostic,
        diagnosticEnabled: student.diagnosticEnabled,
        guardianId: student.guardianId,
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
    console.log('[Refresh] Cookies received:', req.cookies);
    console.log('[Refresh] RefreshToken from cookie:', refreshToken ? 'present' : 'missing');

    if (!refreshToken) {
      fail(res, 'Refresh token not found', 401);
      return;
    }

    // Verify refresh token
    const payload = verifyRefresh(refreshToken);
    console.log('[Refresh] Token payload:', payload);

    // Find student and check if refresh token exists in database
    const student = await Student.findById(payload.userId).select(
      '+refreshTokens',
    );
    console.log('[Refresh] Student found:', student ? 'yes' : 'no');
    console.log('[Refresh] Stored tokens count:', student?.refreshTokens?.length || 0);
    console.log('[Refresh] Token in array:', student?.refreshTokens?.includes(refreshToken));

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
      '',
      student.username,
    );

    // Store new refresh token
    student.refreshTokens.push(newRefreshToken);
    await student.save();

    // Update cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set access token in header
    res.setHeader('x-access-token', accessToken);

    logger.info('Token refreshed', { studentId: student._id });

    success(
      res,
      {
        id: student._id,
        // username: student.username,
        username: student.username,
        firstName: student.firstName,
        lastName: student.lastName,
        avatar: student.avatar,
        readingLevel: student.readingLevel,
        targetGradeLevel: student.targetGradeLevel,
        hasCompletedDiagnostic: student.hasCompletedDiagnostic,
        diagnosticEnabled: student.diagnosticEnabled,
        guardianId: student.guardianId,
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
    res.clearCookie('refreshToken', { path: '/' });

    success(res, null, 'Logout successful');
  } catch (error) {
    logger.error('Logout error', { error });
    // Even if there's an error, clear the cookie
    res.clearCookie('refreshToken', { path: '/' });
    success(res, null, 'Logout successful');
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
    const { username } = req.body;

    const student = await Student.findOne({ username }).select(
      '+passwordResetToken',
    );

    if (!student) {
      // Don't reveal if student exists
      success(
        res,
        null,
        'If the username exists, a password reset link has been sent',
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
      username: student.username,
    });

    success(res, null, 'Password reset link sent to your username');
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
      username: student.username,
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
      username: student.username,
    });

    success(res, null, 'Password changed successfully');
  } catch (error) {
    logger.error('Password change error', { error });
    _next(error);
  }
};
