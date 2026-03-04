import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import School from '../models/School.js';

// Load env vars
dotenv.config();

const createSchoolAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
    console.log('Database:', mongoose.connection.name);
    console.log('-----------------------------------\n');

    // School admin details
    const schoolData = {
      name: 'Demo School',
      address: '123 School Street',
      phone: '1234567890',
      email: 'demo@school.com'
    };

    const adminData = {
      name: 'School Admin',
      email: 'admin@school.com',
      password: 'admin123',
      role: 'SchoolAdmin'
    };

    // Check if school exists
    let school = await School.findOne({ email: schoolData.email });
    
    if (!school) {
      console.log('Creating school...');
      school = await School.create(schoolData);
      console.log('✅ School created:', school.name);
    } else {
      console.log('✅ School already exists:', school.name);
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email.toLowerCase() });
    
    if (existingAdmin) {
      console.log('❌ Admin already exists with this email');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      console.log('\nTo delete and recreate, run:');
      console.log('node scripts/deleteUser.js admin@school.com');
      process.exit(0);
    }

    // Create admin
    console.log('\nCreating school admin...');
    const admin = await User.create({
      ...adminData,
      schoolId: school._id
    });

    // Update school with admin ID
    school.adminId = admin._id;
    await school.save();

    console.log('\n✅ School Admin created successfully!');
    console.log('-----------------------------------');
    console.log('Email:', admin.email);
    console.log('Password:', adminData.password);
    console.log('Role:', admin.role);
    console.log('School:', school.name);
    console.log('ID:', admin._id);
    console.log('-----------------------------------');
    console.log('\nYou can now login with these credentials');
    console.log('\nLogin Request (Postman):');
    console.log('POST http://localhost:5000/api/auth/login');
    console.log(JSON.stringify({
      email: admin.email,
      password: adminData.password
    }, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createSchoolAdmin();
