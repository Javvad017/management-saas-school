# 🎓 School Management SaaS

Complete multi-tenant school management system with role-based access control.

## 🚨 IMPORTANT: Login Issue Fixed!

**The "Failed to fetch" error has been resolved.**

**Action Required**: Restart the backend server to apply the CORS fix.

```bash
cd school-management-saas/backend
# Stop current server (Ctrl+C)
node server.js
```

Then login with:
- Email: `admin@test.com`
- Password: `admin123`

📖 **Read**: `START_HERE.md` for complete setup guide.

---

## 🏗️ Architecture

### Backend (Node.js + Express + MongoDB)
- JWT authentication
- Role-based access control (4 roles)
- Multi-tenant with schoolId isolation
- 50+ API endpoints
- 11 Mongoose models

### Frontend (4 Applications)
1. **Super Admin Panel** (Web) - ✅ Complete
2. **Student Portal** (Web) - 🔄 10% Complete
3. **Teacher Portal** (Web) - ⏳ Not Started
4. **Admin Desktop** (Electron) - ⏳ Not Started

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- MongoDB 4+
- Modern web browser

### 1. Install Dependencies
```bash
cd school-management-saas/backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Start MongoDB
```bash
# Windows
net start MongoDB

# Or manually
mongod --dbpath C:\data\db
```

### 4. Start Backend
```bash
cd school-management-saas/backend
node server.js
```

### 5. Create Super Admin
```bash
cd school-management-saas/backend
node scripts/createAdmin.js
```

### 6. Open Super Admin Panel
Open in browser: `school-management-saas/super-admin-panel/login.html`

Login with:
- Email: `admin@test.com`
- Password: `admin123`

---

## 📁 Project Structure

```
school-management-saas/
│
├── backend/                      # Backend API
│   ├── server.js                # Main server
│   ├── config/                  # Database config
│   ├── models/                  # Mongoose models (11)
│   ├── controllers/             # Route controllers (12)
│   ├── routes/                  # API routes
│   ├── middlewares/             # Auth & error handling
│   ├── services/                # Business logic
│   ├── utils/                   # Helper functions
│   └── scripts/                 # Admin utilities
│
├── super-admin-panel/           # ✅ Super Admin Web App
│   ├── login.html
│   ├── dashboard.html
│   ├── schools.html
│   ├── revenue.html
│   └── js/                      # JavaScript modules
│
├── student-portal/              # 🔄 Student Web App (10%)
│   └── login.html
│
├── teacher-portal/              # ⏳ Teacher Web App (Not Started)
│
├── admin-desktop/               # ⏳ Admin Electron App (Not Started)
│
└── docs/                        # Documentation (15+ files)
    ├── START_HERE.md           # 👈 Start here!
    ├── QUICK_START.md
    ├── LOGIN_FIXED.md
    ├── COMPLETE_API_REFERENCE.md
    └── ...
```

---

## 🎯 Features

### Super Admin Panel ✅
- Dashboard with statistics and charts
- School management (CRUD)
- Subscription management
- Revenue analytics
- User management
- System monitoring

### School Admin Desktop ⏳
- Student management
- Teacher management
- Attendance tracking
- Fee management
- Exam creation
- Result publishing
- Announcements
- Reports generation

### Teacher Portal ⏳
- Mark attendance
- Upload homework
- Enter exam marks
- View class students
- Send announcements

### Student Portal 🔄
- View attendance
- Check fees status
- View exam results
- Access homework
- Read announcements

---

## 🔐 Roles & Permissions

### SuperAdmin
- Manage all schools
- View system-wide analytics
- Manage subscriptions
- Access all data

### SchoolAdmin
- Manage own school only
- Add/edit students & teachers
- Track attendance & fees
- Create exams & publish results
- Send announcements

### Teacher
- Mark attendance for assigned classes
- Upload homework
- Enter exam marks
- View student information

### Student
- View own data only
- Check attendance
- View fees & results
- Access homework
- Read announcements

---

## 🔧 API Endpoints

### Authentication
```
POST   /api/auth/login          # Login
POST   /api/auth/register       # Register
GET    /api/auth/me             # Get current user
```

### Schools (SuperAdmin only)
```
GET    /api/schools             # List all schools
POST   /api/schools             # Create school
GET    /api/schools/:id         # Get school
PUT    /api/schools/:id         # Update school
DELETE /api/schools/:id         # Delete school
```

### Students
```
GET    /api/students            # List students
POST   /api/students            # Add student
GET    /api/students/:id        # Get student
PUT    /api/students/:id        # Update student
DELETE /api/students/:id        # Delete student
```

### Teachers
```
GET    /api/teachers            # List teachers
POST   /api/teachers            # Add teacher
GET    /api/teachers/:id        # Get teacher
PUT    /api/teachers/:id        # Update teacher
DELETE /api/teachers/:id        # Delete teacher
```

### Attendance
```
POST   /api/attendance          # Mark attendance
GET    /api/attendance          # Get attendance records
GET    /api/attendance/student/:id  # Student attendance
```

### Fees
```
GET    /api/fees                # List fees
POST   /api/fees                # Create fee
PUT    /api/fees/:id            # Update fee
POST   /api/fees/:id/pay        # Record payment
```

### Exams & Results
```
POST   /api/exams               # Create exam
GET    /api/exams               # List exams
POST   /api/exams/:id/results   # Publish results
GET    /api/student/results     # Get student results
```

### More...
See `COMPLETE_API_REFERENCE.md` for all 50+ endpoints.

---

## 🛠️ Development

### Backend Scripts
```bash
# Create super admin
node scripts/createAdmin.js

# Create school admin
node scripts/createSchoolAdmin.js

# List all users
node scripts/listUsers.js

# Reset password
node scripts/resetPassword.js <email> <newPassword>

# Delete user
node scripts/deleteUser.js <email>

# Test login
node scripts/testLogin.js

# Diagnose login issues
node scripts/diagnoseLogin.js <email>
```

### Testing
```bash
# Test backend health
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

---

## 🎨 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- dotenv

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- TailwindCSS (CDN)
- Chart.js
- Fetch API

### Desktop
- Electron (planned)

---

## 📊 Database Models

1. **User** - Authentication & roles
2. **School** - School information
3. **Student** - Student records
4. **Teacher** - Teacher records
5. **Attendance** - Attendance tracking
6. **Fee** - Fee management
7. **Exam** - Exam details
8. **Result** - Exam results
9. **Homework** - Homework assignments
10. **Announcement** - Announcements
11. **Subscription** - School subscriptions

---

## 🔒 Security

- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Multi-tenant data isolation
- Input validation
- Error handling
- CORS configuration
- Environment variables

---

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🚀 Deployment

### Backend
1. Set up MongoDB Atlas or self-hosted MongoDB
2. Configure environment variables
3. Deploy to Heroku, AWS, or DigitalOcean
4. Set up HTTPS
5. Configure CORS for production domains

### Frontend
1. Update API_BASE URLs
2. Deploy to Netlify, Vercel, or any static host
3. Configure HTTPS
4. Set up custom domains

---

## 📝 Documentation

| File | Description |
|------|-------------|
| `START_HERE.md` | 👈 Main entry point |
| `QUICK_START.md` | Fast 3-step setup |
| `LOGIN_FIXED.md` | Login issue fix details |
| `LOGIN_ISSUE_RESOLUTION_SUMMARY.md` | Technical fix explanation |
| `FIX_LOGIN_STEPS.md` | Troubleshooting guide |
| `COMPLETE_API_REFERENCE.md` | All API endpoints |
| `ARCHITECTURE.md` | System architecture |
| `DEPLOYMENT_GUIDE.md` | Production deployment |
| `COMPLETE_ROLE_SYSTEM_IMPLEMENTATION.md` | Role system details |

---

## ✅ Current Status

| Component | Status | Progress |
|-----------|--------|----------|
| Backend API | ✅ Complete | 100% |
| Super Admin Panel | ✅ Complete | 100% |
| Student Portal | 🔄 In Progress | 10% |
| Teacher Portal | ⏳ Not Started | 0% |
| Admin Desktop | ⏳ Not Started | 0% |
| Documentation | ✅ Complete | 100% |

---

## 🎯 Next Steps

1. ✅ **Fix login issue** - DONE
2. 🔄 **Complete Student Portal**
   - Dashboard page
   - Attendance view
   - Fees status
   - Exam results
   - Homework list
3. ⏳ **Build Teacher Portal**
   - All pages and features
4. ⏳ **Create Admin Desktop**
   - Electron setup
   - All admin features

---

## 🐛 Troubleshooting

### Login Issues
See `LOGIN_FIXED.md` and `FIX_LOGIN_STEPS.md`

### Backend Issues
```bash
# Check if running
netstat -ano | findstr :5000

# Check logs
# Look at terminal where backend is running

# Restart backend
cd backend
node server.js
```

### MongoDB Issues
```bash
# Check if running
mongod --version

# Start MongoDB
net start MongoDB
```

### Frontend Issues
- Clear browser cache
- Check browser console (F12)
- Verify API_BASE URL in js/api.js
- Try using a web server instead of file://

---

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review API reference
3. Test endpoints with curl
4. Check browser console
5. Review backend logs

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎉 Getting Started

**Ready to test?**

1. Read `START_HERE.md`
2. Restart backend server
3. Open `super-admin-panel/login.html`
4. Login with `admin@test.com` / `admin123`
5. Explore the dashboard!

**The system is ready to use!** 🚀
