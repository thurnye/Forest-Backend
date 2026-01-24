"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServiceAPI = exports.authServiceClient = void 0;
const axios_1 = __importDefault(require("axios"));
const libs_1 = require("@readingForest/libs");
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL_INTERNAL || 'http://localhost:3001';
exports.authServiceClient = axios_1.default.create({
    baseURL: AUTH_SERVICE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
exports.authServiceClient.interceptors.request.use((config) => {
    libs_1.logger.info('Outgoing request to auth-service', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
    });
    return config;
}, (error) => {
    libs_1.logger.error('Request error to auth-service', { error: error.message });
    return Promise.reject(error);
});
exports.authServiceClient.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response) {
        libs_1.logger.error('Auth service error response', {
            status: error.response.status,
            data: error.response.data,
            url: error.config?.url,
        });
    }
    else if (error.request) {
        libs_1.logger.error('Auth service no response', {
            url: error.config?.url,
            message: error.message,
        });
    }
    else {
        libs_1.logger.error('Auth service request error', { message: error.message });
    }
    return Promise.reject(error);
});
exports.AuthServiceAPI = {
    registerStudent: (data) => {
        return exports.authServiceClient.post('/student/register', data);
    },
};
exports.default = exports.AuthServiceAPI;
//# sourceMappingURL=authServiceClient.js.map