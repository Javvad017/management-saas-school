# 🚀 Quick Reference Card

## Start Backend
```bash
cd backend
npm start
```

## Test System
```bash
cd backend
node scripts/testRoleSystem.js
```

---

## 🔑 Roles

| Role | Platform | Key Features |
|------|----------|-------------|
| SuperAdmin | Web | Schools, Revenue, Subscriptions |
| SchoolAdmin | Desktop | Students, Teachers, Fees, Exams |
| Teacher | Web | Attendance, Homework, Marks |
| Student | Web | View Only (Dashboard, Fees, Results) |

---

## 📡 Key Endpoints

### Super Admin
```
POST   /api/schools              Create school
GET    /api/revenue              Revenue dashboard
POST   /api/revenue/subscriptions Create subscription
```

### School Admin
```
POST   /api/students             Add student
POST   /api/teachers             Add teacher
POST   /api/fees                 Create fee
POST   /api/exams                Create exam
POST   /api/announcements        Create announcement
```

### Teacher
```
POST   /api/attendance/mark      Mark attendance
POST   /api/homework             Create homework
GET    /api/students             View students
```

### Student
```
GET    /api/student/dashboard    Dashboard
GET    /api/student/attendance   Attendance + stats
GET    /api/student/fees         Fees + summary
GET    /api/student/results      Exam results
GET    /api/student/homework     Homework
```

---

## 🔒 Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Use Token
```http
GET /api/students
Authorization: Bearer <your_token_here>
```

---

## 🗄️ Collections

```
users          - All users (4 roles)
schools        - School info
students       - Student profiles
teachers       - Teacher profiles
attendance     - Attendance records
fees           - Fee records
exams          - Exam info
results        - Exam results
homework       - Homework assignments
announcements  - Announcements
subscriptions  - School subscriptions
```

---

## 🧪 Quick Test

```bash
# 1. Create super admin
node scripts/createAdmin.js

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@example.com","password":"admin123"}'

# 3. Create school (use token from step 2)
curl -X POST http://localhost:5000/api/schools \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Test School",
    "address": "123 Main St",
    "phone": "1234567890",
    "email": "school@test.com",
    "adminName": "Admin",
    "adminEmail": "admin@test.com",
    "adminPassword": "admin123"
  }'
```

---

## 📚 Documentation

- **[ROLE_SYSTEM_COMPLETE.md](./ROLE_SYSTEM_COMPLETE.md)** - Overview
- **[COMPLETE_API_REFERENCE.md](./COMPLETE_API_REFERENCE.md)** - All endpoints
- **[ROLE_SYSTEM_VISUAL_GUIDE.md](./ROLE_SYSTEM_VISUAL_GUIDE.md)** - Visual diagrams
- **[README.md](./README.md)** - Main documentation

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
mongosh

# Check .env file exists
cat backend/.env

# Install dependencies
cd backend && npm install
```

### Login fails
```bash
# List users
node scripts/listUsers.js

# Reset password
node scripts/resetPassword.js <email> <newpassword>

# Test login
node scripts/testLogin.js <email> <password>
```

### Data not showing
```bash
# Test role system
node scripts/testRoleSystem.js

# Check schoolId matches
# User's schoolId must match data's schoolId
```

---

## 💡 Tips

1. **Always use JWT token** in Authorization header
2. **Check user role** matches endpoint requirements
3. **Verify schoolId** for data isolation
4. **Use test scripts** for quick debugging
5. **Check console logs** for detailed errors

---

## 🎯 Common Tasks

### Add Student
1. Login as SchoolAdmin
2. POST /api/students with student data
3. Student can now login with generated credentials

### Mark Attendance
1. Login as Teacher
2. POST /api/attendance/mark with studentId, date, status

### View Student Dashboard
1. Login as Student
2. GET /api/student/dashboard
3. Returns all student data in one call

---

## 📞 Need Help?

Run the test script:
```bash
node scripts/testRoleSystem.js
```

Check the logs:
```bash
# Backend logs show detailed info
# Look for "=== LOGIN ATTEMPT ===" messages
```

---

**Backend Status: ✅ 100% Complete & Production Ready**
