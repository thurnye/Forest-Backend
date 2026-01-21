import { Request, Response, NextFunction } from 'express';

export interface GuardianRequest extends Request {
  guardianId: string;
  guardianRole: string;
}

const ALLOWED_ROLES = ['PARENT', 'TEACHER', 'GUARDIAN'];

/**
 * Middleware to extract guardian identity from headers
 * API Gateway handles JWT auth and forwards x-user-id, x-user-role headers
 * This middleware just validates role and extracts guardianId for convenience
 */
export const guardianAuth = (req: Request, res: Response, next: NextFunction): void => {
  const userId = req.headers['x-user-id'] as string;
  const userRole = (req.headers['x-user-role'] as string) || '';

  // x-user-id should always be present if api-gateway authenticated the request
  if (!userId) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing user identity',
    });
    return;
  }

  // Validate role - only allow PARENT, TEACHER, or GUARDIAN roles
  const normalizedRole = userRole.toUpperCase();
  if (!ALLOWED_ROLES.includes(normalizedRole)) {
    res.status(403).json({
      success: false,
      error: 'Forbidden: Only parents and teachers can access this resource',
    });
    return;
  }

  // Attach guardian info to request for use in controllers
  (req as GuardianRequest).guardianId = userId;
  (req as GuardianRequest).guardianRole = normalizedRole;

  next();
};

export default guardianAuth;
