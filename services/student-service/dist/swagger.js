"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
exports.swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'ReadingForest Student Service API',
        version: '1.0.0',
        description: 'Student profile management service for ReadingForest ',
    },
    servers: [
        {
            url: process.env.STUDENT_SERVICE_URL || 'https://api.example.com/student',
            description: 'Student service',
        },
    ],
    paths: {
        '/create': {
            post: {
                summary: 'Create a new user profile',
                tags: ['User'],
            },
        },
        '/edit': {
            post: {
                summary: 'Update user profile',
                tags: ['User'],
            },
        },
        '/{id}': {
            get: {
                summary: 'Get user profile by ID',
                tags: ['User'],
            },
        },
    },
};
//# sourceMappingURL=swagger.js.map