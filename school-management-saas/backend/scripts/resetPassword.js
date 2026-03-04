import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Load env vars
dotenv.config();

const resetPassword = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected\n');

    const email = process.argv[2];
    const newPassword = process.argv[3];

    if (!email || !newPassword) {
      console.log('Usage: node resetPassword.js <email> <newPassword>');
      console.log('Example: node resetPassword.js admin@test.com newpass123');
      process.exit(1);
    }

    console.log('🔄 Resetting Password');
    console.log('-----------------------------------');
    console.log('Email:', email);
    console.log('New Password:', newPassword);
    console.log('-----------------------------------\n');

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    console.log('✅ Password reset successfully!');
    console.log('\nYou can now login with:');
    console.log(JSON.stringify({
      email: user.email,
      password: newPassword
    }, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
    process.exit(1);
  }
};

resetPassword();
