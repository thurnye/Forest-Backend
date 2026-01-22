import { Request, Response, NextFunction } from 'express';
import Guardian from '../db/Guardian';
import {
  hashPassword,
  comparePassword,
  generateToken,
} from '../domain/password';
import { generateTokens, verifyRefresh } from '../domain/token';
import { success, fail, logger } from '@readingForest/libs';

/**
 * Register new guardian
 */
export const register = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const { email, password, firstName, lastName, guardianName } = req.body;

    // Check if guardian already exists
    const existingGuardian = await Guardian.findOne({ email });
    if (existingGuardian) {
      fail(res, 'Guardian with this email already exists', 409);
      return;
    }

    // Check if guardianName is taken
    if (guardianName) {
      const existingGuardianname = await Guardian.findOne({ guardianName });
      if (existingGuardianname) {
        fail(res, 'Guardianname is already taken', 409);
        return;
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate email verification token
    const emailVerificationToken = generateToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create guardian
    const guardian = await Guardian.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      guardianName,
      emailVerificationToken,
      emailVerificationExpires,
    });

    logger.info('Guardian registered', {
      guardianId: guardian._id,
      email: guardian.email,
      _id: guardian._id,
    });

    // TODO: Send verification email

    success(
      res,
      {
        id: guardian._id,
        email: guardian.email,
        firstName: guardian.firstName,
        lastName: guardian.lastName,
        bio: guardian.bio,
        avatar: guardian.avatar,
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
 * Login guardian
 */
export const login = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    // console.log('Login attempt for email:', { email, password });

    // Find guardian with password field
    const guardian = await Guardian.findOne({ email }).select(
      '+password +refreshTokens',
    );
    if (!guardian) {
      fail(res, 'Invalid email or password', 401);
      return;
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, guardian.password);
    if (!isPasswordValid) {
      fail(res, 'Invalid email or password', 401);
      return;
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(
      guardian._id.toString(),
      guardian.email,
      guardian.role,
    );

    // Store refresh token in database
    guardian.refreshTokens.push(refreshToken);
    await guardian.save();

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Set access token in header
    res.setHeader('x-access-token', accessToken);

    logger.info('Guardian logged in', { guardianId: guardian._id, email: guardian.email });

    success(
      res,
      {
        id: guardian._id,
        email: guardian.email,
        firstName: guardian.firstName,
        lastName: guardian.lastName,
        bio: guardian.bio,
        avatar: guardian.avatar,
        role: guardian.role,
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

    // Find guardian and check if refresh token exists in database
    const guardian = await Guardian.findById(payload.userId).select('+refreshTokens');
    if (!guardian || !guardian.refreshTokens.includes(refreshToken)) {
      fail(res, 'Invalid refresh token', 401);
      return;
    }

    // Remove old refresh token
    guardian.refreshTokens = guardian.refreshTokens.filter(
      (token) => token !== refreshToken,
    );

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      guardian._id.toString(),
      guardian.email,
      guardian.role,
    );

    // Store new refresh token
    guardian.refreshTokens.push(newRefreshToken);
    await guardian.save();

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

    logger.info('Token refreshed', { guardianId: guardian._id });

    success(
      res,
      {
        id: guardian._id,
        email: guardian.email,
        firstName: guardian.firstName,
        lastName: guardian.lastName,
        bio: guardian.bio,
        avatar: guardian.avatar,
        role: guardian.role,
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
 * Logout guardian
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
      const guardian = await Guardian.findById(payload.userId).select('+refreshTokens');

      if (guardian) {
        guardian.refreshTokens = guardian.refreshTokens.filter(
          (token) => token !== refreshToken,
        );
        await guardian.save();
        logger.info('Guardian logged out', { guardianId: guardian._id });
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
 * Verify email
 */
export const verifyEmail = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const { token } = req.body;

    const guardian = await Guardian.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!guardian) {
      fail(res, 'Invalid or expired verification token', 400);
      return;
    }

    guardian.isEmailVerified = true;
    guardian.emailVerificationToken = undefined;
    guardian.emailVerificationExpires = undefined;
    await guardian.save();

    logger.info('Email verified', { guardianId: guardian._id, email: guardian.email });

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

    const guardian = await Guardian.findOne({ email }).select(
      '+emailVerificationToken',
    );

    if (!guardian) {
      // Don't reveal if guardian exists
      success(
        res,
        null,
        'If the email exists, a verification link has been sent',
      );
      return;
    }

    if (guardian.isEmailVerified) {
      fail(res, 'Email is already verified', 400);
      return;
    }

    // Generate new token
    const emailVerificationToken = generateToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    guardian.emailVerificationToken = emailVerificationToken;
    guardian.emailVerificationExpires = emailVerificationExpires;
    await guardian.save();

    logger.info('Verification email resent', {
      guardianId: guardian._id,
      email: guardian.email,
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

    const guardian = await Guardian.findOne({ email }).select('+passwordResetToken');

    if (!guardian) {
      // Don't reveal if guardian exists
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

    guardian.passwordResetToken = passwordResetToken;
    guardian.passwordResetExpires = passwordResetExpires;
    await guardian.save();

    logger.info('Password reset requested', {
      guardianId: guardian._id,
      email: guardian.email,
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

    const guardian = await Guardian.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    }).select('+password +passwordResetToken +passwordResetExpires');

    if (!guardian) {
      fail(res, 'Invalid or expired reset token', 400);
      return;
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    guardian.password = hashedPassword;
    guardian.passwordResetToken = undefined;
    guardian.passwordResetExpires = undefined;
    await guardian.save();

    logger.info('Password reset successful', {
      guardianId: guardian._id,
      email: guardian.email,
    });

    success(res, null, 'Password reset successful');
  } catch (error) {
    logger.error('Password reset error', { error });
    _next(error);
  }
};

/**
 * Change password (authenticated guardian)
 */
export const changePassword = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<void> => {
  try {
    const guardianId = req.headers['x-guardian-id'] as string;
    const { oldPassword, newPassword } = req.body;

    // console.log("CHANGE PASSWORD BODY:::", req.body)
    // console.log("CHANGE PASSWORD BODY guardianId:::", guardianId)

    if (!guardianId) {
      fail(res, 'Unauthorized', 401);
      return;
    }

    const guardian = await Guardian.findById(guardianId).select('+password');
    if (!guardian) {
      fail(res, 'Guardian not found', 404);
      return;
    }

    // Verify old password
    const isPasswordValid = await comparePassword(oldPassword, guardian.password);
    if (!isPasswordValid) {
      fail(res, 'Current password is incorrect', 401);
      return;
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    guardian.password = hashedPassword;
    await guardian.save();

    logger.info('Password changed', { guardianId: guardian._id, email: guardian.email });

    success(res, null, 'Password changed successfully');
  } catch (error) {
    logger.error('Password change error', { error });
    _next(error);
  }
};
