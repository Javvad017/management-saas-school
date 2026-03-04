import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Load env vars
dotenv.config();

const diagnoseLogin = async () => {
  try {
    console.log('=== LOGIN DIAGNOSTIC TOOL ===\n');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    console.log('Database:', mongoose.connection.name);
    console.log('Connection String:', process.env.MONGODB_URI);
    console.log('-----------------------------------\n');

    // Get test email from command line or use default
    const testEmail = process.argv[2] || 'admin@school.com';
    const testPassword = process.argv[3] || 'admin123';

    console.log('Testing login for:');
    console.log('Email:', testEmail);
    console.log('Password:', testPassword);
    console.log('-----------------------------------\n');

    // Step 1: Count total users
    console.log('Step 1: Checking database...');
    const totalUsers = await User.countDocuments();
    console.log(`Total users in database: ${totalUsers}`);

    if (totalUsers === 0) {
      console.log('\n❌ NO USERS FOUND IN DATABASE!');
      console.log('\nTo create a school admin, run:');
      console.log('npm run create-school-admin');
      process.exit(1);
    }

    // Step 2: List all users
    console.log('\nStep 2: Listing all users...');
    const allUsers = await User.find({}, 'email role isActive');
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.role}) - Active: ${user.isActive}`);
    });

    // Step 3: Search for specific user
    console.log('\nStep 3: Searching for user...');
    const normalizedEmail = testEmail.toLowerCase().trim();
    console.log('Normalized email:', normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      console.log('\n❌ USER NOT FOUND!');
      console.log('\nPossible reasons:');
      console.log('1. Email does not exist in database');
      console.log('2. Email has different casing or whitespace');
      console.log('3. User was deleted');
      console.log('\nTo create this user, run:');
      console.log('npm run create-school-admin');
      process.exit(1);
    }

    console.log('✅ User found!');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Active:', user.isActive);
    console.log('Has Password:', !!user.password);
    console.log('Password Hash:', user.password.substring(0, 20) + '...');

    // Step 4: Check if account is active
    console.log('\nStep 4: Checking account status...');
    if (!user.isActive) {
      console.log('❌ Account is deactivated!');
      process.exit(1);
    }
    console.log('✅ Account is active');

    // Step 5: Test password
    console.log('\nStep 5: Testing password...');
    const isMatch = await bcrypt.compare(testPassword, user.password);

    if (!isMatch) {
      console.log('❌ Password does not match!');
      console.log('\nPossible reasons:');
      console.log('1. Wrong password entered');
      console.log('2. Password was changed');
      console.log('3. Password not hashed correctly');
      
      // Check if password is plain text (common mistake)
      if (user.password === testPassword) {
        console.log('\n⚠️  WARNING: Password is stored in PLAIN TEXT!');
        console.log('This is a security issue. Password should be hashed.');
      }
      
      console.log('\nTo reset password, run:');
      console.log(`npm run reset-password ${testEmail} newpassword123`);
      process.exit(1);
    }

    console.log('✅ Password matches!');

    // Step 6: Summary
    console.log('\n=== DIAGNOSTIC SUMMARY ===');
    console.log('✅ Database connected');
    console.log('✅ User exists');
    console.log('✅ Account is active');
    console.log('✅ Password is correct');
    console.log('\n🎉 LOGIN SHOULD WORK!');
    console.log('\nTest with Postman:');
    console.log('POST http://localhost:5000/api/auth/login');
    console.log(JSON.stringify({
      email: testEmail,
      password: testPassword
    }, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during diagnosis:', error.message);
    console.error(error);
    process.exit(1);
  }
};

diagnoseLogin();
