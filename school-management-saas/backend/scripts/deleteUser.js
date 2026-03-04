import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load env vars
dotenv.config();

const deleteUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected\n');

    const email = process.argv[2];

    if (!email) {
      console.log('Usage: node deleteUser.js <email>');
      console.log('Example: node deleteUser.js admin@school.com');
      process.exit(1);
    }

    console.log('Deleting user with email:', email);

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('Found user:');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('ID:', user._id);

    await User.findByIdAndDelete(user._id);

    console.log('\n✅ User deleted successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error deleting user:', error.message);
    process.exit(1);
  }
};

deleteUser();
