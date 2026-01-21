"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const GUARDIAN_SERVICE_URL = process.env.GUARDIAN_SERVICE_URL;
router.use('/', auth_1.authenticate, (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: GUARDIAN_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/guardian': '',
    },
    onProxyReq: (proxyReq, req) => {
        if (req.requestId) {
            proxyReq.setHeader('x-request-id', req.requestId);
        }
        if (req.user) {
            proxyReq.setHeader('x-user-id', req.user.userId);
            proxyReq.setHeader('x-user-email', req.user.email);
            if (req.user.role) {
                proxyReq.setHeader('x-user-role', req.user.role);
            }
        }
        (0, http_proxy_middleware_1.fixRequestBody)(proxyReq, req);
    },
    onError: (_err, _req, res) => {
        res.status(503).json({
            success: false,
            data: null,
            errors: [
                {
                    code: 'SERVICE_UNAVAILABLE',
                    message: 'Guardian service unavailable',
                },
            ],
        });
    },
}));
exports.default = router;
//# sourceMappingURL=guardian.js.map