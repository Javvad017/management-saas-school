# 🔍 Login Diagnostic Flow

## Visual Troubleshooting Guide

```
┌─────────────────────────────────────────┐
│  START: Login Issue                     │
│  "No user found with email"             │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  Step 1: Is MongoDB Running?            │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
        YES                 NO
         │                   │
         │                   ▼
         │         ┌──────────────────────┐
         │         │ Start MongoDB:       │
         │         │ Windows: net start   │
         │         │ Mac: brew services   │
         │         │ Linux: systemctl     │
         │         └──────────┬───────────┘
         │                    │
         └────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  Step 2: Is Backend Running?            │
│  Run: npm run dev                       │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
        YES                 NO
         │                   │
         │                   ▼
         │         ┌──────────────────────┐
         │         │ cd backend           │
         │         │ npm install          │
         │         │ npm run dev          │
         │         └──────────┬───────────┘
         │                    │
         └────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  Step 3: Run Diagnostic                 │
│  npm run diagnose-login                 │
│  admin@school.com admin123              │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ALL CHECKS              FAILED
      PASS                   │
         │                   │
         │                   ▼
         │         ┌──────────────────────┐
         │         │ What Failed?         │
         │         └──────────┬───────────┘
         │                    │
         │         ┌──────────┼──────────┬──────────┐
         │         │          │          │          │
         │    NO USERS    USER NOT   WRONG     ACCOUNT
         │     FOUND      FOUND    PASSWORD  INACTIVE
         │         │          │          │          │
         │         ▼          ▼          ▼          ▼
         │    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
         │    │CREATE  │ │LIST    │ │RESET   │ │CONTACT │
         │    │ADMIN   │ │USERS   │ │PASS    │ │ADMIN   │
         │    └───┬────┘ └───┬────┘ └───┬────┘ └────────┘
         │        │          │          │
         │        └──────────┴──────────┘
         │                   │
         └───────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  Step 4: Test Login                     │
│  npm run test-login                     │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
      SUCCESS              FAIL
         │                   │
         ▼                   ▼
┌──────────────┐   ┌──────────────────────┐
│   DONE! ✅   │   │ See Full Guide:      │
│              │   │ LOGIN_TROUBLESHOOTING│
└──────────────┘   └──────────────────────┘
```

---

## Decision Tree

### 1. MongoDB Not Running?
```
Problem: Can't connect to database
Solution: Start MongoDB service
Command: net start MongoDB (Windows)
         brew services start mongodb-community (Mac)
         sudo systemctl start mongodb (Linux)
```

### 2. Backend Not Running?
```
Problem: API not accessible
Solution: Start backend server
Commands:
  cd school-management-saas/backend
  npm install
  npm run dev
```

### 3. No Users in Database?
```
Problem: Database is empty
Solution: Create admin user
Command: npm run create-school-admin
Result: Creates admin@school.com with password admin123
```

### 4. User Not Found?
```
Problem: Email doesn't exist
Solution: List users and verify email
Command: npm run list-users
Then: Use correct email or create new user
```

### 5. Wrong Password?
```
Problem: Password doesn't match
Solution: Reset password
Command: npm run reset-password admin@school.com newpass123
```

### 6. Account Inactive?
```
Problem: User account is deactivated
Solution: Contact system administrator
Note: This is a security feature
```

---

## Quick Diagnostic Commands

### Run Full Diagnostic
```bash
cd school-management-saas/backend
npm run diagnose-login admin@school.com admin123
```

### Expected Output (Success)
```
=== LOGIN DIAGNOSTIC TOOL ===

✅ MongoDB Connected
Database: school_management_saas
-----------------------------------

Testing login for:
Email: admin@school.com
Password: admin123
-----------------------------------

Step 1: Checking database...
Total users in database: 1

Step 2: Listing all users...
1. admin@school.com (SchoolAdmin) - Active: true

Step 3: Searching for user...
Normalized email: admin@school.com
✅ User found!
Email: admin@school.com
Role: SchoolAdmin
Active: true
Has Password: true

Step 4: Checking account status...
✅ Account is active

Step 5: Testing password...
✅ Password matches!

=== DIAGNOSTIC SUMMARY ===
✅ Database connected
✅ User exists
✅ Account is active
✅ Password is correct

🎉 LOGIN SHOULD WORK!
```

### Expected Output (No Users)
```
=== LOGIN DIAGNOSTIC TOOL ===

✅ MongoDB Connected
Database: school_management_saas
-----------------------------------

Step 1: Checking database...
Total users in database: 0

❌ NO USERS FOUND IN DATABASE!

To create a school admin, run:
npm run create-school-admin
```

---

## Troubleshooting Matrix

| Symptom | Cause | Solution | Command |
|---------|-------|----------|---------|
| Can't connect to MongoDB | MongoDB not running | Start MongoDB | `net start MongoDB` |
| Backend won't start | Dependencies not installed | Install packages | `npm install` |
| "No users found" | Empty database | Create admin | `npm run create-school-admin` |
| "User not found" | Wrong email | List users | `npm run list-users` |
| "Invalid credentials" | Wrong password | Reset password | `npm run reset-password` |
| "Account deactivated" | User inactive | Contact admin | Manual database update |
| Port 5000 in use | Another process | Change port | Edit `.env` file |

---

## Step-by-Step Resolution Path

### Path A: Fresh Installation (Recommended)
```bash
# 1. Ensure MongoDB is running
mongosh  # Should connect

# 2. Navigate to backend
cd school-management-saas/backend

# 3. Install dependencies
npm install

# 4. Start backend
npm run dev

# 5. Create admin (in new terminal)
npm run create-school-admin

# 6. Test login
npm run test-login

# 7. Verify in Postman
POST http://localhost:5000/api/auth/login
Body: {"email":"admin@school.com","password":"admin123"}
```

### Path B: Existing Installation (Has Issues)
```bash
# 1. Run diagnostic
cd school-management-saas/backend
npm run diagnose-login admin@school.com admin123

# 2. Follow diagnostic recommendations
# If no users: npm run create-school-admin
# If wrong password: npm run reset-password
# If wrong email: npm run list-users

# 3. Test again
npm run test-login
```

### Path C: Complete Reset (Nuclear Option)
```bash
# 1. Stop backend (Ctrl+C)

# 2. Drop database (WARNING: Deletes all data!)
mongosh
use school_management_saas
db.dropDatabase()
exit

# 3. Restart backend
npm run dev

# 4. Create fresh admin
npm run create-school-admin

# 5. Test
npm run test-login
```

---

## Common Error Messages Decoded

### Error 1: "No user found with email"
```
Meaning: Database search returned no results
Cause: User doesn't exist in database
Fix: Create user with npm run create-school-admin
```

### Error 2: "Invalid credentials"
```
Meaning: Generic auth failure (security measure)
Causes: 
  - User doesn't exist
  - Wrong password
  - Email typo
Fix: Run diagnostic to identify specific cause
```

### Error 3: "Account is deactivated"
```
Meaning: User exists but isActive = false
Cause: Account was manually deactivated
Fix: Contact administrator or update database
```

### Error 4: "Please provide email and password"
```
Meaning: Missing required fields
Cause: Empty email or password in request
Fix: Ensure both fields are provided
```

### Error 5: "MongoServerError: connect ECONNREFUSED"
```
Meaning: Can't connect to MongoDB
Cause: MongoDB service not running
Fix: Start MongoDB service
```

---

## Verification Checklist

Use this checklist to verify each component:

### MongoDB
- [ ] Service is running
- [ ] Can connect with `mongosh`
- [ ] Database `school_management_saas` exists
- [ ] Collections are visible

### Backend
- [ ] Server starts without errors
- [ ] Shows "MongoDB Connected"
- [ ] Shows database name and collections
- [ ] Responds to http://localhost:5000

### Users
- [ ] At least one user exists
- [ ] User email is correct (lowercase)
- [ ] User password is hashed (not plain text)
- [ ] User account is active

### Login
- [ ] Diagnostic passes all checks
- [ ] Postman returns 200 status
- [ ] Response includes token
- [ ] Token is valid JWT

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│  QUICK REFERENCE: Login Issue Resolution                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Run Diagnostic:                                     │
│     npm run diagnose-login admin@school.com admin123    │
│                                                          │
│  2. Create Admin:                                       │
│     npm run create-school-admin                         │
│                                                          │
│  3. List Users:                                         │
│     npm run list-users                                  │
│                                                          │
│  4. Reset Password:                                     │
│     npm run reset-password <email> <newpass>            │
│                                                          │
│  5. Test Login:                                         │
│     npm run test-login                                  │
│                                                          │
│  Default Credentials:                                   │
│     Email: admin@school.com                             │
│     Password: admin123                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Next Steps After Resolution

Once login works:

1. ✅ Test in Postman
2. ✅ Test in Admin Desktop app
3. ✅ Test in User Website
4. ✅ Create additional users (teachers, students)
5. ✅ Change default passwords
6. ✅ Remove debug logging (optional)

---

## Related Documentation

- **Quick Fix:** [QUICK_FIX_LOGIN.md](QUICK_FIX_LOGIN.md)
- **Full Guide:** [LOGIN_TROUBLESHOOTING.md](LOGIN_TROUBLESHOOTING.md)
- **API Reference:** [API_EXAMPLES.md](API_EXAMPLES.md)
- **Auth System:** [AUTH_QUICK_REFERENCE.md](AUTH_QUICK_REFERENCE.md)

---

**Last Updated:** March 4, 2026  
**Purpose:** Visual guide for login issue resolution
