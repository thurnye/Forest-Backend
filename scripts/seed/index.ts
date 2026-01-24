/**
 * Database Seeding Script
 * Usage: npm run seed
 *
 * This script seeds the database with dummy data for testing
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/ReadingForest';

/**
 * Guardian Schema (matches auth-service Guardian model)
 */
const GuardianSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, enum: ['parent', 'teacher'], default: 'parent' },
    isEmailVerified: { type: Boolean, default: false },
    refreshTokens: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

/**
 * Student Schema (matches auth-service Student model)
 */
const StudentSchema = new mongoose.Schema(
  {
    guardianId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Guardian' },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    avatar: { type: String },
    dateOfBirth: { type: Date },
    grade: { type: String },
    readingLevel: { type: String, default: 'pre-k' },
    targetGradeLevel: { type: String, default: 'grade-1' },
    hasCompletedDiagnostic: { type: Boolean, default: false },
    diagnosticEnabled: { type: Boolean, default: true },
    refreshTokens: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

/**
 * StudentProgress Schema (matches student-service StudentProgress model)
 */
const StudentProgressSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Student' },
    currentLevel: { type: String, default: 'pre-k' },
    exercisesCompleted: { type: Number, default: 0 },
    totalExercises: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    lastActivityAt: { type: Date },
  },
  { timestamps: true },
);

const Student = mongoose.model('Student', StudentSchema);
const Guardian = mongoose.model('Guardian', GuardianSchema);
const StudentProgress = mongoose.model('StudentProgress', StudentProgressSchema);

/**
 * Generate username from first and last name
 */
function generateUsername(firstName: string, lastName: string, index: number): string {
  const base = `${firstName.toLowerCase()}${lastName.toLowerCase().charAt(0)}`;
  return `${base}${index + 1}`;
}

/**
 * Sample guardians to seed
 */
const sampleGuardians = [
  {
    email: 'parent@gmail.com',
    password: 'Password123!',
    firstName: 'Parent',
    lastName: 'Test',
    role: 'parent',
    isEmailVerified: true,
  },
  {
    email: 'teacher@readingforest.com',
    password: 'Teacher123!',
    firstName: 'Teacher',
    lastName: 'Smith',
    role: 'teacher',
    isEmailVerified: true,
  },
];

/**
 * Sample students to seed (guardianId will be set after guardians are created)
 */
const sampleStudents = [
  {
    password: 'Password123',
    firstName: 'John',
    lastName: 'Doe',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=john',
    grade: 'grade-1',
    readingLevel: 'grade-1',
    targetGradeLevel: 'grade-1',
    dateOfBirth: new Date('2018-03-15'),
    hasCompletedDiagnostic: true,
    diagnosticEnabled: false,
  },
  {
    password: 'Password123',
    firstName: 'Jane',
    lastName: 'Smith',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=jane',
    grade: 'grade-2',
    readingLevel: 'pre-k',
    targetGradeLevel: 'grade-2',
    dateOfBirth: new Date('2017-07-22'),
    hasCompletedDiagnostic: false,
    diagnosticEnabled: true,
  },
  {
    password: 'Password123',
    firstName: 'Alex',
    lastName: 'Johnson',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alex',
    grade: 'kindergarten',
    readingLevel: 'pre-k',
    targetGradeLevel: 'grade-1',
    dateOfBirth: new Date('2019-11-08'),
    hasCompletedDiagnostic: false,
    diagnosticEnabled: true,
  },
  {
    password: 'Password123',
    firstName: 'Emma',
    lastName: 'Wilson',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=emma',
    grade: 'grade-3',
    readingLevel: 'grade-2',
    targetGradeLevel: 'grade-3',
    dateOfBirth: new Date('2016-05-30'),
    hasCompletedDiagnostic: true,
    diagnosticEnabled: false,
  },
];

/**
 * Seed database with guardians, students, and progress records
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data if CLEAR_DB is set
    const shouldClear = process.env.CLEAR_DB === 'true';
    if (shouldClear) {
      console.log('🗑️  Clearing existing data...');
      await Student.deleteMany({});
      await Guardian.deleteMany({});
      await StudentProgress.deleteMany({});
      console.log('✅ Cleared existing data');
    }

    // Create guardians
    console.log('👤 Creating guardians...');
    const guardiansToCreate = await Promise.all(
      sampleGuardians.map(async (guardian) => ({
        ...guardian,
        password: await bcrypt.hash(guardian.password, 10),
      })),
    );

    const createdGuardians = await Guardian.insertMany(guardiansToCreate);
    console.log(`✅ Created ${createdGuardians.length} guardians`);

    // Get the first guardian's ID to link students
    const primaryGuardianId = createdGuardians[0]._id;

    // Create students with usernames and guardianId
    console.log('👦 Creating students...');
    const studentsToCreate = await Promise.all(
      sampleStudents.map(async (student, index) => ({
        ...student,
        username: generateUsername(student.firstName, student.lastName, index),
        password: await bcrypt.hash(student.password, 10),
        guardianId: primaryGuardianId,
      })),
    );

    const createdStudents = await Student.insertMany(studentsToCreate);
    console.log(`✅ Created ${createdStudents.length} students`);

    // Create initial progress records for each student
    console.log('📊 Creating student progress records...');
    const progressRecords = createdStudents.map((student) => ({
      studentId: student._id,
      currentLevel: student.grade || 'pre-k',
      exercisesCompleted: 0,
      totalExercises: 0,
      averageScore: 0,
      streakDays: 0,
    }));

    const createdProgress = await StudentProgress.insertMany(progressRecords);
    console.log(`✅ Created ${createdProgress.length} progress records`);

    // Log summary
    console.log('\n📋 Seeded Data Summary:');
    console.log('─'.repeat(50));

    console.log('\nGuardians:');
    createdGuardians.forEach((guardian) => {
      console.log(`  📧 ${guardian.email} (${guardian.role})`);
    });

    console.log('\nStudents (linked to parent@gmail.com):');
    createdStudents.forEach((student: any) => {
      console.log(`  👤 ${student.firstName} ${student.lastName} (@${student.username}) - Grade: ${student.grade}`);
    });

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('─'.repeat(50));
    console.log('Guardian Login:');
    console.log('  Email: parent@gmail.com');
    console.log('  Password: Password123!');
    console.log('\nStudent Login:');
    console.log('  Username: johnd1');
    console.log('  Password: Password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run seeding
seedDatabase();
