/**
 * Aggregated Swagger documentation for ReadingForest Backend API Gateway
 */
import swaggerUi from 'swagger-ui-express';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'ReadingForest Backend API',
    version: '1.0.0',
    description:
      'API Gateway for ReadingForest  - aggregates all microservices',
    contact: {
      name: 'ReadingForest API Support',
    },
  },
  servers: [
    {
      url: 'http://localhost:8000',
      description: 'Development API Gateway',
    },
  ],
  tags: [
    { name: 'Guardian Authentication', description: 'Guardian auth endpoints' },
    { name: 'Student Authentication', description: 'Student auth endpoints' },
    { name: 'User', description: 'User service endpoints' },
  ],
  paths: {
    // Guardian Authentication
    '/api/auth/guardian/register': {
      post: {
        summary: 'Register new guardian',
        tags: ['Guardian Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  guardianName: { type: 'string' },
                },
                required: ['email', 'password', 'firstName', 'lastName'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'Guardian registered successfully' },
          '400': { description: 'Validation error' },
          '409': { description: 'Guardian already exists' },
        },
      },
    },
    '/api/auth/guardian/login': {
      post: {
        summary: 'Login guardian',
        tags: ['Guardian Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/guardian/refresh': {
      post: {
        summary: 'Refresh guardian access token',
        tags: ['Guardian Authentication'],
        responses: {
          '200': { description: 'Token refreshed successfully' },
          '401': { description: 'Invalid refresh token' },
        },
      },
    },
    '/api/auth/guardian/logout': {
      post: {
        summary: 'Logout guardian',
        tags: ['Guardian Authentication'],
        responses: {
          '200': { description: 'Logout successful' },
        },
      },
    },
    // Student Authentication
    '/api/auth/student/register': {
      post: {
        summary: 'Register new student',
        tags: ['Student Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  studentName: { type: 'string' },
                  targetGradeLevel: { type: 'string' },
                  diagnosticEnabled: { type: 'boolean' },
                },
                required: ['email', 'password', 'firstName', 'lastName'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'Student registered successfully' },
          '400': { description: 'Validation error' },
          '409': { description: 'Student already exists' },
        },
      },
    },
    '/api/auth/student/login': {
      post: {
        summary: 'Login student',
        tags: ['Student Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Login successful' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/student/refresh': {
      post: {
        summary: 'Refresh student access token',
        tags: ['Student Authentication'],
        responses: {
          '200': { description: 'Token refreshed successfully' },
          '401': { description: 'Invalid refresh token' },
        },
      },
    },
    '/api/auth/student/logout': {
      post: {
        summary: 'Logout student',
        tags: ['Student Authentication'],
        responses: {
          '200': { description: 'Logout successful' },
        },
      },
    },
    // User endpoints
    '/api/user/{id}': {
      get: {
        summary: 'Get user profile',
        tags: ['User'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': { description: 'User profile retrieved' },
          '404': { description: 'User not found' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

// Export swagger-ui-express setup
export const swaggerUiSetup = swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
});

export const swaggerUiServe = swaggerUi.serve;
