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
    { name: 'Authentication', description: 'Auth service endpoints' },
    { name: 'User', description: 'User service endpoints' },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register new user',
        tags: ['Authentication'],
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
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'User registered successfully' },
          '400': { description: 'Validation error' },
          '409': { description: 'User already exists' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        summary: 'Login user',
        tags: ['Authentication'],
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
