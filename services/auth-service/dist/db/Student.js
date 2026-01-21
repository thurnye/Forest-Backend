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
const StudentSchema = new mongoose_1.Schema({
    guardianId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Guardian',
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        required: true,
    },
    avatar: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    grade: {
        type: String,
    },
    readingLevel: {
        type: String,
        default: 'pre-k',
    },
    targetGradeLevel: {
        type: String,
        default: 'grade-1',
    },
    hasCompletedDiagnostic: {
        type: Boolean,
        default: false,
    },
    diagnosticEnabled: {
        type: Boolean,
        default: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
    refreshTokens: {
        type: [String],
        default: [],
        select: false,
    },
}, {
    timestamps: true,
});
StudentSchema.index({ guardianId: 1 });
StudentSchema.index({ guardianId: 1, isActive: 1, createdAt: -1 });
StudentSchema.index({ username: 1 }, { unique: true });
const Student = mongoose_1.default.model('Student', StudentSchema);
exports.default = Student;
//# sourceMappingURL=Student.js.map