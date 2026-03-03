import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from './models/Admin.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-management';

async function resetAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Delete existing admin
    await Admin.deleteMany({});
    console.log('✓ Cleared existing admins');

    // Create new admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
      email: 'admin@school.com',
      password: hashedPassword,
    });
    await admin.save();
    console.log('✓ Admin created successfully');
    console.log('  Email: admin@school.com');
    console.log('  Password: admin123');

    // Verify admin exists
    const verifyAdmin = await Admin.findOne({ email: 'admin@school.com' });
    if (verifyAdmin) {
      console.log('✓ Admin verified in database');
    }

    await mongoose.connection.close();
    console.log('✓ Done');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

resetAdmin();
