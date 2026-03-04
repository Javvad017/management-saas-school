import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import School from '../models/School.js';
import Student from '../models/Student.js';

dotenv.config();

const testRoleSystem = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Check Super Admin
    console.log('=== TEST 1: Super Admin ===');
    const superAdmin = await User.findOne({ role: 'SuperAdmin' });
    if (superAdmin) {
      console.log('✅ Super Admin exists:', superAdmin.email);
      console.log('   Role:', superAdmin.role);
      console.log('   SchoolId:', superAdmin.schoolId || 'None (correct)');
    } else {
      console.log('❌ No Super Admin found. Run: node scripts/createAdmin.js');
    }

    // Test 2: Check Schools
    console.log('\n=== TEST 2: Schools ===');
    const schools = await School.find();
    console.log(`✅ Found ${schools.length} school(s)`);
    schools.forEach(school => {
      console.log(`   - ${school.name} (${school.email})`);
      console.log(`     Status: ${school.isActive ? 'Active' : 'Inactive'}`);
      console.log(`     Subscription: ${school.subscriptionStatus}`);
    });

    // Test 3: Check School Admins
    console.log('\n=== TEST 3: School Admins ===');
    const schoolAdmins = await User.find({ role: 'SchoolAdmin' }).populate('schoolId', 'name');
    console.log(`✅ Found ${schoolAdmins.length} school admin(s)`);
    schoolAdmins.forEach(admin => {
      console.log(`   - ${admin.name} (${admin.email})`);
      console.log(`     School: ${admin.schoolId?.name || 'Not assigned'}`);
    });

    // Test 4: Check Teachers
    console.log('\n=== TEST 4: Teachers ===');
    const teachers = await User.find({ role: 'Teacher' }).populate('schoolId', 'name');
    console.log(`✅ Found ${teachers.length} teacher(s)`);
    teachers.forEach(teacher => {
      console.log(`   - ${teacher.name} (${teacher.email})`);
      console.log(`     School: ${teacher.schoolId?.name || 'Not assigned'}`);
    });

    // Test 5: Check Students
    console.log('\n=== TEST 5: Students ===');
    const studentUsers = await User.find({ role: 'Student' }).populate('schoolId', 'name');
    console.log(`✅ Found ${studentUsers.length} student user(s)`);
    
    const studentProfiles = await Student.find().populate('schoolId', 'name').populate('userId', 'name email');
    console.log(`✅ Found ${studentProfiles.length} student profile(s)`);
    studentProfiles.forEach(student => {
      console.log(`   - ${student.userId?.name || 'Unknown'} (${student.userId?.email || 'No email'})`);
      console.log(`     School: ${student.schoolId?.name || 'Not assigned'}`);
      console.log(`     Class: ${student.class}-${student.section}, Roll: ${student.rollNumber}`);
    });

    // Test 6: Role Distribution
    console.log('\n=== TEST 6: Role Distribution ===');
    const roleCounts = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    roleCounts.forEach(role => {
      console.log(`   ${role._id}: ${role.count}`);
    });

    // Test 7: Data Isolation Check
    console.log('\n=== TEST 7: Data Isolation ===');
    const schoolsWithData = await School.find();
    for (const school of schoolsWithData) {
      const studentCount = await Student.countDocuments({ schoolId: school._id });
      const userCount = await User.countDocuments({ schoolId: school._id });
      console.log(`   ${school.name}:`);
      console.log(`     - ${userCount} users`);
      console.log(`     - ${studentCount} student profiles`);
    }

    console.log('\n✅ Role system test complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
};

testRoleSystem();
