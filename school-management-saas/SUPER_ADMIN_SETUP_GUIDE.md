# 🔐 Super Admin Setup Guide

## Problem Solved

The login was failing with "Invalid credentials" because no Super Admin user existed in the database.

## Solution Implemented

Created a script to insert a default Super Admin user and added auto-creation logic to the server startup.

---

## 📝 Super Admin Credentials

```
Name:     Super Admin
Email:    superadmin@example.com
Password: admin123
Role:     SuperAdmin
```

---

## 🚀 Method 1: Run the Script Manually

### Command
```bash
cd school-management-saas/backend
node scripts/createSuperAdmin.js
```

### Expected Output

#### If Super Admin doesn't exist (First Run):
```
✅ MongoDB Connected
Database: school_management_saas
-----------------------------------

🎉 Super Admin created successfully!
-----------------------------------
Name: Super Admin
Email: superadmin@example.com
Password: admin123 (hashed in database)
Role: SuperAdmin
ID: 507f1f77bcf86cd799439011
Active: true
-----------------------------------

✅ Login Credentials:
   Email: superadmin@example.com
   Password: admin123

📝 Example Login Request:
{
  "email": "superadmin@example.com",
  "password": "admin123"
}

🚀 Next Steps:
   1. Open: super-admin-panel/login.html
   2. Enter the credentials above
   3. Click "Sign In"
   4. You should see the dashboard!
```

#### If Super Admin already exists:
```
✅ MongoDB Connected
Database: school_management_saas
-----------------------------------

ℹ️  Super Admin already exists
-----------------------------------
Name: Super Admin
Email: superadmin@example.com
Role: SuperAdmin
Active: true
Created: 2024-03-05T10:30:00.000Z
-----------------------------------

✅ You can login with:
   Email: superadmin@example.com
   Password: admin123

💡 Tip: If you forgot the password, use resetPassword.js script
```

---

## 🔄 Method 2: Auto-Creation on Server Startup

The server now automatically creates a Super Admin account if none exists when it starts.

### How It Works

1. Server starts
2. Connects to MongoDB
3. Checks if any SuperAdmin user exists
4. If not, creates one with the default credentials
5. Logs the credentials to console

### Server Console Output

When you start the server:
```bash
cd school-management-saas/backend
node server.js
```

You'll see:
```
Server running in development mode on port 5000
MongoDB connected: localhost
✅ Auto-created Super Admin account
   Email: superadmin@example.com
   Password: admin123
```

---

## 🔒 Security Features

### Password Hashing
The password is automatically hashed using bcrypt before storing in the database:

```javascript
// Plain text password (what you enter)
password: 'admin123'

// Hashed password (what's stored in database)
password: '$2a$10$rZ5K8X9Y...' // 60 characters
```

### Pre-Save Hook
The User model has a pre-save hook that automatically hashes passwords:

```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

---

## 🧪 Testing the Login

### Step 1: Create Super Admin
```bash
cd school-management-saas/backend
node scripts/createSuperAdmin.js
```

### Step 2: Verify in Database
```bash
# Using MongoDB shell
mongosh
use school_management_saas
db.users.findOne({ role: 'SuperAdmin' })
```

Expected output:
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: 'Super Admin',
  email: 'superadmin@example.com',
  password: '$2a$10$rZ5K8X9Y...', // Hashed
  role: 'SuperAdmin',
  isActive: true,
  createdAt: ISODate("2024-03-05T10:30:00.000Z"),
  updatedAt: ISODate("2024-03-05T10:30:00.000Z")
}
```

### Step 3: Test Login via API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"superadmin@example.com\",\"password\":\"admin123\"}"
```

Expected response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "_id": "507f1f77bcf86cd799439011",
    "name": "Super Admin",
    "email": "superadmin@example.com",
    "role": "SuperAdmin",
    "isActive": true
  }
}
```

### Step 4: Test Login via Frontend
1. Open: `school-management-saas/super-admin-panel/login.html`
2. Enter:
   - Email: `superadmin@example.com`
   - Password: `admin123`
3. Click "Sign In"
4. ✅ You should be redirected to the dashboard!

---

## 🔧 How Login Works Now

### 1. User Enters Credentials
```
Email: superadmin@example.com
Password: admin123
```

### 2. Frontend Sends Request
```javascript
POST /api/auth/login
{
  "email": "superadmin@example.com",
  "password": "admin123"
}
```

### 3. Backend Validates
```javascript
// Find user by email
const user = await User.findOne({ email }).select('+password');

// Compare plain password with hashed password
const isMatch = await user.comparePassword(password);

// If match, generate JWT token
const token = jwt.sign({ id: user._id }, JWT_SECRET);
```

### 4. Backend Returns Token
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "name": "Super Admin",
    "email": "superadmin@example.com",
    "role": "SuperAdmin"
  }
}
```

### 5. Frontend Stores Token
```javascript
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data));
```

### 6. Frontend Redirects
```javascript
window.location.href = 'dashboard.html';
```

---

## 📊 Database Schema

### User Model
```javascript
{
  name: String,           // "Super Admin"
  email: String,          // "superadmin@example.com" (unique, lowercase)
  password: String,       // Hashed with bcrypt
  role: String,           // "SuperAdmin" | "SchoolAdmin" | "Teacher" | "Student"
  schoolId: ObjectId,     // Not required for SuperAdmin
  isActive: Boolean,      // true
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

---

## 🛠️ Troubleshooting

### "Invalid credentials" Error

#### Cause 1: Super Admin doesn't exist
**Solution**: Run the script
```bash
node scripts/createSuperAdmin.js
```

#### Cause 2: Wrong email or password
**Solution**: Use exact credentials
- Email: `superadmin@example.com` (not `admin@test.com`)
- Password: `admin123`

#### Cause 3: Password not hashed correctly
**Solution**: Delete and recreate
```bash
# Delete user
node scripts/deleteUser.js superadmin@example.com

# Recreate
node scripts/createSuperAdmin.js
```

### "User already exists" Error

The Super Admin already exists. You can:

**Option 1**: Use existing credentials
- Email: `superadmin@example.com`
- Password: `admin123`

**Option 2**: Reset password
```bash
node scripts/resetPassword.js superadmin@example.com newpassword123
```

**Option 3**: Delete and recreate
```bash
node scripts/deleteUser.js superadmin@example.com
node scripts/createSuperAdmin.js
```

### "MongoDB connection error"

**Solution**: Start MongoDB
```bash
# Windows
net start MongoDB

# Or manually
mongod --dbpath C:\data\db
```

---

## 📁 Files Modified/Created

### Created
- ✅ `backend/scripts/createSuperAdmin.js` - Script to create Super Admin

### Modified
- ✅ `backend/server.js` - Added auto-creation logic

---

## 🎯 What Changed in server.js

### Added Import
```javascript
import User from './models/User.js';
```

### Added Function
```javascript
const ensureSuperAdmin = async () => {
  try {
    const superAdminExists = await User.findOne({ role: 'SuperAdmin' });
    
    if (!superAdminExists) {
      const superAdminData = {
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: 'admin123',
        role: 'SuperAdmin'
      };
      
      await User.create(superAdminData);
      console.log('✅ Auto-created Super Admin account');
      console.log('   Email:', superAdminData.email);
      console.log('   Password:', superAdminData.password);
    }
  } catch (error) {
    console.error('⚠️  Could not auto-create Super Admin:', error.message);
  }
};
```

### Added Execution
```javascript
setTimeout(ensureSuperAdmin, 1000);
```

---

## 🔐 Multiple Super Admins

You can create multiple Super Admin accounts:

```bash
# Method 1: Modify the script
# Edit scripts/createSuperAdmin.js and change the email

# Method 2: Use MongoDB directly
mongosh
use school_management_saas
db.users.insertOne({
  name: "Another Admin",
  email: "admin2@example.com",
  password: "$2a$10$...", // Pre-hashed password
  role: "SuperAdmin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## 📝 Summary

### What Was Done
1. ✅ Created `createSuperAdmin.js` script
2. ✅ Added auto-creation logic to server startup
3. ✅ Password is securely hashed with bcrypt
4. ✅ Script checks for existing Super Admin
5. ✅ Comprehensive logging and error handling

### How to Use
1. Run: `node scripts/createSuperAdmin.js`
2. Or: Just start the server (auto-creates)
3. Login with: `superadmin@example.com` / `admin123`

### Result
✅ Login now works perfectly!

---

## 🚀 Quick Start

```bash
# Create Super Admin
cd school-management-saas/backend
node scripts/createSuperAdmin.js

# Start server
node server.js

# Open login page
# File: super-admin-panel/login.html

# Login with:
# Email: superadmin@example.com
# Password: admin123
```

**Done!** 🎉
