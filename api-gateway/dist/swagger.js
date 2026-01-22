"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerUiServe = exports.swaggerUiSetup = exports.swaggerSpec = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'ReadingForest Backend API',
        version: '1.0.0',
        description: 'API Gateway for ReadingForest  - aggregates all microservices',
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
        { name: 'Student', description: 'Student service endpoints' },
        { name: 'Guardian', description: 'Guardian service endpoints' },
    ],
    paths: {
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
                                    username: { type: 'string', format: 'email' },
                                    password: { type: 'string', minLength: 8 },
                                    firstName: { type: 'string' },
                                    lastName: { type: 'string' },
                                    dateOfBirth: { type: 'string', format: 'date' },
                                    targetGradeLevel: { type: 'string' },
                                    diagnosticEnabled: { type: 'boolean' },
                                    guardianId: { type: 'string' },
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
                                    username: { type: 'string', format: 'email' },
                                    password: { type: 'string' },
                                },
                                required: ['username', 'password'],
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
        '/api/student/students/{id}': {
            get: {
                summary: 'Get student detail',
                tags: ['Student'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                        description: 'Student ID',
                    },
                ],
                responses: {
                    '200': { description: 'Student detail with progress, assessments, attempts' },
                    '404': { description: 'Student not found' },
                },
            },
        },
        '/api/student/students/guardian/{guardianId}': {
            get: {
                summary: 'Get students by guardian',
                tags: ['Student'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'guardianId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': { description: 'List of students for guardian' },
                },
            },
        },
        '/api/student/students/lookup': {
            get: {
                summary: 'Lookup student by email',
                tags: ['Student'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'email',
                        in: 'query',
                        required: true,
                        schema: { type: 'string', format: 'email' },
                    },
                ],
                responses: {
                    '200': { description: 'Student found' },
                    '404': { description: 'Student not found' },
                },
            },
        },
        '/api/student/exercises': {
            get: {
                summary: 'Get exercises by reading level',
                tags: ['Student'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'readingLevel', in: 'query', required: true, schema: { type: 'string' } },
                    { name: 'skillStrand', in: 'query', schema: { type: 'string' } },
                    { name: 'type', in: 'query', schema: { type: 'string' } },
                    { name: 'limit', in: 'query', schema: { type: 'integer' } },
                    { name: 'skip', in: 'query', schema: { type: 'integer' } },
                ],
                responses: {
                    '200': { description: 'List of exercises' },
                },
            },
        },
        '/api/student/goals': {
            post: {
                summary: 'Create a goal',
                tags: ['Student'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    studentId: { type: 'string' },
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    type: { type: 'string', enum: ['exercises', 'time', 'streak', 'score', 'level'] },
                                    targetValue: { type: 'number' },
                                    unit: { type: 'string' },
                                    deadline: { type: 'string', format: 'date-time' },
                                },
                                required: ['studentId', 'title', 'type', 'targetValue', 'unit', 'deadline'],
                            },
                        },
                    },
                },
                responses: {
                    '201': { description: 'Goal created' },
                },
            },
        },
        '/api/student/goals/student/{studentId}': {
            get: {
                summary: 'Get goals for student',
                tags: ['Student'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'studentId', in: 'path', required: true, schema: { type: 'string' } },
                    { name: 'status', in: 'query', schema: { type: 'string' } },
                ],
                responses: {
                    '200': { description: 'List of goals' },
                },
            },
        },
        '/api/student/assignments': {
            post: {
                summary: 'Create an assignment',
                tags: ['Student'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    studentId: { type: 'string' },
                                    exerciseId: { type: 'string' },
                                    dueDate: { type: 'string', format: 'date-time' },
                                },
                                required: ['studentId', 'exerciseId'],
                            },
                        },
                    },
                },
                responses: {
                    '201': { description: 'Assignment created' },
                },
            },
        },
        '/api/student/assignments/student/{studentId}': {
            get: {
                summary: 'Get assignments for student',
                tags: ['Student'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'studentId', in: 'path', required: true, schema: { type: 'string' } },
                    { name: 'status', in: 'query', schema: { type: 'string' } },
                ],
                responses: {
                    '200': { description: 'List of assignments' },
                },
            },
        },
        '/api/guardian/students': {
            get: {
                summary: 'Get all students for guardian',
                tags: ['Guardian'],
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': { description: 'List of students with progress' },
                    '401': { description: 'Unauthorized' },
                    '403': { description: 'Forbidden - not a guardian role' },
                },
            },
        },
        '/api/guardian/students/register': {
            post: {
                summary: 'Register a new student (via auth-service)',
                tags: ['Guardian'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    password: { type: 'string', minLength: 6 },
                                    firstName: { type: 'string' },
                                    lastName: { type: 'string' },
                                    username: { type: 'string' },
                                    avatar: { type: 'string' },
                                    dateOfBirth: { type: 'string', format: 'date' },
                                    grade: { type: 'string' },
                                    targetGradeLevel: { type: 'string' },
                                    diagnosticEnabled: { type: 'boolean' },
                                },
                                required: ['password', 'firstName', 'lastName'],
                            },
                        },
                    },
                },
                responses: {
                    '201': { description: 'Student registered successfully' },
                    '400': { description: 'Validation error' },
                    '409': { description: 'Username already exists' },
                },
            },
        },
        '/api/guardian/students/{studentId}': {
            get: {
                summary: 'Get student detail',
                tags: ['Guardian'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'studentId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': { description: 'Student detail with progress, assessments, attempts' },
                    '403': { description: 'Student does not belong to guardian' },
                    '404': { description: 'Student not found' },
                },
            },
            delete: {
                summary: 'Unlink student from guardian',
                tags: ['Guardian'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'studentId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                responses: {
                    '200': { description: 'Student unlinked' },
                    '403': { description: 'Student does not belong to guardian' },
                    '404': { description: 'Student not found' },
                },
            },
        },
        '/api/guardian/students/link': {
            post: {
                summary: 'Link existing student by email',
                tags: ['Guardian'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    studentEmail: { type: 'string', format: 'email' },
                                },
                                required: ['studentEmail'],
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Student linked' },
                    '404': { description: 'Student not found' },
                    '409': { description: 'Student already linked to another guardian' },
                },
            },
        },
        '/api/guardian/exercises': {
            get: {
                summary: 'Get exercises',
                tags: ['Guardian'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'readingLevel', in: 'query', schema: { type: 'string' } },
                    { name: 'skillStrand', in: 'query', schema: { type: 'string' } },
                    { name: 'type', in: 'query', schema: { type: 'string' } },
                    { name: 'limit', in: 'query', schema: { type: 'integer' } },
                    { name: 'skip', in: 'query', schema: { type: 'integer' } },
                ],
                responses: {
                    '200': { description: 'List of exercises' },
                },
            },
        },
        '/api/guardian/students/{studentId}/assignments': {
            post: {
                summary: 'Assign exercise to student',
                tags: ['Guardian'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'studentId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    exerciseId: { type: 'string' },
                                    dueDate: { type: 'string', format: 'date-time' },
                                },
                                required: ['exerciseId'],
                            },
                        },
                    },
                },
                responses: {
                    '201': { description: 'Assignment created' },
                    '403': { description: 'Student does not belong to guardian' },
                    '409': { description: 'Assignment already exists' },
                },
            },
        },
        '/api/guardian/goals': {
            post: {
                summary: 'Create a goal for student',
                tags: ['Guardian'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    studentId: { type: 'string' },
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    type: { type: 'string', enum: ['exercises', 'time', 'streak', 'score', 'level'] },
                                    targetValue: { type: 'number' },
                                    unit: { type: 'string' },
                                    deadline: { type: 'string', format: 'date-time' },
                                },
                                required: ['studentId', 'title', 'type', 'targetValue', 'unit', 'deadline'],
                            },
                        },
                    },
                },
                responses: {
                    '201': { description: 'Goal created' },
                    '403': { description: 'Student does not belong to guardian' },
                },
            },
        },
        '/api/guardian/students/{studentId}/goals': {
            get: {
                summary: 'Get goals for student',
                tags: ['Guardian'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'studentId', in: 'path', required: true, schema: { type: 'string' } },
                    { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'completed', 'expired', 'cancelled'] } },
                    { name: 'limit', in: 'query', schema: { type: 'integer' } },
                    { name: 'skip', in: 'query', schema: { type: 'integer' } },
                ],
                responses: {
                    '200': { description: 'List of goals' },
                    '403': { description: 'Student does not belong to guardian' },
                },
            },
        },
        '/api/guardian/students/{studentId}/diagnostic': {
            patch: {
                summary: 'Update student diagnostic setting',
                tags: ['Guardian'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'studentId',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    enabled: { type: 'boolean' },
                                },
                                required: ['enabled'],
                            },
                        },
                    },
                },
                responses: {
                    '200': { description: 'Diagnostic setting updated' },
                    '403': { description: 'Student does not belong to guardian' },
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
exports.swaggerUiSetup = swagger_ui_express_1.default.setup(exports.swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
});
exports.swaggerUiServe = swagger_ui_express_1.default.serve;
//# sourceMappingURL=swagger.js.map