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
 * User model (minimal for seeding)
 */
const GuardianSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  username: String,
  bio: String,
  role: String,
  reputation: Number,
  isEmailVerified: Boolean,
});
const StudentSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  username: String,
  bio: String,
  role: String,
  reputation: Number,
  isEmailVerified: Boolean,
  readingLevel: String,
  targetGradeLevel: mongoose.Schema.Types.Mixed,
  hasCompletedDiagnostic: Boolean,
  diagnosticEnabled: Boolean,
  guardian: mongoose.Types.ObjectId,
});

const Student = mongoose.model('Student', StudentSchema);
const Guardian = mongoose.model('Guardian', GuardianSchema);

/**
 * Sample users to seed
 */
const sampleStudents = [

  {
    email: 'john.doe@example.com',
    password: 'Password123',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    bio: 'Food enthusiast and home chef',
    role: 'student',
    reputation: 100,
    isEmailVerified: true,
    readingLevel: 'grade-1',
    targetGradeLevel: 'grade-1',
    hasCompletedDiagnostic: true,
    diagnosticEnabled: false,
    guardian: new mongoose.Types.ObjectId(),
  },
  {
    email: 'jane.smith@example.com',
    password: 'Password123',
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'janesmith',
    bio: 'Professional chef and recipe creator',
    role: 'student',
    reputation: 250,
    isEmailVerified: true,
    readingLevel: 'grade-1',
    targetGradeLevel: 'grade-1',
    hasCompletedDiagnostic: true,
    diagnosticEnabled: false,
    guardian: new mongoose.Types.ObjectId(),
    
  },
  {
    email: 'chef.gordon@example.com',
    password: 'Password123',
    firstName: 'Gordon',
    lastName: 'Chef',
    username: 'chefgordon',
    bio: 'Master chef with 20 years of experience',
    role: 'student',
    reputation: 1000,
    isEmailVerified: true,
    readingLevel: 'grade-1',
    targetGradeLevel: 'grade-1',
    hasCompletedDiagnostic: true,
    diagnosticEnabled: false,
    guardian: new mongoose.Types.ObjectId(),
    
  },
  {
    email: 'baker.mary@example.com',
    password: 'Password123',
    firstName: 'Mary',
    lastName: 'Baker',
    username: 'marybaker',
    bio: 'Pastry chef and baking expert',
    role: 'student',
    reputation: 350,
    isEmailVerified: true,
    readingLevel: 'grade-1',
    targetGradeLevel: 'grade-1',
    hasCompletedDiagnostic: true,
    diagnosticEnabled: false,
    guardian: new mongoose.Types.ObjectId(),
  },
];

const sampleGuardians = [
    {
    email: 'parent@gmail.com',
    password: 'Password123!',
    firstName: 'Admin',
    lastName: 'Food-Admin',
    username: 'johndoe',
    bio: 'Food enthusiast and home chef',
    role: 'parent',
    reputation: 100,
    isEmailVerified: true,
    
  },
  {
    email: 'teacher@readingForest.com',
    password: 'AdminPass123',
    firstName: 'Admin',
    lastName: 'User',
    username: 'admin',
    bio: 'Platform administrator',
    role: 'teacher',
    reputation: 500,
    isEmailVerified: true,
  }
]

/**
 * Seed database with users
 */
async function seedDatabase() {
  try {
    // console.log('🌱 Starting database seed...');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    // console.log('✅ Connected to MongoDB');

    // Clear existing users (optional - be careful in production!)
    const shouldClear = process.env.CLEAR_DB === 'true';
    if (shouldClear) {
      await Student.deleteMany({});
      // console.log('🗑️  Cleared existing users');
    }

    // Hash passwords and create users
    // console.log('👤 Creating users...');
    const guardiansToCreate = await Promise.all(
      sampleGuardians.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    );
    const studentsToCreate = await Promise.all(
      sampleStudents.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      })),
    );

    const createdGuardians = await Guardian.insertMany(guardiansToCreate);

    const firstGuardianId = createdGuardians[0]._id;
    studentsToCreate.forEach((student) => {
      student.guardian = firstGuardianId;
    });

    await Student.insertMany(studentsToCreate);
    // console.log(`✅ Created ${createdUsers.length} users`);

    // Log created users (without passwords)
    // console.log('\n📋 Created Users:');
    // createdGuardians.forEach((guardian) => {
    //   // console.log(`  - ${user.email} (${user.username}) - Role: ${user.role}`);
    // });
    // createdStudents.forEach((user) => {
    //   // console.log(`  - ${user.email} (${user.username}) - Role: ${user.role}`);
    // });

    console.log('\n✨ Database seeding completed successfully!');
    // console.log('\n📝 Test Credentials:');
    // console.log('  Email: john.doe@example.com');
    console.log('  Password: Password123');
    // console.log('\n  Email: admin@readingForest.com');
    // console.log('  Password: AdminPass123');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    // console.log('\n👋 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run seeding
seedDatabase();
