# 📋 Command Cheat Sheet

Quick reference for all backend commands and scripts.

---

## 🚀 Server Commands

### Start Backend (Development)
```bash
cd school-management-saas/backend
npm run dev
```
Starts server with nodemon (auto-restart on changes)

### Start Backend (Production)
```bash
npm start
```
Starts server with node (no auto-restart)

---

## 👤 User Management Commands

### Create School Admin
```bash
npm run create-school-admin
```
**What it does:**
- Creates a demo school
- Creates admin user: admin@school.com / admin123
- Links admin to school

**When to use:**
- Fresh installation
- Need default admin account
- Database is empty

---

### List All Users
```bash
npm run list-users
```
**What it does:**
- Shows all users in database
- Displays email, role, and active status

**When to use:**
- Check what users exist
- Verify user creation
- Find correct email addresses

**Example output:**
```
Total users: 3
1. admin@school.com (SchoolAdmin) - Active: true
2. teacher@school.com (Teacher) - Active: true
3. student@school.com (Student) - Active: true
```

---

### Reset Password
```bash
npm run reset-password <email> <newpassword>
```
**Examples:**
```bash
npm run reset-password admin@school.com newpass123
npm run reset-password teacher@school.com teacher456
```

**What it does:**
- Changes password for existing user
- Properly hashes new password
- Confirms success

**When to use:**
- Forgot password
- Need to change password
- Password not working

---

### Delete User
```bash
npm run delete-user <email>
```
**Example:**
```bash
npm run delete-user admin@school.com
```

**What it does:**
- Removes user from database
- Permanent deletion (use carefully!)

**When to use:**
- Remove test accounts
- Clean up before recreation
- Delete unwanted users

⚠️ **Warning:** This is permanent! User data will be lost.

---

## 🔍 Diagnostic Commands

### Full Login Diagnostic
```bash
npm run diagnose-login <email> <password>
```
**Examples:**
```bash
npm run diagnose-login admin@school.com admin123
npm run diagnose-login teacher@school.com teacher123
```

**What it checks:**
1. ✅ MongoDB connection
2. ✅ Database name
3. ✅ Total users count
4. ✅ User exists
5. ✅ Account is active
6. ✅ Password matches

**When to use:**
- Login not working
- Need to troubleshoot
- Verify setup

**Example output (success):**
```
=== LOGIN DIAGNOSTIC TOOL ===
✅ MongoDB Connected
✅ User found!
✅ Account is active
✅ Password matches!
🎉 LOGIN SHOULD WORK!
```

**Example output (failure):**
```
=== LOGIN DIAGNOSTIC TOOL ===
✅ MongoDB Connected
Total users in database: 0
❌ NO USERS FOUND IN DATABASE!

To create a school admin, run:
npm run create-school-admin
```

---

### Test Login
```bash
npm run test-login
```
**What it does:**
- Automated login test
- Uses default credentials (admin@school.com / admin123)
- Shows success or failure

**When to use:**
- Quick login verification
- After creating admin
- After fixing issues

---

## 🗄️ MongoDB Commands

### Start MongoDB

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

---

### Stop MongoDB

**Windows:**
```bash
net stop MongoDB
```

**Mac:**
```bash
brew services stop mongodb-community
```

**Linux:**
```bash
sudo systemctl stop mongodb
```

---

### Connect to MongoDB Shell
```bash
mongosh
```

**Useful MongoDB Shell Commands:**
```javascript
// Show databases
show dbs

// Use school database
use school_management_saas

// Show collections
show collections

// Count users
db.users.countDocuments()

// List all users
db.users.find({}, {email: 1, role: 1})

// Find specific user
db.users.findOne({email: "admin@school.com"})

// Delete all users (careful!)
db.users.deleteMany({})

// Drop entire database (very careful!)
db.dropDatabase()
```

---

## 📦 Package Management

### Install Dependencies
```bash
npm install
```

### Update Dependencies
```bash
npm update
```

### Check for Outdated Packages
```bash
npm outdated
```

---

## 🧪 Testing Commands

### Test with Postman

**Login:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "admin123"
}
```

**Register:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "New User",
  "email": "newuser@school.com",
  "password": "password123",
  "role": "Student",
  "schoolId": "65abc123..."
}
```

---

### Test with curl

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"admin123"}'
```

**Get Current User:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔧 Troubleshooting Commands

### Check if Backend is Running
```bash
curl http://localhost:5000
```
Should return: "School Management API is running"

### Check MongoDB Connection
```bash
mongosh --eval "db.adminCommand('ping')"
```
Should return: `{ ok: 1 }`

### Check Port Usage

**Windows:**
```bash
netstat -ano | findstr :5000
```

**Mac/Linux:**
```bash
lsof -i :5000
```

### Kill Process on Port

**Windows:**
```bash
# Find PID first
netstat -ano | findstr :5000
# Then kill (replace PID)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
kill -9 $(lsof -t -i:5000)
```

---

## 📊 Common Workflows

### Fresh Installation Setup
```bash
# 1. Start MongoDB
net start MongoDB  # Windows
brew services start mongodb-community  # Mac

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
```

---

### Fix Login Issue
```bash
# 1. Run diagnostic
npm run diagnose-login admin@school.com admin123

# 2. Follow recommendations
# If no users:
npm run create-school-admin

# If wrong password:
npm run reset-password admin@school.com newpass123

# If wrong email:
npm run list-users

# 3. Test again
npm run test-login
```

---

### Create New School Admin
```bash
# 1. Delete old admin (if exists)
npm run delete-user admin@school.com

# 2. Create new admin
npm run create-school-admin

# 3. Verify
npm run list-users

# 4. Test login
npm run diagnose-login admin@school.com admin123
```

---

### Reset Everything (Nuclear Option)
```bash
# 1. Stop backend (Ctrl+C)

# 2. Drop database
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

## 🎯 Quick Reference Table

| Task | Command |
|------|---------|
| Start backend | `npm run dev` |
| Create admin | `npm run create-school-admin` |
| List users | `npm run list-users` |
| Diagnose login | `npm run diagnose-login <email> <pass>` |
| Reset password | `npm run reset-password <email> <newpass>` |
| Delete user | `npm run delete-user <email>` |
| Test login | `npm run test-login` |
| Start MongoDB | `net start MongoDB` (Windows) |
| MongoDB shell | `mongosh` |
| Check backend | `curl http://localhost:5000` |

---

## 🔑 Default Credentials

After running `npm run create-school-admin`:

| Field | Value |
|-------|-------|
| Email | admin@school.com |
| Password | admin123 |
| Role | SchoolAdmin |
| School | Demo School |

---

## 📍 Important Paths

| Component | Path |
|-----------|------|
| Backend | `school-management-saas/backend/` |
| Scripts | `school-management-saas/backend/scripts/` |
| Models | `school-management-saas/backend/models/` |
| Controllers | `school-management-saas/backend/controllers/` |
| Routes | `school-management-saas/backend/routes/` |
| Config | `school-management-saas/backend/config/` |
| Env file | `school-management-saas/backend/.env` |

---

## 🌐 Important URLs

| Service | URL |
|---------|-----|
| Backend API | http://localhost:5000 |
| User Website | http://localhost:3000 |
| MongoDB | mongodb://localhost:27017 |
| Database | school_management_saas |

---

## 📚 Documentation Links

| Document | Purpose |
|----------|---------|
| [START_HERE.md](START_HERE.md) | Getting started guide |
| [QUICK_FIX_LOGIN.md](QUICK_FIX_LOGIN.md) | Quick login fix |
| [LOGIN_TROUBLESHOOTING.md](LOGIN_TROUBLESHOOTING.md) | Full troubleshooting |
| [LOGIN_DIAGNOSTIC_FLOW.md](LOGIN_DIAGNOSTIC_FLOW.md) | Visual flowchart |
| [API_EXAMPLES.md](API_EXAMPLES.md) | API reference |
| [README.md](README.md) | Project overview |

---

## 💡 Pro Tips

### Tip 1: Keep Backend Running
Always keep backend running in one terminal while working.

### Tip 2: Use Diagnostic First
When login fails, run diagnostic before trying fixes.

### Tip 3: Check MongoDB First
Many issues are just MongoDB not running.

### Tip 4: List Users Often
Use `npm run list-users` to verify what accounts exist.

### Tip 5: Save Tokens
When testing in Postman, save the token for authenticated requests.

### Tip 6: Use Environment Variables
In Postman, create environment with:
- `baseUrl`: http://localhost:5000
- `token`: (paste token after login)

### Tip 7: Check Logs
Backend logs show exactly what's happening during login.

### Tip 8: Fresh Start
If confused, drop database and start fresh.

---

## ⚠️ Common Mistakes

### ❌ Mistake 1: MongoDB Not Running
**Error:** "MongoServerError: connect ECONNREFUSED"  
**Fix:** Start MongoDB service

### ❌ Mistake 2: Wrong Directory
**Error:** "Cannot find module"  
**Fix:** Ensure you're in `backend/` directory

### ❌ Mistake 3: No Users Created
**Error:** "No user found"  
**Fix:** Run `npm run create-school-admin`

### ❌ Mistake 4: Wrong Port
**Error:** "EADDRINUSE"  
**Fix:** Kill process on port 5000 or change port

### ❌ Mistake 5: Forgot npm install
**Error:** "Cannot find module 'express'"  
**Fix:** Run `npm install`

---

## 🎓 Learning Resources

### Node.js
- [Node.js Docs](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### MongoDB
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Docs](https://mongoosejs.com/docs/)

### Authentication
- [JWT.io](https://jwt.io/)
- [bcrypt Docs](https://www.npmjs.com/package/bcryptjs)

---

**Last Updated:** March 4, 2026  
**Version:** 1.0.0  

**Print this page for quick reference!** 📄
