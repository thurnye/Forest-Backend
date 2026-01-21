export declare const swaggerSpec: {
    openapi: string;
    info: {
        title: string;
        version: string;
        description: string;
        contact: {
            name: string;
        };
    };
    servers: {
        url: string;
        description: string;
    }[];
    tags: {
        name: string;
        description: string;
    }[];
    paths: {
        '/api/auth/guardian/register': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    email: {
                                        type: string;
                                        format: string;
                                    };
                                    password: {
                                        type: string;
                                        minLength: number;
                                    };
                                    firstName: {
                                        type: string;
                                    };
                                    lastName: {
                                        type: string;
                                    };
                                    guardianName: {
                                        type: string;
                                    };
                                };
                                required: string[];
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                    };
                    '400': {
                        description: string;
                    };
                    '409': {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/guardian/login': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    email: {
                                        type: string;
                                        format: string;
                                    };
                                    password: {
                                        type: string;
                                    };
                                };
                                required: string[];
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                    };
                    '401': {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/guardian/refresh': {
            post: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                    '401': {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/guardian/logout': {
            post: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/student/register': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    username: {
                                        type: string;
                                        format: string;
                                    };
                                    password: {
                                        type: string;
                                        minLength: number;
                                    };
                                    firstName: {
                                        type: string;
                                    };
                                    lastName: {
                                        type: string;
                                    };
                                    dateOfBirth: {
                                        type: string;
                                        format: string;
                                    };
                                    targetGradeLevel: {
                                        type: string;
                                    };
                                    diagnosticEnabled: {
                                        type: string;
                                    };
                                    guardianId: {
                                        type: string;
                                    };
                                };
                                required: string[];
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                    };
                    '400': {
                        description: string;
                    };
                    '409': {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/student/login': {
            post: {
                summary: string;
                tags: string[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    username: {
                                        type: string;
                                        format: string;
                                    };
                                    password: {
                                        type: string;
                                    };
                                };
                                required: string[];
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                    };
                    '401': {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/student/refresh': {
            post: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                    '401': {
                        description: string;
                    };
                };
            };
        };
        '/api/auth/student/logout': {
            post: {
                summary: string;
                tags: string[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/user/{id}': {
            get: {
                summary: string;
                tags: string[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                    '404': {
                        description: string;
                    };
                };
            };
        };
        '/api/student/students/{id}': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                    description: string;
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                    '404': {
                        description: string;
                    };
                };
            };
        };
        '/api/student/students/guardian/{guardianId}': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/student/students/lookup': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        format: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                    '404': {
                        description: string;
                    };
                };
            };
        };
        '/api/student/exercises': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: ({
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                    };
                    required?: undefined;
                })[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/student/goals': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    studentId: {
                                        type: string;
                                    };
                                    title: {
                                        type: string;
                                    };
                                    description: {
                                        type: string;
                                    };
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                    targetValue: {
                                        type: string;
                                    };
                                    unit: {
                                        type: string;
                                    };
                                    deadline: {
                                        type: string;
                                        format: string;
                                    };
                                };
                                required: string[];
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/api/student/goals/student/{studentId}': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: ({
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                    };
                    required?: undefined;
                })[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/student/assignments': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    studentId: {
                                        type: string;
                                    };
                                    exerciseId: {
                                        type: string;
                                    };
                                    dueDate: {
                                        type: string;
                                        format: string;
                                    };
                                };
                                required: string[];
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                    };
                };
            };
        };
        '/api/student/assignments/student/{studentId}': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: ({
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                    };
                    required?: undefined;
                })[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/guardian/students': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                    '401': {
                        description: string;
                    };
                    '403': {
                        description: string;
                    };
                };
            };
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    email: {
                                        type: string;
                                        format: string;
                                    };
                                    firstName: {
                                        type: string;
                                    };
                                    lastName: {
                                        type: string;
                                    };
                                    password: {
                                        type: string;
                                    };
                                    targetGradeLevel: {
                                        type: string;
                                    };
                                    diagnosticEnabled: {
                                        type: string;
                                    };
                                };
                                required: string[];
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                    };
                    '400': {
                        description: string;
                    };
                    '409': {
                        description: string;
                    };
                };
            };
        };
        '/api/guardian/students/{studentId}': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                    '403': {
                        description: string;
                    };
                    '404': {
                        description: string;
                    };
                };
            };
            delete: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                    '403': {
                        description: string;
                    };
                    '404': {
                        description: string;
                    };
                };
            };
        };
        '/api/guardian/students/link': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    studentEmail: {
                                        type: string;
                                        format: string;
                                    };
                                };
                                required: string[];
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                    };
                    '404': {
                        description: string;
                    };
                    '409': {
                        description: string;
                    };
                };
            };
        };
        '/api/guardian/exercises': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                    };
                }[];
                responses: {
                    '200': {
                        description: string;
                    };
                };
            };
        };
        '/api/guardian/students/{studentId}/assignments': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    exerciseId: {
                                        type: string;
                                    };
                                    dueDate: {
                                        type: string;
                                        format: string;
                                    };
                                };
                                required: string[];
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                    };
                    '403': {
                        description: string;
                    };
                    '409': {
                        description: string;
                    };
                };
            };
        };
        '/api/guardian/goals': {
            post: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    studentId: {
                                        type: string;
                                    };
                                    title: {
                                        type: string;
                                    };
                                    description: {
                                        type: string;
                                    };
                                    type: {
                                        type: string;
                                        enum: string[];
                                    };
                                    targetValue: {
                                        type: string;
                                    };
                                    unit: {
                                        type: string;
                                    };
                                    deadline: {
                                        type: string;
                                        format: string;
                                    };
                                };
                                required: string[];
                            };
                        };
                    };
                };
                responses: {
                    '201': {
                        description: string;
                    };
                    '403': {
                        description: string;
                    };
                };
            };
        };
        '/api/guardian/students/{studentId}/goals': {
            get: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: ({
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                        enum?: undefined;
                    };
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        enum: string[];
                    };
                    required?: undefined;
                } | {
                    name: string;
                    in: string;
                    schema: {
                        type: string;
                        enum?: undefined;
                    };
                    required?: undefined;
                })[];
                responses: {
                    '200': {
                        description: string;
                    };
                    '403': {
                        description: string;
                    };
                };
            };
        };
        '/api/guardian/students/{studentId}/diagnostic': {
            patch: {
                summary: string;
                tags: string[];
                security: {
                    bearerAuth: never[];
                }[];
                parameters: {
                    name: string;
                    in: string;
                    required: boolean;
                    schema: {
                        type: string;
                    };
                }[];
                requestBody: {
                    required: boolean;
                    content: {
                        'application/json': {
                            schema: {
                                type: string;
                                properties: {
                                    enabled: {
                                        type: string;
                                    };
                                };
                                required: string[];
                            };
                        };
                    };
                };
                responses: {
                    '200': {
                        description: string;
                    };
                    '403': {
                        description: string;
                    };
                };
            };
        };
    };
    components: {
        securitySchemes: {
            bearerAuth: {
                type: string;
                scheme: string;
                bearerFormat: string;
            };
        };
    };
};
export declare const swaggerUiSetup: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const swaggerUiServe: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>[];
//# sourceMappingURL=swagger.d.ts.map