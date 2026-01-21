import Student from '../db/Student';
import { uniqueNamesGenerator, animals } from 'unique-names-generator';

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

// Optional: you can also curate nouns instead of using animals
// const KID_FRIENDLY_NOUNS = ['sapling', 'fox', 'owl', ...];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32); // small safety cap
}

function baseUsernameFromName(
  firstName?: string,
  lastName?: string,
): string | null {
  const raw = [firstName, lastName].filter(Boolean).join(' ');
  if (!raw) return null;

  const slug = slugify(raw);
  return slug.length >= 3 ? slug.slice(0, 24) : null;
}

function randomBase(): string {
  return uniqueNamesGenerator({
    dictionaries: [KID_FRIENDLY_ADJECTIVES, animals],
    separator: '-',
    style: 'lowerCase',
  });
}

type EnsureUsernameOpts = {
  preferredUsername?: string | null;
  excludeStudentId?: string;
  firstName?: string;
  lastName?: string;
  maxAttempts?: number;
};

export async function generateUniqueUsername(
  opts: EnsureUsernameOpts,
): Promise<string> {
  const {
    preferredUsername,
    excludeStudentId,
    firstName,
    lastName,
    maxAttempts = 50,
  } = opts;

  const preferred =
    (preferredUsername && slugify(preferredUsername)) ||
    baseUsernameFromName(firstName, lastName) ||
    randomBase();

  const exists = async (candidate: string) => {
    const query: any = { username: candidate };
    if (excludeStudentId) query._id = { $ne: excludeStudentId };
    return Boolean(await Student.exists(query));
  };

  // 1) Try preferred/base username
  if (!(await exists(preferred))) return preferred;

  // 2) Try numeric suffixes
  for (let i = 2; i <= maxAttempts; i++) {
    const candidate = `${preferred}-${i}`;
    if (!(await exists(candidate))) return candidate;
  }

  // 3) Final fallback: regenerate entirely
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = randomBase();
    if (!(await exists(candidate))) return candidate;
  }

  // 4) Absolute fallback
  return `${preferred}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function resolveUsernameOnGuardianTransfer(params: {
  studentId: string;
  currentUsername: string;
  firstName?: string;
  lastName?: string;
}): Promise<string> {
  const { studentId, currentUsername, firstName, lastName } = params;

  return generateUniqueUsername({
    preferredUsername: currentUsername,
    excludeStudentId: studentId,
    firstName,
    lastName,
  });
}
