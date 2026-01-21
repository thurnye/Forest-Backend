"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = void 0;
const studentServiceClient_1 = require("./clients/studentServiceClient");
const healthCheck = async (_req, res) => {
    try {
        await studentServiceClient_1.studentServiceClient.get('/health');
        res.json({
            status: 'healthy',
            service: 'guardian-service',
            timestamp: new Date().toISOString(),
            dependencies: {
                'student-service': 'healthy',
            },
        });
    }
    catch (error) {
        res.status(503).json({
            status: 'degraded',
            service: 'guardian-service',
            timestamp: new Date().toISOString(),
            dependencies: {
                'student-service': 'unhealthy',
            },
        });
    }
};
exports.healthCheck = healthCheck;
//# sourceMappingURL=health.js.map