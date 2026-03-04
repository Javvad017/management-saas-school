import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load env vars
dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Admin details
    const adminData = {
      name: 'Super Admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'SuperAdmin'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('❌ Admin already exists with this email');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin
    const admin = await User.create(adminData);

    console.log('✅ Admin created successfully!');
    console.log('-----------------------------------');
    console.log('Email:', admin.email);
    console.log('Password:', adminData.password);
    console.log('Role:', admin.role);
    console.log('ID:', admin._id);
    console.log('-----------------------------------');
    console.log('\nYou can now login with these credentials');
    console.log('\nLogin Request:');
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

createAdmin();
