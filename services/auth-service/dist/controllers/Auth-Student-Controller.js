"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.requestPasswordReset = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const Student_1 = __importDefault(require("../db/Student"));
const password_1 = require("../domain/password");
const token_1 = require("../domain/token");
const libs_1 = require("@readingForest/libs");
const username_1 = require("../utils/username");
const register = async (req, res, _next) => {
    try {
        const { password, firstName, lastName, username, avatar, dateOfBirth, grade, targetGradeLevel, diagnosticEnabled, guardianId, } = req.body;
        console.log('✌️ Registering student with data:', req.body);
        if (username) {
            const existingStudent = await Student_1.default.findOne({ username });
            if (existingStudent) {
                (0, libs_1.fail)(res, 'Student with this username already exists', 409);
                return;
            }
        }
        const finalUsername = await (0, username_1.generateUniqueUsername)({
            preferredUsername: username
        });
        const hashedPassword = await (0, password_1.hashPassword)(password);
        const student = await Student_1.default.create({
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
        libs_1.logger.info('Student registered', {
            studentId: student._id,
            username: student.username,
            _id: student._id,
        });
        (0, libs_1.success)(res, {
            id: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            username: student.username,
            avatar: student.avatar,
        }, 'Student registration successful', undefined, 201);
    }
    catch (error) {
        libs_1.logger.error('Registration error', { error });
        _next(error);
    }
};
exports.register = register;
const login = async (req, res, _next) => {
    try {
        const { username, password } = req.body;
        const student = await Student_1.default.findOne({ username }).select('+password +refreshTokens');
        if (!student) {
            (0, libs_1.fail)(res, 'Invalid username or password', 401);
            return;
        }
        const isPasswordValid = await (0, password_1.comparePassword)(password, student.password);
        if (!isPasswordValid) {
            (0, libs_1.fail)(res, 'Invalid username or password', 401);
            return;
        }
        const { accessToken, refreshToken } = (0, token_1.generateTokens)(student._id.toString(), '', student.username, 'STUDENT');
        student.refreshTokens.push(refreshToken);
        await student.save();
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.setHeader('x-access-token', accessToken);
        libs_1.logger.info('Student logged in', {
            studentId: student._id,
            username: student.username,
        });
        (0, libs_1.success)(res, {
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
        console.log('[Refresh] Cookies received:', req.cookies);
        console.log('[Refresh] RefreshToken from cookie:', refreshToken ? 'present' : 'missing');
        if (!refreshToken) {
            (0, libs_1.fail)(res, 'Refresh token not found', 401);
            return;
        }
        const payload = (0, token_1.verifyRefresh)(refreshToken);
        console.log('[Refresh] Token payload:', payload);
        const student = await Student_1.default.findById(payload.userId).select('+refreshTokens');
        console.log('[Refresh] Student found:', student ? 'yes' : 'no');
        console.log('[Refresh] Stored tokens count:', student?.refreshTokens?.length || 0);
        console.log('[Refresh] Token in array:', student?.refreshTokens?.includes(refreshToken));
        if (!student || !student.refreshTokens.includes(refreshToken)) {
            (0, libs_1.fail)(res, 'Invalid refresh token', 401);
            return;
        }
        student.refreshTokens = student.refreshTokens.filter((token) => token !== refreshToken);
        const { accessToken, refreshToken: newRefreshToken } = (0, token_1.generateTokens)(student._id.toString(), '', student.username, 'STUDENT');
        student.refreshTokens.push(newRefreshToken);
        await student.save();
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.setHeader('x-access-token', accessToken);
        libs_1.logger.info('Token refreshed', { studentId: student._id });
        (0, libs_1.success)(res, {
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
            const student = await Student_1.default.findById(payload.userId).select('+refreshTokens');
            if (student) {
                student.refreshTokens = student.refreshTokens.filter((token) => token !== refreshToken);
                await student.save();
                libs_1.logger.info('Student logged out', { studentId: student._id });
            }
        }
        res.clearCookie('refreshToken', { path: '/' });
        (0, libs_1.success)(res, null, 'Logout successful');
    }
    catch (error) {
        libs_1.logger.error('Logout error', { error });
        res.clearCookie('refreshToken', { path: '/' });
        (0, libs_1.success)(res, null, 'Logout successful');
    }
};
exports.logout = logout;
const requestPasswordReset = async (req, res, _next) => {
    try {
        const { username } = req.body;
        const student = await Student_1.default.findOne({ username }).select('+passwordResetToken');
        if (!student) {
            (0, libs_1.success)(res, null, 'If the username exists, a password reset link has been sent');
            return;
        }
        const passwordResetToken = (0, password_1.generateToken)();
        const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
        student.passwordResetToken = passwordResetToken;
        student.passwordResetExpires = passwordResetExpires;
        await student.save();
        libs_1.logger.info('Password reset requested', {
            studentId: student._id,
            username: student.username,
        });
        (0, libs_1.success)(res, null, 'Password reset link sent to your username');
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
        const student = await Student_1.default.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: new Date() },
        }).select('+password +passwordResetToken +passwordResetExpires');
        if (!student) {
            (0, libs_1.fail)(res, 'Invalid or expired reset token', 400);
            return;
        }
        const hashedPassword = await (0, password_1.hashPassword)(newPassword);
        student.password = hashedPassword;
        student.passwordResetToken = undefined;
        student.passwordResetExpires = undefined;
        await student.save();
        libs_1.logger.info('Password reset successful', {
            studentId: student._id,
            username: student.username,
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
        const studentId = req.headers['x-student-id'];
        const { oldPassword, newPassword } = req.body;
        if (!studentId) {
            (0, libs_1.fail)(res, 'Unauthorized', 401);
            return;
        }
        const student = await Student_1.default.findById(studentId).select('+password');
        if (!student) {
            (0, libs_1.fail)(res, 'Student not found', 404);
            return;
        }
        const isPasswordValid = await (0, password_1.comparePassword)(oldPassword, student.password);
        if (!isPasswordValid) {
            (0, libs_1.fail)(res, 'Current password is incorrect', 401);
            return;
        }
        const hashedPassword = await (0, password_1.hashPassword)(newPassword);
        student.password = hashedPassword;
        await student.save();
        libs_1.logger.info('Password changed', {
            studentId: student._id,
            username: student.username,
        });
        (0, libs_1.success)(res, null, 'Password changed successfully');
    }
    catch (error) {
        libs_1.logger.error('Password change error', { error });
        _next(error);
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=Auth-Student-Controller.js.map