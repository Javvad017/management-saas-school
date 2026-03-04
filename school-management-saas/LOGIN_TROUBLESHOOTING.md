# 🔧 Login Issue Troubleshooting Guide

## Problem: "No user found with email: admin@school.com"

This guide will help you diagnose and fix the login issue step by step.

---

## 🎯 Quick Fix (Most Common Solution)

The issue is likely that **no users exist in your database yet**. Follow these steps:

### Step 1: Navigate to Backend
```bash
cd school-management-saas/backend
```

### Step 2: Run Diagnostic Tool
```bash
npm run diagnose-login admin@school.com admin123
```

This will check:
- ✅ Database connection
- ✅ If any users exist
- ✅ If the specific user exists
- ✅ If password matches
- ✅ If account is active

### Step 3: Create Admin User (if needed)
If the diagnostic shows "NO USERS FOUND", create an admin:

```bash
npm run create-school-admin
```

This creates:
- A demo school
- A school admin user with credentials:
  - Email: `admin@school.com`
  - Password: `admin123`

### Step 4: Test Login
Use Postman or curl:

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "admin123"
}
```

---

## 📋 Detailed Diagnostic Steps

### Check 1: Is MongoDB Running?

**Windows:**
```bash
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongodb
```

**Verify:**
```bash
mongosh
# Should connect without errors
```

---

### Check 2: Is Backend Running?

```bash
cd school-management-saas/backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
Database Name: school_management_saas
Collections in database: users, schools, students, teachers, ...
```

If you see "Collections in database: None" → Database is empty!

---

### Check 3: List All Users

```bash
npm run list-users
```

Expected output if users exist:
```
Total users: 1
1. admin@school.com (SchoolAdmin) - Active: true
```

If output shows "Total users: 0" → No users exist!

---

### Check 4: Run Full Diagnostic

```bash
npm run diagnose-login admin@school.com admin123
```

This comprehensive tool checks everything and tells you exactly what's wrong.

---

## 🛠️ Available Helper Scripts

All scripts are in `backend/package.json`:

### 1. Create School Admin
```bash
npm run create-school-admin
```
Creates a school and admin user with default credentials.

### 2. List All Users
```bash
npm run list-users
```
Shows all users in the database.

### 3. Diagnose Login
```bash
npm run diagnose-login <email> <password>
```
Full diagnostic of login process.

### 4. Reset Password
```bash
npm run reset-password admin@school.com newpassword123
```
Changes password for existing user.

### 5. Delete User
```bash
npm run delete-user admin@school.com
```
Removes user from database (use carefully!).

### 6. Test Login
```bash
npm run test-login
```
Automated login test with default credentials.

---

## 🔍 Understanding the Error

### Error Message:
```
Login failed: No user found with email: admin@school.com
ErrorResponse: Invalid credentials
```

### What This Means:
The backend searched the database for a user with email `admin@school.com` but found nothing.

### Common Causes:

1. **No users in database** (90% of cases)
   - Solution: Run `npm run create-school-admin`

2. **Wrong email**
   - Check for typos
   - Email is case-insensitive but must match exactly
   - Solution: Run `npm run list-users` to see actual emails

3. **Wrong database**
   - Check `backend/.env` → `MONGODB_URI`
   - Should be: `mongodb://localhost:27017/school_management_saas`
   - Solution: Verify database name in connection string

4. **User was deleted**
   - Solution: Recreate with `npm run create-school-admin`

---

## 🧪 Testing with Postman

### 1. Start Backend
```bash
cd school-management-saas/backend
npm run dev
```

### 2. Create Admin (if needed)
```bash
npm run create-school-admin
```

### 3. Test Login in Postman

**Request:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "admin@school.com",
  "password": "admin123"
}
```

**Expected Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123...",
    "name": "School Admin",
    "email": "admin@school.com",
    "role": "SchoolAdmin",
    "schoolId": "65abc456...",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Expected Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

---

## 🔐 Understanding the Authentication Flow

### What Happens During Login:

1. **Email Normalization**
   - Input: `Admin@School.COM`
   - Normalized: `admin@school.com` (lowercase, trimmed)

2. **Database Search**
   - Searches for user with normalized email
   - Includes password field (normally hidden)

3. **User Validation**
   - Checks if user exists → If not, returns "Invalid credentials"
   - Checks if account is active → If not, returns "Account deactivated"

4. **Password Verification**
   - Uses bcrypt to compare entered password with hashed password
   - If mismatch, returns "Invalid credentials"

5. **Token Generation**
   - Creates JWT with user ID, role, and schoolId
   - Token expires in 7 days (configurable in .env)

6. **Response**
   - Returns user data + token
   - Frontend stores token in localStorage
   - Token used for subsequent authenticated requests

---

## 📊 Debug Logging

The login controller has comprehensive logging. When you attempt login, you'll see:

```
=== LOGIN ATTEMPT ===
Email being searched: admin@school.com
Total users in database: 1
Existing users: admin@school.com (SchoolAdmin)
User found: admin@school.com, role: SchoolAdmin
Login successful for email: admin@school.com, role: SchoolAdmin
=== END LOGIN ATTEMPT ===
```

If user doesn't exist:
```
=== LOGIN ATTEMPT ===
Email being searched: admin@school.com
Total users in database: 0
Existing users: 
Login failed: No user found with email: admin@school.com
=== END LOGIN ATTEMPT ===
```

---

## 🎯 Step-by-Step Resolution

### Scenario 1: Fresh Installation (No Users)

```bash
# 1. Navigate to backend
cd school-management-saas/backend

# 2. Install dependencies
npm install

# 3. Start MongoDB
# Windows: net start MongoDB
# Mac: brew services start mongodb-community

# 4. Start backend
npm run dev

# 5. Create admin (in new terminal)
npm run create-school-admin

# 6. Test login
npm run test-login
```

---

### Scenario 2: User Exists But Wrong Password

```bash
# 1. Diagnose
npm run diagnose-login admin@school.com admin123

# 2. If password wrong, reset it
npm run reset-password admin@school.com newpassword123

# 3. Test with new password
npm run diagnose-login admin@school.com newpassword123
```

---

### Scenario 3: Multiple Users, Unsure Which to Use

```bash
# 1. List all users
npm run list-users

# Output shows:
# 1. admin@school.com (SchoolAdmin)
# 2. teacher@school.com (Teacher)
# 3. student@school.com (Student)

# 2. Test each one
npm run diagnose-login admin@school.com admin123
```

---

### Scenario 4: Database Connection Issues

```bash
# 1. Check MongoDB is running
mongosh

# 2. Check connection string in .env
cat backend/.env
# Should show: MONGODB_URI=mongodb://localhost:27017/school_management_saas

# 3. Test connection
npm run dev
# Look for: "MongoDB Connected: localhost"
```

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Not Creating Users First
**Problem:** Trying to login without creating any users  
**Solution:** Run `npm run create-school-admin`

### ❌ Mistake 2: Wrong Database
**Problem:** Backend connects to different database than expected  
**Solution:** Check `MONGODB_URI` in `.env`

### ❌ Mistake 3: MongoDB Not Running
**Problem:** Backend can't connect to MongoDB  
**Solution:** Start MongoDB service

### ❌ Mistake 4: Wrong Port
**Problem:** Frontend calls wrong backend URL  
**Solution:** Verify backend runs on port 5000

### ❌ Mistake 5: Typo in Email
**Problem:** Email has extra spaces or wrong casing  
**Solution:** Use `npm run list-users` to see exact emails

---

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] MongoDB is running (`mongosh` connects successfully)
- [ ] Backend is running (`npm run dev` shows "MongoDB Connected")
- [ ] At least one user exists (`npm run list-users` shows users)
- [ ] Diagnostic passes (`npm run diagnose-login` shows all green checks)
- [ ] Postman test works (login returns token)
- [ ] Correct credentials used (email + password match database)

---

## 🎓 Understanding the Code

### User Model (models/User.js)
```javascript
// Email is stored lowercase and trimmed
email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,  // Converts to lowercase
  trim: true        // Removes whitespace
}

// Password is hashed before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

### Login Controller (controllers/authController.js)
```javascript
// Normalize email before search
email = email.toLowerCase().trim();

// Find user with password field
const user = await User.findOne({ email }).select('+password');

// Compare passwords
const isMatch = await user.comparePassword(password);
```

---

## 📞 Quick Reference Commands

```bash
# Create admin user
npm run create-school-admin

# List all users
npm run list-users

# Diagnose login issue
npm run diagnose-login <email> <password>

# Reset password
npm run reset-password <email> <newpassword>

# Delete user
npm run delete-user <email>

# Test login
npm run test-login
```

---

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ Diagnostic shows all green checks
2. ✅ Postman returns 200 status with token
3. ✅ Backend logs show "Login successful"
4. ✅ Frontend can login and access dashboard

---

## 📚 Related Documentation

- [QUICK_START.md](QUICK_START.md) - Initial setup
- [API_EXAMPLES.md](API_EXAMPLES.md) - API reference
- [AUTH_QUICK_REFERENCE.md](AUTH_QUICK_REFERENCE.md) - Auth system overview
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing procedures

---

**Last Updated:** March 4, 2026  
**Status:** Active Issue Resolution Guide

**Need more help?** Run the diagnostic tool first: `npm run diagnose-login`
