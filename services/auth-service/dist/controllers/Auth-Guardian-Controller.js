"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.requestPasswordReset = exports.resendVerification = exports.verifyEmail = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const Guardian_1 = __importDefault(require("../db/Guardian"));
const password_1 = require("../domain/password");
const token_1 = require("../domain/token");
const libs_1 = require("@readingForest/libs");
const register = async (req, res, _next) => {
    try {
        const { email, password, firstName, lastName, guardianName } = req.body;
        const existingGuardian = await Guardian_1.default.findOne({ email });
        if (existingGuardian) {
            (0, libs_1.fail)(res, 'Guardian with this email already exists', 409);
            return;
        }
        if (guardianName) {
            const existingGuardianname = await Guardian_1.default.findOne({ guardianName });
            if (existingGuardianname) {
                (0, libs_1.fail)(res, 'Guardianname is already taken', 409);
                return;
            }
        }
        const hashedPassword = await (0, password_1.hashPassword)(password);
        const emailVerificationToken = (0, password_1.generateToken)();
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const guardian = await Guardian_1.default.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            guardianName,
            emailVerificationToken,
            emailVerificationExpires,
        });
        libs_1.logger.info('Guardian registered', {
            guardianId: guardian._id,
            email: guardian.email,
            _id: guardian._id,
        });
        (0, libs_1.success)(res, {
            id: guardian._id,
            email: guardian.email,
            firstName: guardian.firstName,
            lastName: guardian.lastName,
            bio: guardian.bio,
            avatar: guardian.avatar,
        }, 'Registration successful. Please check your email to verify your account.', undefined, 201);
    }
    catch (error) {
        libs_1.logger.error('Registration error', { error });
        _next(error);
    }
};
exports.register = register;
const login = async (req, res, _next) => {
    try {
        const { email, password } = req.body;
        const guardian = await Guardian_1.default.findOne({ email }).select('+password +refreshTokens');
        if (!guardian) {
            (0, libs_1.fail)(res, 'Invalid email or password', 401);
            return;
        }
        const isPasswordValid = await (0, password_1.comparePassword)(password, guardian.password);
        if (!isPasswordValid) {
            (0, libs_1.fail)(res, 'Invalid email or password', 401);
            return;
        }
        const { accessToken, refreshToken } = (0, token_1.generateTokens)(guardian._id.toString(), guardian.email, guardian.role);
        guardian.refreshTokens.push(refreshToken);
        await guardian.save();
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.setHeader('x-access-token', accessToken);
        libs_1.logger.info('Guardian logged in', { guardianId: guardian._id, email: guardian.email });
        (0, libs_1.success)(res, {
            id: guardian._id,
            email: guardian.email,
            firstName: guardian.firstName,
            lastName: guardian.lastName,
            bio: guardian.bio,
            avatar: guardian.avatar,
            role: guardian.role,
            accessToken,
        }, 'Login successful');
    }
    catch (error) {
        libs_1.logger.error('Login error', { error });
        _next(error);
    }
};
exports.login = login;
const refresh = async (req, res, _next) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            (0, libs_1.fail)(res, 'Refresh token not found', 401);
            return;
        }
        const payload = (0, token_1.verifyRefresh)(refreshToken);
        const guardian = await Guardian_1.default.findById(payload.userId).select('+refreshTokens');
        if (!guardian || !guardian.refreshTokens.includes(refreshToken)) {
            (0, libs_1.fail)(res, 'Invalid refresh token', 401);
            return;
        }
        guardian.refreshTokens = guardian.refreshTokens.filter((token) => token !== refreshToken);
        const { accessToken, refreshToken: newRefreshToken } = (0, token_1.generateTokens)(guardian._id.toString(), guardian.email, guardian.role);
        guardian.refreshTokens.push(newRefreshToken);
        await guardian.save();
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.setHeader('x-access-token', accessToken);
        libs_1.logger.info('Token refreshed', { guardianId: guardian._id });
        (0, libs_1.success)(res, {
            id: guardian._id,
            email: guardian.email,
            firstName: guardian.firstName,
            lastName: guardian.lastName,
            bio: guardian.bio,
            avatar: guardian.avatar,
            role: guardian.role,
            accessToken,
        }, 'Token refreshed successfully');
    }
    catch (error) {
        libs_1.logger.error('Token refresh error', { error });
        (0, libs_1.fail)(res, 'Invalid or expired refresh token', 401);
    }
};
exports.refresh = refresh;
const logout = async (req, res, _next) => {
    try {
        const { refreshToken } = req.cookies;
        if (refreshToken) {
            const payload = (0, token_1.verifyRefresh)(refreshToken);
            const guardian = await Guardian_1.default.findById(payload.userId).select('+refreshTokens');
            if (guardian) {
                guardian.refreshTokens = guardian.refreshTokens.filter((token) => token !== refreshToken);
                await guardian.save();
                libs_1.logger.info('Guardian logged out', { guardianId: guardian._id });
            }
        }
        res.clearCookie('refreshToken');
        (0, libs_1.success)(res, null, 'Logout successful');
    }
    catch (error) {
        libs_1.logger.error('Logout error', { error });
        res.clearCookie('refreshToken');
        (0, libs_1.success)(res, null, 'Logout successful');
    }
};
exports.logout = logout;
const verifyEmail = async (req, res, _next) => {
    try {
        const { token } = req.body;
        const guardian = await Guardian_1.default.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: new Date() },
        }).select('+emailVerificationToken +emailVerificationExpires');
        if (!guardian) {
            (0, libs_1.fail)(res, 'Invalid or expired verification token', 400);
            return;
        }
        guardian.isEmailVerified = true;
        guardian.emailVerificationToken = undefined;
        guardian.emailVerificationExpires = undefined;
        await guardian.save();
        libs_1.logger.info('Email verified', { guardianId: guardian._id, email: guardian.email });
        (0, libs_1.success)(res, null, 'Email verified successfully');
    }
    catch (error) {
        libs_1.logger.error('Email verification error', { error });
        _next(error);
    }
};
exports.verifyEmail = verifyEmail;
const resendVerification = async (req, res, _next) => {
    try {
        const { email } = req.body;
        const guardian = await Guardian_1.default.findOne({ email }).select('+emailVerificationToken');
        if (!guardian) {
            (0, libs_1.success)(res, null, 'If the email exists, a verification link has been sent');
            return;
        }
        if (guardian.isEmailVerified) {
            (0, libs_1.fail)(res, 'Email is already verified', 400);
            return;
        }
        const emailVerificationToken = (0, password_1.generateToken)();
        const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        guardian.emailVerificationToken = emailVerificationToken;
        guardian.emailVerificationExpires = emailVerificationExpires;
        await guardian.save();
        libs_1.logger.info('Verification email resent', {
            guardianId: guardian._id,
            email: guardian.email,
        });
        (0, libs_1.success)(res, null, 'Verification email sent');
    }
    catch (error) {
        libs_1.logger.error('Resend verification error', { error });
        _next(error);
    }
};
exports.resendVerification = resendVerification;
const requestPasswordReset = async (req, res, _next) => {
    try {
        const { email } = req.body;
        const guardian = await Guardian_1.default.findOne({ email }).select('+passwordResetToken');
        if (!guardian) {
            (0, libs_1.success)(res, null, 'If the email exists, a password reset link has been sent');
            return;
        }
        const passwordResetToken = (0, password_1.generateToken)();
        const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
        guardian.passwordResetToken = passwordResetToken;
        guardian.passwordResetExpires = passwordResetExpires;
        await guardian.save();
        libs_1.logger.info('Password reset requested', {
            guardianId: guardian._id,
            email: guardian.email,
        });
        (0, libs_1.success)(res, null, 'Password reset link sent to your email');
    }
    catch (error) {
        libs_1.logger.error('Password reset request error', { error });
        _next(error);
    }
};
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = async (req, res, _next) => {
    try {
        const { token, newPassword } = req.body;
        const guardian = await Guardian_1.default.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: new Date() },
        }).select('+password +passwordResetToken +passwordResetExpires');
        if (!guardian) {
            (0, libs_1.fail)(res, 'Invalid or expired reset token', 400);
            return;
        }
        const hashedPassword = await (0, password_1.hashPassword)(newPassword);
        guardian.password = hashedPassword;
        guardian.passwordResetToken = undefined;
        guardian.passwordResetExpires = undefined;
        await guardian.save();
        libs_1.logger.info('Password reset successful', {
            guardianId: guardian._id,
            email: guardian.email,
        });
        (0, libs_1.success)(res, null, 'Password reset successful');
    }
    catch (error) {
        libs_1.logger.error('Password reset error', { error });
        _next(error);
    }
};
exports.resetPassword = resetPassword;
const changePassword = async (req, res, _next) => {
    try {
        const guardianId = req.headers['x-guardian-id'];
        const { oldPassword, newPassword } = req.body;
        if (!guardianId) {
            (0, libs_1.fail)(res, 'Unauthorized', 401);
            return;
        }
        const guardian = await Guardian_1.default.findById(guardianId).select('+password');
        if (!guardian) {
            (0, libs_1.fail)(res, 'Guardian not found', 404);
            return;
        }
        const isPasswordValid = await (0, password_1.comparePassword)(oldPassword, guardian.password);
        if (!isPasswordValid) {
            (0, libs_1.fail)(res, 'Current password is incorrect', 401);
            return;
        }
        const hashedPassword = await (0, password_1.hashPassword)(newPassword);
        guardian.password = hashedPassword;
        await guardian.save();
        libs_1.logger.info('Password changed', { guardianId: guardian._id, email: guardian.email });
        (0, libs_1.success)(res, null, 'Password changed successfully');
    }
    catch (error) {
        libs_1.logger.error('Password change error', { error });
        _next(error);
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=Auth-Guardian-Controller.js.map