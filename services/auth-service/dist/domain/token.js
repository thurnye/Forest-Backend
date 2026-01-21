"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefresh = exports.verifyAccess = exports.generateTokens = void 0;
const libs_1 = require("@readingForest/libs");
const generateTokens = (userId, email, username, role) => {
    const payload = { userId, email, username, role };
    return {
        accessToken: (0, libs_1.signAccessToken)(payload),
        refreshToken: (0, libs_1.signRefreshToken)(payload),
    };
};
exports.generateTokens = generateTokens;
const verifyAccess = (token) => {
    return (0, libs_1.verifyAccessToken)(token);
};
exports.verifyAccess = verifyAccess;
const verifyRefresh = (token) => {
    return (0, libs_1.verifyRefreshToken)(token);
};
exports.verifyRefresh = verifyRefresh;
//# sourceMappingURL=token.js.map