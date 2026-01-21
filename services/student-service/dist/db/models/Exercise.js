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
const QuestionSchema = new mongoose_1.Schema({
    questionId: {
        type: String,
        required: true,
    },
    questionText: {
        type: String,
        required: true,
    },
    questionType: {
        type: String,
        enum: ['multiple-choice', 'fill-in-blank', 'true-false', 'matching', 'sequencing'],
        required: true,
    },
    options: {
        type: [String],
    },
    correctAnswer: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    explanation: {
        type: String,
    },
    points: {
        type: Number,
        default: 1,
    },
}, { _id: false });
const ExerciseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['reading-comprehension', 'phonics', 'vocabulary', 'fluency', 'sequencing'],
        required: true,
    },
    readingLevel: {
        type: String,
        required: true,
    },
    skillStrand: {
        type: String,
        enum: ['phonological-awareness', 'phonics', 'vocabulary', 'comprehension', 'fluency'],
        required: true,
    },
    content: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    audioUrl: {
        type: String,
    },
    questions: {
        type: [QuestionSchema],
        default: [],
    },
    totalPoints: {
        type: Number,
        default: 0,
    },
    estimatedTime: {
        type: Number,
        default: 5,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium',
    },
    tags: {
        type: [String],
        default: [],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
ExerciseSchema.index({ readingLevel: 1, skillStrand: 1 });
ExerciseSchema.index({ type: 1, isActive: 1 });
ExerciseSchema.index({ tags: 1 });
const Exercise = mongoose_1.default.model('Exercise', ExerciseSchema);
exports.default = Exercise;
//# sourceMappingURL=Exercise.js.map