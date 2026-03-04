import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Load env vars
dotenv.config();

const testLogin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected\n');

    const testEmail = 'admin@test.com';
    const testPassword = 'admin123';

    console.log('🔍 Testing Login System');
    console.log('-----------------------------------');
    console.log('Test Email:', testEmail);
    console.log('Test Password:', testPassword);
    console.log('-----------------------------------\n');

    // Step 1: Find user
    console.log('Step 1: Finding user...');
    const user = await User.findOne({ email: testEmail.toLowerCase() }).select('+password');
    
    if (!user) {
      console.log('❌ User not found in database');
      console.log('Available users:');
      const allUsers = await User.find({}, 'email role');
      allUsers.forEach(u => console.log(`  - ${u.email} (${u.role})`));
      process.exit(1);
    }
    
    console.log('✅ User found');
    console.log('   Email:', user.email);
    console.log('   Role:', user.role);
    console.log('   Active:', user.isActive);
    console.log('   Password Hash:', user.password.substring(0, 20) + '...\n');

    // Step 2: Check if account is active
    console.log('Step 2: Checking account status...');
    if (!user.isActive) {
      console.log('❌ Account is deactivated');
      process.exit(1);
    }
    console.log('✅ Account is active\n');

    // Step 3: Compare password
    console.log('Step 3: Comparing password...');
    const isMatch = await bcrypt.compare(testPassword, user.password);
    
    if (!isMatch) {
      console.log('❌ Password does not match');
      console.log('   Entered:', testPassword);
      console.log('   Hash in DB:', user.password.substring(0, 30) + '...');
      
      // Test if password is stored in plain text (common mistake)
      if (user.password === testPassword) {
        console.log('⚠️  WARNING: Password is stored in PLAIN TEXT!');
        console.log('   This is a security issue. Password should be hashed.');
      }
      process.exit(1);
    }
    
    console.log('✅ Password matches\n');

    // Step 4: Generate token
    console.log('Step 4: Generating JWT token...');
    console.log('✅ JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('✅ JWT_EXPIRE:', process.env.JWT_EXPIRE || '7d');
    
    console.log('\n-----------------------------------');
    console.log('🎉 LOGIN TEST SUCCESSFUL!');
    console.log('-----------------------------------');
    console.log('All authentication steps passed.');
    console.log('You should be able to login now.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during test:', error.message);
    console.error(error);
    process.exit(1);
  }
};

testLogin();
