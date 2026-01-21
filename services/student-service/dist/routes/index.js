"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignmentRoutes = exports.goalRoutes = exports.attemptRoutes = exports.assessmentRoutes = exports.exerciseRoutes = exports.progressRoutes = exports.studentRoutes = void 0;
var student_route_1 = require("./student.route");
Object.defineProperty(exports, "studentRoutes", { enumerable: true, get: function () { return __importDefault(student_route_1).default; } });
var progress_route_1 = require("./progress.route");
Object.defineProperty(exports, "progressRoutes", { enumerable: true, get: function () { return __importDefault(progress_route_1).default; } });
var exercise_route_1 = require("./exercise.route");
Object.defineProperty(exports, "exerciseRoutes", { enumerable: true, get: function () { return __importDefault(exercise_route_1).default; } });
var assessment_route_1 = require("./assessment.route");
Object.defineProperty(exports, "assessmentRoutes", { enumerable: true, get: function () { return __importDefault(assessment_route_1).default; } });
var attempt_route_1 = require("./attempt.route");
Object.defineProperty(exports, "attemptRoutes", { enumerable: true, get: function () { return __importDefault(attempt_route_1).default; } });
var goal_route_1 = require("./goal.route");
Object.defineProperty(exports, "goalRoutes", { enumerable: true, get: function () { return __importDefault(goal_route_1).default; } });
var assignment_route_1 = require("./assignment.route");
Object.defineProperty(exports, "assignmentRoutes", { enumerable: true, get: function () { return __importDefault(assignment_route_1).default; } });
//# sourceMappingURL=index.js.map