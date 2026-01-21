"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_proxy_middleware_1 = require("http-proxy-middleware");
const rateLimit_1 = require("../middleware/rateLimit");
const router = (0, express_1.Router)();
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
router.use('/', rateLimit_1.authRateLimit, (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '',
    },
    onProxyReq: (proxyReq, req) => {
        if (req.requestId) {
            proxyReq.setHeader('x-request-id', req.requestId);
        }
        if (req.user) {
            proxyReq.setHeader('x-user-id', req.user.userId);
            proxyReq.setHeader('x-user-email', req.user.email);
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
                    message: 'Auth service unavailable',
                },
            ],
        });
    },
}));
exports.default = router;
//# sourceMappingURL=auth.js.map