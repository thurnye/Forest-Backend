"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_Guardian_Controller_1 = require("../controllers/Auth-Guardian-Controller");
const libs_1 = require("@readingForest/libs");
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
router.post('/register', (0, libs_1.validate)(validators_1.registerGuardianSchema), Auth_Guardian_Controller_1.register);
router.post('/login', (0, libs_1.validate)(validators_1.GuardianLoginSchema), Auth_Guardian_Controller_1.login);
router.post('/refresh', Auth_Guardian_Controller_1.refresh);
router.post('/logout', Auth_Guardian_Controller_1.logout);
router.post('/verify-email', Auth_Guardian_Controller_1.verifyEmail);
router.post('/resend-verification', Auth_Guardian_Controller_1.resendVerification);
router.post('/reset-request', Auth_Guardian_Controller_1.requestPasswordReset);
router.post('/reset-password', Auth_Guardian_Controller_1.resetPassword);
router.post('/change-password', Auth_Guardian_Controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=auth-guardian.route.js.map