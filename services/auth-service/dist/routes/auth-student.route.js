"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_Student_Controller_1 = require("../controllers/Auth-Student-Controller");
const libs_1 = require("@readingForest/libs");
const validators_1 = require("../utils/validators");
const router = (0, express_1.Router)();
router.post('/register', (0, libs_1.validate)(validators_1.registerStudentSchema), Auth_Student_Controller_1.register);
router.post('/login', (0, libs_1.validate)(validators_1.studentLoginSchema), Auth_Student_Controller_1.login);
router.post('/refresh', Auth_Student_Controller_1.refresh);
router.post('/logout', Auth_Student_Controller_1.logout);
router.post('/reset-request', Auth_Student_Controller_1.requestPasswordReset);
router.post('/reset-password', Auth_Student_Controller_1.resetPassword);
router.post('/change-password', Auth_Student_Controller_1.changePassword);
exports.default = router;
//# sourceMappingURL=auth-student.route.js.map