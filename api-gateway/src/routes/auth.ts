import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { authRateLimit } from '../middleware/rateLimit';

const router = Router();
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL!;

/**
 * Proxy all /api/auth/* requests to auth-service
 */
router.use(
  '/',
  authRateLimit, // Apply strict rate limiting to auth endpoints
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/auth': '', // Remove /api/auth prefix when forwarding
    },
    onProxyReq: (proxyReq, req: any) => {
      // Forward request ID for tracing
      if (req.requestId) {
        proxyReq.setHeader('x-request-id', req.requestId);
      }

      // Forward user info from auth middleware
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.userId);
        proxyReq.setHeader('x-user-email', req.user.email);
      }

      // Fix request body for parsed requests (handles express.json() middleware)
      fixRequestBody(proxyReq, req);
    },
    onError: (_err, _req, res: any) => {
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
  })
);

export default router;
