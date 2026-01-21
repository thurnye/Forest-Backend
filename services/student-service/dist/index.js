"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const libs_1 = require("@readingForest/libs");
const health_1 = require("./health");
dotenv_1.default.config();
const student_route_1 = __importDefault(require("./routes/student.route"));
const progress_route_1 = __importDefault(require("./routes/progress.route"));
const exercise_route_1 = __importDefault(require("./routes/exercise.route"));
const assessment_route_1 = __importDefault(require("./routes/assessment.route"));
const attempt_route_1 = __importDefault(require("./routes/attempt.route"));
const goal_route_1 = __importDefault(require("./routes/goal.route"));
const assignment_route_1 = __importDefault(require("./routes/assignment.route"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URI;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, _res, next) => {
    libs_1.logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        ip: req.ip,
    });
    next();
});
app.get('/health', health_1.healthCheck);
app.use('/students', student_route_1.default);
app.use('/progress', progress_route_1.default);
app.use('/exercises', exercise_route_1.default);
app.use('/assessments', assessment_route_1.default);
app.use('/attempts', attempt_route_1.default);
app.use('/goals', goal_route_1.default);
app.use('/assignments', assignment_route_1.default);
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
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    libs_1.logger.info('Connected to MongoDB', { database: MONGODB_URI });
    app.listen(PORT, () => {
        libs_1.logger.info(`Student service running on port ${PORT}`);
    });
})
    .catch((error) => {
    libs_1.logger.error('MongoDB connection error', { error: error.message });
    process.exit(1);
});
process.on('SIGTERM', () => {
    libs_1.logger.info('SIGTERM received, closing server gracefully');
    mongoose_1.default.connection.close();
    process.exit(0);
});
exports.default = app;
//# sourceMappingURL=index.js.map