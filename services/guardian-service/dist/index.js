"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const libs_1 = require("@readingForest/libs");
const health_1 = require("./health");
dotenv_1.default.config();
const guardian_route_1 = __importDefault(require("./routes/guardian.route"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3004;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, _res, next) => {
    libs_1.logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userId: req.headers['x-user-id'],
    });
    next();
});
app.get('/health', health_1.healthCheck);
app.use('/', guardian_route_1.default);
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});
app.use((err, req, res, _next) => {
    libs_1.logger.error('Error occurred', {
        error: err.message,
        stack: err.stack,
        path: req.path,
    });
    const errorResponse = (0, libs_1.mapErrorToResponse)(err);
    res.status(errorResponse.statusCode).json(errorResponse);
});
app.listen(PORT, () => {
    libs_1.logger.info(`Guardian service running on port ${PORT}`);
    libs_1.logger.info(`Student service URL: ${process.env.STUDENT_SERVICE_URL_INTERNAL}`);
});
process.on('SIGTERM', () => {
    libs_1.logger.info('SIGTERM received, closing server gracefully');
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=index.js.map