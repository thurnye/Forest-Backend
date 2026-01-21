import { Router } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { authenticate } from '../middleware/auth';

const router = Router();
const GUARDIAN_SERVICE_URL = process.env.GUARDIAN_SERVICE_URL!;

/**
 * Proxy all /api/guardian/* requests to guardian-service
 * All routes require authentication
 */
router.use(
  '/',
  authenticate,
  createProxyMiddleware({
    target: GUARDIAN_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/guardian': '', // Remove /api/guardian prefix when forwarding
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
        if (req.user.role) {
          proxyReq.setHeader('x-user-role', req.user.role);
        }
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
            message: 'Guardian service unavailable',
          },
        ],
      });
    },
  }),
);

export default router;
