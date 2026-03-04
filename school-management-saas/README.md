# School Management SaaS System

A complete multi-tenant School Management SaaS with role-based access control, supporting Super Admin, School Admin, Teachers, and Students.

## 🎯 System Architecture

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Super Admin     │  │  Admin Desktop   │  │  Teacher Portal  │  │  Student Portal  │
│  Panel (React)   │  │  (Electron)      │  │  (React)         │  │  (React)         │
│  Port 5173       │  │                  │  │  Port 3000       │  │  Port 3001       │
└────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
         │                     │                     │                     │
         └─────────────────────┴─────────────────────┴─────────────────────┘
                                        │
                                        ▼
                              ┌──────────────────┐
                              │  Backend API     │
                              │  (Express)       │
                              │  Port 5000       │
                              └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │    MongoDB       │
                              │  Port 27017      │
                              └──────────────────┘
```

## ✨ Role-Based System

### 🔑 Four Distinct Roles

| Role | Platform | Capabilities |
|------|----------|-------------|
| **Super Admin** | Web Panel | Manage schools, subscriptions, revenue |
| **School Admin** | Electron Desktop | Manage students, teachers, fees, exams |
| **Teacher** | Web Portal | Mark attendance, create homework, enter marks |
| **Student** | Web Portal | View attendance, fees, results, homework |

## 🚀 Features

### ✅ Backend API (100% Complete)
- ✅ JWT Authentication with role-based tokens
- ✅ 4 roles: SuperAdmin, SchoolAdmin, Teacher, Student
- ✅ Multi-tenant architecture with schoolId isolation
- ✅ 11 database models
- ✅ 12 controllers with full CRUD operations
- ✅ RESTful API with 50+ endpoints
- ✅ Centralized error handling
- ✅ Password hashing with bcrypt
- ✅ Revenue management system
- ✅ Homework & announcement systems
- ✅ Student portal endpoints

### 🎓 Super Admin Panel (React)
- Create and manage schools
- Assign school administrators
- View revenue dashboard
- Manage subscriptions
- Platform-wide analytics
- Block/activate schools

### 🏫 Admin Desktop (Electron)
- Complete student management (CRUD)
- Complete teacher management (CRUD)
- Attendance marking and reports
- Fee management and tracking
- Exam creation and management
- Result publishing
- Announcement system
- Dashboard with statistics

### 👨‍🏫 Teacher Portal (React)
- Mark student attendance
- Create and manage homework
- Enter exam marks
- View class roster
- View announcements

### 👨‍🎓 Student Portal (React)
- Personal dashboard
- View attendance with statistics
- Check fee status and history
- View exam results
- Access homework assignments
- Receive announcements
- View notifications

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Super Admin Panel**: React, Vite, Axios, React Router
- **Admin Desktop**: Electron.js, Axios
- **Teacher Portal**: React, Vite, Axios, React Router
- **Student Portal**: React, Vite, Axios, React Router
- **Authentication**: JWT, bcryptjs
- **Database**: MongoDB
- **API Architecture**: RESTful with role-based access control

## Project Structure

```
school-management-saas/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── schoolController.js
│   │   ├── studentController.js
│   │   ├── teacherController.js
│   │   ├── attendanceController.js
│   │   ├── feeController.js
│   │   └── dashboardController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── School.js
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   ├── Attendance.js
│   │   └── Fee.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── schoolRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── teacherRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── feeRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── asyncHandler.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── errorResponse.js
│   │   └── generateToken.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── user-website/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Attendance.jsx
│   │   │   └── Fees.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── admin-desktop/
    ├── main.js
    ├── renderer.js
    ├── index.html
    ├── styles.css
    └── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## Installation & Setup

### 1. Install MongoDB

**Windows:**
Download from https://www.mongodb.com/try/download/community

**Mac:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

Start backend:
```bash
npm run dev
```

Backend will run on: http://localhost:5000

### 3. User Website Setup

```bash
cd user-website
npm install
npm run dev
```

Website will run on: http://localhost:3000

### 4. Admin Desktop Setup

```bash
cd admin-desktop
npm install
npm start
```

## 📚 API Documentation

### Quick Links
- **[Complete API Reference](./COMPLETE_API_REFERENCE.md)** - All 50+ endpoints with examples
- **[Role System Guide](./ROLE_SYSTEM_IMPLEMENTATION_GUIDE.md)** - Complete implementation details
- **[Postman Testing Guide](./POSTMAN_TESTING_GUIDE.md)** - Testing workflows

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

#### Super Admin (SuperAdmin only)
- `POST /api/schools` - Create school
- `GET /api/schools` - Get all schools
- `GET /api/revenue` - Revenue dashboard
- `POST /api/revenue/subscriptions` - Create subscription

#### School Admin (SchoolAdmin only)
- `POST /api/students` - Create student
- `POST /api/teachers` - Create teacher
- `POST /api/fees` - Create fee
- `POST /api/exams` - Create exam
- `POST /api/announcements` - Create announcement

#### Teacher (Teacher/SchoolAdmin)
- `POST /api/attendance/mark` - Mark attendance
- `POST /api/homework` - Create homework
- `GET /api/students` - View students

#### Student Portal (Student only)
- `GET /api/student/dashboard` - Student dashboard
- `GET /api/student/attendance` - View attendance with stats
- `GET /api/student/fees` - View fees with summary
- `GET /api/student/results` - View exam results
- `GET /api/student/homework` - View homework
- `GET /api/student/announcements` - View announcements

**See [COMPLETE_API_REFERENCE.md](./COMPLETE_API_REFERENCE.md) for all endpoints**

## Default Credentials

After setting up, create a SuperAdmin user manually in MongoDB or use the register endpoint:

```json
{
  "name": "Super Admin",
  "email": "admin@school.com",
  "password": "admin123",
  "role": "SuperAdmin"
}
```

## Testing the System

### Quick Start Testing

```bash
# 1. Test the role system
cd backend
node scripts/testRoleSystem.js

# 2. Create Super Admin (if needed)
node scripts/createAdmin.js

# 3. Start backend
npm start
```

### 1. Create SuperAdmin
```bash
POST http://localhost:5000/api/auth/register
{
  "name": "Super Admin",
  "email": "superadmin@test.com",
  "password": "password123",
  "role": "SuperAdmin"
}
```

### 2. Create School
```bash
POST http://localhost:5000/api/schools
Authorization: Bearer <superadmin_token>
{
  "name": "ABC School",
  "address": "123 Main St",
  "phone": "1234567890",
  "email": "abc@school.com",
  "adminName": "School Admin",
  "adminEmail": "admin@abc.com",
  "adminPassword": "admin123"
}
```

### 3. Login as School Admin
```bash
POST http://localhost:5000/api/auth/login
{
  "email": "admin@abc.com",
  "password": "admin123"
}
```

### 4. Create Student
```bash
POST http://localhost:5000/api/students
Authorization: Bearer <schooladmin_token>
{
  "name": "John Doe",
  "email": "john@student.com",
  "password": "student123",
  "rollNumber": "001",
  "class": "10",
  "section": "A",
  "dateOfBirth": "2010-01-01",
  "parentName": "Parent Name",
  "parentPhone": "9876543210",
  "address": "Student Address"
}
```

## 📖 Documentation

### 🎯 Start Here
- **[COMPLETE_IMPLEMENTATION_ROADMAP.md](./COMPLETE_IMPLEMENTATION_ROADMAP.md)** - Complete roadmap
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Quick reference card
- **[ROLE_SYSTEM_COMPLETE.md](./ROLE_SYSTEM_COMPLETE.md)** - Backend overview

### 🎨 Frontend Guides (NEW)
- **[FRONTEND_IMPLEMENTATION_GUIDE.md](./FRONTEND_IMPLEMENTATION_GUIDE.md)** - Overview
- **[STUDENT_PORTAL_GUIDE.md](./STUDENT_PORTAL_GUIDE.md)** - Student Portal (Priority 1)
- **[SUPER_ADMIN_PANEL_GUIDE.md](./SUPER_ADMIN_PANEL_GUIDE.md)** - Super Admin Panel
- **[ADMIN_DESKTOP_GUIDE.md](./ADMIN_DESKTOP_GUIDE.md)** - Admin Desktop
- **[TEACHER_PORTAL_GUIDE.md](./TEACHER_PORTAL_GUIDE.md)** - Teacher Portal

### 📚 Backend Documentation
- **[COMPLETE_API_REFERENCE.md](./COMPLETE_API_REFERENCE.md)** - All 50+ API endpoints
- **[ROLE_SYSTEM_IMPLEMENTATION_GUIDE.md](./ROLE_SYSTEM_IMPLEMENTATION_GUIDE.md)** - Implementation details
- **[ROLE_SYSTEM_VISUAL_GUIDE.md](./ROLE_SYSTEM_VISUAL_GUIDE.md)** - Visual diagrams
- **[POSTMAN_TESTING_GUIDE.md](./POSTMAN_TESTING_GUIDE.md)** - API testing

### 🔧 Quick References
- **[QUICK_START.md](./QUICK_START.md)** - Get started quickly
- **[START_HERE.md](./START_HERE.md)** - Project overview
- **[COMMAND_CHEAT_SHEET.md](./COMMAND_CHEAT_SHEET.md)** - Useful commands

### 🐛 Troubleshooting
- **[LOGIN_TROUBLESHOOTING.md](./LOGIN_TROUBLESHOOTING.md)** - Fix login issues
- **[ADMIN_PANEL_DATA_FIX_GUIDE.md](./ADMIN_PANEL_DATA_FIX_GUIDE.md)** - Fix admin panel issues

---

## Troubleshooting

### Login Issues?
If you're getting "No user found" or "Invalid credentials" errors:

1. **Quick Fix:** [QUICK_FIX_LOGIN.md](QUICK_FIX_LOGIN.md)
2. **Full Guide:** [LOGIN_TROUBLESHOOTING.md](LOGIN_TROUBLESHOOTING.md)
3. **Visual Flow:** [LOGIN_DIAGNOSTIC_FLOW.md](LOGIN_DIAGNOSTIC_FLOW.md)

### Add Student Not Working?
If the Add Student button doesn't work or fails silently:

1. **Quick Test:** [ADD_STUDENT_QUICK_TEST.md](ADD_STUDENT_QUICK_TEST.md)
2. **Full Guide:** [ADD_STUDENT_FIX_GUIDE.md](ADD_STUDENT_FIX_GUIDE.md)
3. **Summary:** [ADD_STUDENT_FIX_SUMMARY.md](ADD_STUDENT_FIX_SUMMARY.md)

### User Website Not Working?
If the user website fails to load data or shows errors:

1. **Quick Test:** [USER_WEBSITE_QUICK_TEST.md](USER_WEBSITE_QUICK_TEST.md)
2. **Full Guide:** [USER_WEBSITE_FIX_GUIDE.md](USER_WEBSITE_FIX_GUIDE.md)

### Admin Panel Tables Empty?
If students/teachers tables are empty or Add buttons don't work:

1. **Quick Test:** [ADMIN_PANEL_QUICK_TEST.md](ADMIN_PANEL_QUICK_TEST.md)
2. **Full Guide:** [ADMIN_PANEL_DATA_FIX_GUIDE.md](ADMIN_PANEL_DATA_FIX_GUIDE.md)

### Quick Commands
```bash
# Run diagnostic
npm run diagnose-login admin@school.com admin123

# Create admin user
npm run create-school-admin

# List all users
npm run list-users

# Reset password
npm run reset-password <email> <newpassword>
```

## Development Tips

- Backend runs on port 5000
- User website runs on port 3000
- MongoDB runs on port 27017
- Use Postman or Thunder Client for API testing
- Check browser console for frontend errors
- Check terminal for backend errors

## 🎉 What's New

### Latest Updates (Role System Complete)

✅ **Homework System**
- Teachers can create and manage homework
- Students can view homework by class/section
- Due date tracking

✅ **Announcement System**
- School admins create announcements
- Target specific audiences (all, teachers, students, specific class)
- Priority levels and active/inactive status

✅ **Revenue Management**
- Track school subscriptions
- View revenue dashboard
- Monthly and total revenue tracking
- School statistics

✅ **Student Portal API**
- Dedicated student endpoints
- Dashboard with all student info
- Attendance statistics
- Fee summary
- Results viewing
- Homework access
- Announcements

✅ **Complete Role System**
- 4 distinct roles with proper access control
- Data isolation by schoolId
- 50+ protected API endpoints
- Production-ready backend

---

## Production Deployment

1. Set NODE_ENV=production in .env
2. Update MONGODB_URI with production database
3. Change JWT_SECRET to a strong secret
4. Build React app: `npm run build`
5. Use PM2 or similar for backend process management
6. Set up reverse proxy with Nginx
7. Enable HTTPS with SSL certificates

## License

MIT
