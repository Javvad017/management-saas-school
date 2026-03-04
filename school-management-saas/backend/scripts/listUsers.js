import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load env vars
dotenv.config();

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
    console.log('Database:', mongoose.connection.name);
    console.log('-----------------------------------\n');

    const users = await User.find({}, 'name email role isActive schoolId');

    if (users.length === 0) {
      console.log('❌ No users found in database');
      console.log('\nTo create a school admin, run:');
      console.log('npm run create-school-admin');
      process.exit(0);
    }

    console.log(`Found ${users.length} user(s):\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   School ID: ${user.schoolId || 'N/A'}`);
      console.log(`   ID: ${user._id}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error listing users:', error.message);
    process.exit(1);
  }
};

listUsers();
