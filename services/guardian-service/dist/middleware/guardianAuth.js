"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardianAuth = void 0;
const ALLOWED_ROLES = ['PARENT', 'TEACHER', 'GUARDIAN'];
const guardianAuth = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'] || '';
    if (!userId) {
        res.status(401).json({
            success: false,
            error: 'Unauthorized: Missing user identity',
        });
        return;
    }
    const normalizedRole = userRole.toUpperCase();
    if (!ALLOWED_ROLES.includes(normalizedRole)) {
        res.status(403).json({
            success: false,
            error: 'Forbidden: Only parents and teachers can access this resource',
        });
        return;
    }
    req.guardianId = userId;
    req.guardianRole = normalizedRole;
    next();
};
exports.guardianAuth = guardianAuth;
exports.default = exports.guardianAuth;
//# sourceMappingURL=guardianAuth.js.map