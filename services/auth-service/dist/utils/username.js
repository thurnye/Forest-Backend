"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueUsername = generateUniqueUsername;
exports.resolveUsernameOnGuardianTransfer = resolveUsernameOnGuardianTransfer;
const Student_1 = __importDefault(require("../db/Student"));
const unique_names_generator_1 = require("unique-names-generator");
const KID_FRIENDLY_ADJECTIVES = [
    'great',
    'brave',
    'kind',
    'bright',
    'happy',
    'clever',
    'gentle',
    'curious',
    'sparkly',
    'swift',
    'mighty',
    'calm',
    'funny',
    'proud',
    'sunny',
    'friendly',
    'cheerful',
    'playful',
    'helpful',
    'lucky',
    'creative',
    'peaceful',
    'thoughtful',
    'joyful',
    'bold',
    'smiling',
    'energetic',
    'honest',
    'careful',
    'kindhearted',
    'bright-eyed',
    'adventurous',
    'patient',
    'hopeful',
    'imaginative',
    'bubbly',
    'charming',
    'graceful',
    'sweet',
    'fearless',
];
function slugify(s) {
    return s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 32);
}
function baseUsernameFromName(firstName, lastName) {
    const raw = [firstName, lastName].filter(Boolean).join(' ');
    if (!raw)
        return null;
    const slug = slugify(raw);
    return slug.length >= 3 ? slug.slice(0, 24) : null;
}
function randomBase() {
    return (0, unique_names_generator_1.uniqueNamesGenerator)({
        dictionaries: [KID_FRIENDLY_ADJECTIVES, unique_names_generator_1.animals],
        separator: '-',
        style: 'lowerCase',
    });
}
async function generateUniqueUsername(opts) {
    const { preferredUsername, excludeStudentId, firstName, lastName, maxAttempts = 50, } = opts;
    const preferred = (preferredUsername && slugify(preferredUsername)) ||
        baseUsernameFromName(firstName, lastName) ||
        randomBase();
    const exists = async (candidate) => {
        const query = { username: candidate };
        if (excludeStudentId)
            query._id = { $ne: excludeStudentId };
        return Boolean(await Student_1.default.exists(query));
    };
    if (!(await exists(preferred)))
        return preferred;
    for (let i = 2; i <= maxAttempts; i++) {
        const candidate = `${preferred}-${i}`;
        if (!(await exists(candidate)))
            return candidate;
    }
    for (let i = 0; i < maxAttempts; i++) {
        const candidate = randomBase();
        if (!(await exists(candidate)))
            return candidate;
    }
    return `${preferred}-${Math.random().toString(36).slice(2, 6)}`;
}
async function resolveUsernameOnGuardianTransfer(params) {
    const { studentId, currentUsername, firstName, lastName } = params;
    return generateUniqueUsername({
        preferredUsername: currentUsername,
        excludeStudentId: studentId,
        firstName,
        lastName,
    });
}
//# sourceMappingURL=username.js.map