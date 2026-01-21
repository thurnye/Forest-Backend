"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const AssessmentResultSchema = new mongoose_1.Schema({
    skillStrand: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
}, { _id: false });
const AssessmentSchema = new mongoose_1.Schema({
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Student',
    },
    type: {
        type: String,
        enum: ['diagnostic', 'placement', 'progress', 'mastery'],
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
    results: {
        type: [AssessmentResultSchema],
        default: [],
    },
    overallScore: {
        type: Number,
        default: 0,
    },
    determinedLevel: {
        type: String,
        default: '',
    },
    recommendations: {
        type: [String],
        default: [],
    },
    startedAt: {
        type: Date,
    },
    completedAt: {
        type: Date,
    },
    timeSpent: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
AssessmentSchema.index({ studentId: 1, completedAt: -1 });
AssessmentSchema.index({ studentId: 1, type: 1 });
AssessmentSchema.index({ status: 1 });
const Assessment = mongoose_1.default.model('Assessment', AssessmentSchema);
exports.default = Assessment;
//# sourceMappingURL=Assessment.js.map