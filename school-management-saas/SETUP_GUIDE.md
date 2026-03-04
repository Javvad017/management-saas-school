# Quick Setup Guide

## Step-by-Step Instructions

### Step 1: Install MongoDB

Make sure MongoDB is installed and running on your system.

**Check if MongoDB is running:**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl status mongodb
```

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd school-management-saas/backend

# Install dependencies
npm install

# Start the server
npm run dev
```

You should see:
```
Server running in development mode on port 5000
MongoDB Connected: localhost
```

### Step 3: Create SuperAdmin User

Open a new terminal and use curl or Postman:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "superadmin@test.com",
    "password": "admin123",
    "role": "SuperAdmin"
  }'
```

Save the token from the response.

### Step 4: Create a School

```bash
curl -X POST http://localhost:5000/api/schools \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPERADMIN_TOKEN" \
  -d '{
    "name": "Demo School",
    "address": "123 School Street",
    "phone": "1234567890",
    "email": "demo@school.com",
    "adminName": "School Admin",
    "adminEmail": "admin@demo.com",
    "adminPassword": "admin123"
  }'
```

### Step 5: Setup User Website

```bash
# Open new terminal
cd school-management-saas/user-website

# Install dependencies
npm install

# Start development server
npm run dev
```

Website will open at: http://localhost:3000

### Step 6: Setup Admin Desktop

```bash
# Open new terminal
cd school-management-saas/admin-desktop

# Install dependencies
npm install

# Start Electron app
npm start
```

### Step 7: Test the System

**Admin Desktop:**
1. Login with: admin@demo.com / admin123
2. Navigate through Dashboard, Students, Teachers, etc.

**User Website:**
1. First create a student via Admin Desktop or API
2. Login with student credentials
3. View dashboard, attendance, and fees

## Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Make sure MongoDB is running

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process using that port or change PORT in .env

### CORS Error in Browser
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution:** Backend CORS is configured for localhost:3000 and localhost:5173

### JWT Token Invalid
```
Error: Not authorized to access this route
```
**Solution:** Make sure you're sending the token in Authorization header

## Sample Data Creation Script

Create a file `backend/seed.js`:

```javascript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import School from './models/School.js';
import Student from './models/Student.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing data
    await User.deleteMany({});
    await School.deleteMany({});
    await Student.deleteMany({});
    
    // Create SuperAdmin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@test.com',
      password: 'admin123',
      role: 'SuperAdmin'
    });
    
    console.log('SuperAdmin created:', superAdmin.email);
    
    // Create School
    const school = await School.create({
      name: 'Demo School',
      address: '123 School St',
      phone: '1234567890',
      email: 'demo@school.com'
    });
    
    // Create School Admin
    const schoolAdmin = await User.create({
      name: 'School Admin',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'SchoolAdmin',
      schoolId: school._id
    });
    
    school.adminId = schoolAdmin._id;
    await school.save();
    
    console.log('School created:', school.name);
    console.log('School Admin created:', schoolAdmin.email);
    
    // Create sample student
    const studentUser = await User.create({
      name: 'John Doe',
      email: 'john@student.com',
      password: 'student123',
      role: 'Student',
      schoolId: school._id
    });
    
    await Student.create({
      userId: studentUser._id,
      schoolId: school._id,
      rollNumber: '001',
      class: '10',
      section: 'A',
      dateOfBirth: new Date('2010-01-01'),
      parentName: 'Parent Name',
      parentPhone: '9876543210',
      address: 'Student Address'
    });
    
    console.log('Student created:', studentUser.email);
    console.log('\\nSetup complete! Use these credentials:');
    console.log('SuperAdmin: superadmin@test.com / admin123');
    console.log('School Admin: admin@demo.com / admin123');
    console.log('Student: john@student.com / student123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedData();
```

Run it:
```bash
cd backend
node seed.js
```

## Next Steps

1. Customize the UI styling
2. Add more features (reports, notifications, etc.)
3. Implement file uploads for student photos
4. Add email notifications
5. Create mobile app version
6. Add payment gateway integration
7. Implement real-time updates with Socket.io

## Support

For issues or questions, check:
- Backend logs in terminal
- Browser console for frontend errors
- MongoDB logs
- Network tab in browser DevTools
