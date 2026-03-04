import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load env vars
dotenv.config();

const createSuperAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    console.log('Database:', process.env.MONGODB_URI.split('/').pop().split('?')[0]);
    console.log('-----------------------------------\n');

    // Super Admin details
    const superAdminData = {
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: 'admin123',
      role: 'SuperAdmin'
    };

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ 
      email: superAdminData.email 
    });
    
    if (existingSuperAdmin) {
      console.log('ℹ️  Super Admin already exists');
      console.log('-----------------------------------');
      console.log('Name:', existingSuperAdmin.name);
      console.log('Email:', existingSuperAdmin.email);
      console.log('Role:', existingSuperAdmin.role);
      console.log('Active:', existingSuperAdmin.isActive);
      console.log('Created:', existingSuperAdmin.createdAt);
      console.log('-----------------------------------\n');
      console.log('✅ You can login with:');
      console.log('   Email:', superAdminData.email);
      console.log('   Password:', superAdminData.password);
      console.log('\n💡 Tip: If you forgot the password, use resetPassword.js script');
      
      await mongoose.connection.close();
      process.exit(0);
    }

    // Create super admin (password will be auto-hashed by User model pre-save hook)
    const superAdmin = await User.create(superAdminData);

    console.log('🎉 Super Admin created successfully!');
    console.log('-----------------------------------');
    console.log('Name:', superAdmin.name);
    console.log('Email:', superAdmin.email);
    console.log('Password:', superAdminData.password, '(hashed in database)');
    console.log('Role:', superAdmin.role);
    console.log('ID:', superAdmin._id);
    console.log('Active:', superAdmin.isActive);
    console.log('-----------------------------------\n');
    
    console.log('✅ Login Credentials:');
    console.log('   Email:', superAdminData.email);
    console.log('   Password:', superAdminData.password);
    console.log('\n📝 Example Login Request:');
    console.log(JSON.stringify({
      email: superAdminData.email,
      password: superAdminData.password
    }, null, 2));
    
    console.log('\n🚀 Next Steps:');
    console.log('   1. Open: super-admin-panel/login.html');
    console.log('   2. Enter the credentials above');
    console.log('   3. Click "Sign In"');
    console.log('   4. You should see the dashboard!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    
    if (error.code === 11000) {
      console.error('\n⚠️  Duplicate key error: A user with this email already exists');
      console.error('   Try using a different email or delete the existing user first');
    }
    
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Export for use in server.js
export { createSuperAdmin };

// Run the function
createSuperAdmin();
