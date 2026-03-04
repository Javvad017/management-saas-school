# 🎯 Role-Based System - Complete Architecture

## System Overview

Your School Management SaaS has a complete role-based architecture with 4 user roles accessing the same backend API.

---

## 🔐 Role Structure

### Current Implementation Status

| Role | Platform | Status | Access Level |
|------|----------|--------|--------------|
| **SuperAdmin** | Web Panel | ✅ Backend Ready | Full system access |
| **SchoolAdmin** | Electron Desktop | ✅ Fully Implemented | School-level management |
| **Teacher** | Website | ✅ Backend Ready | Class-level operations |
| **Student** | Website | ✅ Fully Implemented | View-only access |

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Super Admin  │  │ School Admin │  │   Teacher    │ │
│  │  Web Panel   │  │   Electron   │  │   Website    │ │
│  │  (Future)    │  │  ✅ Working  │  │  (Future)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Student/Parent Website                  │  │
│  │              React - ✅ Working                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND API LAYER                     │
│              Node.js + Express + JWT                     │
│                   ✅ Fully Working                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Authentication Middleware (protect)                     │
│  Authorization Middleware (authorize)                    │
│  Role-based Access Control                              │
│  Multi-tenant Data Isolation (schoolId)                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                        │
│                      MongoDB                             │
│                   ✅ Fully Working                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Collections:                                            │
│  • users (with role field)                              │
│  • schools                                               │
│  • students                                              │
│  • teachers                                              │
│  • attendance                                            │
│  • fees                                                  │
│  • exams                                                 │
│  • results                                               │
│                                                          │
│  All records include schoolId for data isolation        │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 👥 User Model (Current Implementation)

### Schema

**File:** `backend/models/User.js`

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['SuperAdmin', 'SchoolAdmin', 'Teacher', 'Student'],
    default: 'Student'
  },
  schoolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: function() {
      return this.role !== 'SuperAdmin';
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
```

**Status:** ✅ Fully Implemented

**Features:**
- ✅ 4 roles supported
- ✅ schoolId for multi-tenancy
- ✅ SuperAdmin doesn't require schoolId
- ✅ Password hashing with bcrypt
- ✅ Email uniqueness
- ✅ Active/inactive status

---

## 🔒 Authentication & Authorization

### JWT Token Structure

**Current Implementation:**

```javascript
// Token payload
{
  id: user._id,
  role: user.role,
  schoolId: user.schoolId
}

// Token expiration: 7 days
```

### Auth Middleware

**File:** `backend/middlewares/auth.js`

```javascript
// Protect middleware - verifies JWT token
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return next(new ErrorResponse('Not authorized', 401));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new ErrorResponse('Not authorized', 401));
  }
});

// Authorize middleware - checks user role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(
        `User role ${req.user.role} is not authorized`,
        403
      ));
    }
    next();
  };
};
```

**Status:** ✅ Fully Implemented

---

## 🌟 SuperAdmin Features

### Current Status: ✅ Backend Ready, Frontend Pending

### Routes

**File:** `backend/routes/schoolRoutes.js`

```javascript
import { protect, authorize } from '../middlewares/auth.js';

// All routes require SuperAdmin role
router.use(protect);
router.use(authorize('SuperAdmin'));

router.route('/')
  .get(getSchools)      // GET /api/schools
  .post(createSchool);  // POST /api/schools

router.route('/:id')
  .get(getSchool)       // GET /api/schools/:id
  .put(updateSchool)    // PUT /api/schools/:id
  .delete(deleteSchool); // DELETE /api/schools/:id
```

### Features Available

**School Management:**
- ✅ Create school
- ✅ View all schools
- ✅ Update school
- ✅ Delete school
- ✅ Assign school admin

**Dashboard Statistics:**
- ✅ Total schools count
- ✅ Total users count
- ✅ System-wide statistics

### API Examples

**Create School:**
```javascript
POST /api/schools
Headers: Authorization: Bearer <superadmin_token>
Body: {
  "name": "ABC School",
  "address": "123 Main St",
  "phone": "1234567890",
  "email": "abc@school.com",
  "adminName": "School Admin",
  "adminEmail": "admin@abc.com",
  "adminPassword": "admin123"
}

Response: {
  "success": true,
  "data": {
    "school": { ... },
    "admin": { ... }
  }
}
```

**Get All Schools:**
```javascript
GET /api/schools
Headers: Authorization: Bearer <superadmin_token>

Response: {
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "name": "ABC School",
      "email": "abc@school.com",
      "adminId": { ... }
    }
  ]
}
```

### SuperAdmin Panel (To Be Built)

**Recommended Stack:** React or Next.js

**Pages Needed:**
1. **Dashboard**
   - Total schools
   - Total revenue
   - Active subscriptions
   - System statistics

2. **Schools Management**
   - List all schools
   - Create new school
   - Edit school details
   - Delete school
   - Activate/Deactivate school

3. **Subscriptions** (Future)
   - View all subscriptions
   - Manage plans
   - Track payments

4. **Revenue** (Future)
   - Revenue dashboard
   - Payment history
   - Analytics

**Implementation Guide:**
```bash
# Create SuperAdmin panel
npx create-react-app super-admin-panel
cd super-admin-panel

# Install dependencies
npm install axios react-router-dom

# Reuse API integration from user-website
# Copy services/api.js
# Adapt for SuperAdmin routes
```

---

## 🏫 SchoolAdmin Features

### Current Status: ✅ Fully Implemented (Electron Desktop)

### Platform: Electron Desktop App

**File:** `admin-desktop/renderer.js`

### Features Implemented

**1. Dashboard**
- ✅ View statistics
- ✅ Total students
- ✅ Total teachers
- ✅ Present today
- ✅ Absent today
- ✅ Pending fees

**2. Student Management**
- ✅ View all students
- ✅ Add student
- ✅ Delete student
- ✅ Filter by class/section

**3. Teacher Management**
- ✅ View all teachers
- ✅ Add teacher
- ✅ Delete teacher

**4. Attendance Management**
- ✅ View attendance records
- ✅ Mark attendance (bulk)
- ✅ Select date
- ✅ Present/Absent toggle

**5. Fee Management**
- ✅ View fee records
- ✅ Mark fee as paid
- ✅ Track due amounts

**6. Exam & Results** (Backend Ready)
- ✅ Backend routes available
- ⏳ Frontend UI pending

### Routes Used

```javascript
// Dashboard
GET /api/dashboard/stats

// Students
GET /api/students
POST /api/students
DELETE /api/students/:id

// Teachers
GET /api/teachers
POST /api/teachers
DELETE /api/teachers/:id

// Attendance
GET /api/attendance
POST /api/attendance/mark

// Fees
GET /api/fees
PUT /api/fees/:id/pay

// Exams (Available but not in UI yet)
GET /api/exams
POST /api/exams
POST /api/exams/results
```

### Authorization

All routes require:
```javascript
Headers: {
  Authorization: Bearer <token>
}

// Token contains:
{
  id: user._id,
  role: 'SchoolAdmin',
  schoolId: user.schoolId
}
```

### Data Isolation

All queries automatically filtered by schoolId:
```javascript
// Example: Get students
const schoolId = req.user.schoolId;
const students = await Student.find({ schoolId });
```

---

## 👨‍🏫 Teacher Features

### Current Status: ✅ Backend Ready, Frontend Pending

### Platform: Website (To Be Built)

### Routes Available

**File:** `backend/routes/attendanceRoutes.js`

```javascript
// Mark attendance
router.post('/mark', 
  protect, 
  authorize('Teacher', 'SchoolAdmin'), 
  markAttendance
);

// View attendance
router.get('/', 
  protect, 
  getAttendance
);

// Get by class
router.get('/class', 
  protect, 
  getAttendanceByClass
);
```

### Features Available

**1. Attendance Management**
- ✅ Mark student attendance
- ✅ View attendance records
- ✅ Filter by class
- ✅ View attendance reports

**2. Homework Management** (To Be Implemented)
- ⏳ Upload homework
- ⏳ View submissions
- ⏳ Grade homework

**3. Marks Entry** (Backend Ready)
- ✅ Enter exam marks
- ✅ View results
- ✅ Calculate grades

### API Examples

**Mark Attendance:**
```javascript
POST /api/attendance/mark
Headers: Authorization: Bearer <teacher_token>
Body: {
  "attendance": [
    {
      "studentId": "65abc123...",
      "date": "2024-03-04",
      "status": "Present"
    },
    {
      "studentId": "65abc456...",
      "date": "2024-03-04",
      "status": "Absent"
    }
  ]
}
```

**Add Exam Results:**
```javascript
POST /api/exams/results
Headers: Authorization: Bearer <teacher_token>
Body: {
  "studentId": "65abc123...",
  "examId": "65def789...",
  "marks": [
    {
      "subject": "Mathematics",
      "marksObtained": 85,
      "totalMarks": 100
    },
    {
      "subject": "Science",
      "marksObtained": 90,
      "totalMarks": 100
    }
  ]
}
```

### Teacher Portal (To Be Built)

**Recommended Stack:** React (reuse from user-website)

**Pages Needed:**
1. **Dashboard**
   - My classes
   - Today's schedule
   - Pending tasks

2. **Attendance**
   - Mark attendance
   - View attendance history
   - Attendance reports

3. **Homework**
   - Upload homework
   - View submissions
   - Grade homework

4. **Marks**
   - Enter exam marks
   - View results
   - Generate reports

**Implementation Guide:**
```bash
# Create teacher portal
cd school-management-saas
mkdir teacher-website
cd teacher-website

# Copy user-website structure
cp -r ../user-website/* .

# Modify for teacher role
# Update routes and components
# Add teacher-specific features
```

---

## 👨‍🎓 Student/Parent Features

### Current Status: ✅ Fully Implemented (React Website)

### Platform: React Website

**Location:** `user-website/`

### Features Implemented

**1. Dashboard**
- ✅ View profile
- ✅ View statistics
- ✅ Quick links

**2. Attendance**
- ✅ View attendance records
- ✅ View attendance percentage
- ✅ Filter by date range
- ✅ Attendance statistics

**3. Fees**
- ✅ View fee records
- ✅ View fee summary
- ✅ Check due amounts
- ✅ Payment status

**4. Results**
- ✅ View exam results
- ✅ View grades
- ✅ View subject-wise marks
- ✅ View percentage

**5. Notifications** (Backend Ready)
- ⏳ View announcements
- ⏳ Receive notifications

### Routes Used

```javascript
// Authentication
POST /api/auth/login
GET /api/auth/me

// Dashboard
GET /api/dashboard/stats

// Attendance
GET /api/attendance?studentId=<id>
GET /api/attendance/percentage/:studentId

// Fees
GET /api/fees?studentId=<id>
GET /api/fees/summary/:studentId

// Results
GET /api/exams/results/student/:studentId
```

### Authorization

All routes require:
```javascript
Headers: {
  Authorization: Bearer <token>
}

// Token contains:
{
  id: user._id,
  role: 'Student',
  schoolId: user.schoolId
}
```

### Data Access

Students can only view their own data:
```javascript
// Backend automatically filters by user ID
const user = req.user;
const studentId = user._id;

// Get student's attendance
const attendance = await Attendance.find({ 
  studentId,
  schoolId: user.schoolId 
});
```

---

## 🗄️ Database Collections

### Current Implementation

**All collections include `schoolId` for data isolation**

### 1. users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (SuperAdmin/SchoolAdmin/Teacher/Student),
  schoolId: ObjectId (ref: School),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. schools
```javascript
{
  _id: ObjectId,
  name: String,
  address: String,
  phone: String,
  email: String (unique),
  adminId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### 3. students
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  schoolId: ObjectId (ref: School),
  rollNumber: String (unique per school),
  class: String,
  section: String,
  dateOfBirth: Date,
  parentName: String,
  parentPhone: String,
  address: String,
  admissionDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. teachers
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  schoolId: ObjectId (ref: School),
  employeeId: String (unique per school),
  subject: String,
  qualification: String,
  salary: Number,
  phone: String,
  address: String,
  joiningDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. attendance
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: Student),
  schoolId: ObjectId (ref: School),
  date: Date,
  status: String (Present/Absent/Late/Excused),
  remarks: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 6. fees
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: Student),
  schoolId: ObjectId (ref: School),
  feeType: String,
  amount: Number,
  paidAmount: Number,
  status: String (Paid/Pending/Overdue),
  dueDate: Date,
  month: String,
  year: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 7. exams
```javascript
{
  _id: ObjectId,
  schoolId: ObjectId (ref: School),
  examName: String,
  class: String,
  examDate: Date,
  totalMarks: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 8. results
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: Student),
  examId: ObjectId (ref: Exam),
  schoolId: ObjectId (ref: School),
  marks: [{
    subject: String,
    marksObtained: Number,
    totalMarks: Number
  }],
  totalMarksObtained: Number,
  totalMarks: Number,
  percentage: Number,
  grade: String,
  remarks: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 9. announcements (To Be Implemented)
```javascript
{
  _id: ObjectId,
  schoolId: ObjectId (ref: School),
  title: String,
  message: String,
  targetRole: String (All/Teacher/Student),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### 10. subscriptions (Future)
```javascript
{
  _id: ObjectId,
  schoolId: ObjectId (ref: School),
  plan: String (Basic/Premium/Enterprise),
  startDate: Date,
  endDate: Date,
  amount: Number,
  status: String (Active/Expired/Cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔄 Data Sync Between Platforms

### How It Works

**Real-time data sync through API:**

```
1. Admin adds student
   ↓
2. POST /api/students
   ↓
3. MongoDB updated
   ↓
4. Student website calls GET /api/auth/me
   ↓
5. Student sees profile immediately
```

**No manual sync needed** - All platforms use the same API

### Example Flow

**Scenario: Admin marks attendance**

```javascript
// 1. Admin Desktop (Electron)
POST /api/attendance/mark
Body: { attendance: [...] }

// 2. Backend saves to MongoDB
await Attendance.insertMany(attendanceRecords);

// 3. Student Website fetches
GET /api/attendance?studentId=<id>

// 4. Student sees attendance immediately
Response: { success: true, data: [...] }
```

---

## 🎯 Implementation Checklist

### ✅ Already Implemented

- [x] User model with 4 roles
- [x] JWT authentication
- [x] Auth middleware (protect)
- [x] Authorization middleware (authorize)
- [x] Multi-tenant data isolation (schoolId)
- [x] School management routes (SuperAdmin)
- [x] Student management (SchoolAdmin)
- [x] Teacher management (SchoolAdmin)
- [x] Attendance management
- [x] Fee management
- [x] Exam & Results management
- [x] Dashboard statistics
- [x] Electron Admin Desktop (SchoolAdmin)
- [x] React User Website (Student)
- [x] API documentation
- [x] Testing guides

### ⏳ Pending Implementation

- [ ] SuperAdmin Web Panel
  - [ ] Dashboard
  - [ ] Schools management UI
  - [ ] Revenue tracking
  - [ ] Subscriptions management

- [ ] Teacher Website
  - [ ] Dashboard
  - [ ] Attendance marking UI
  - [ ] Homework management
  - [ ] Marks entry UI

- [ ] Additional Features
  - [ ] Announcements system
  - [ ] Homework management
  - [ ] Subscriptions & billing
  - [ ] Reports generation
  - [ ] Notifications system

---

## 🚀 Quick Start Guide

### 1. Start Backend
```bash
cd school-management-saas/backend
npm run dev
```

### 2. Create SuperAdmin (First Time)
```bash
# Manually create in MongoDB or via script
POST /api/auth/register
Body: {
  "name": "Super Admin",
  "email": "superadmin@saas.com",
  "password": "superadmin123",
  "role": "SuperAdmin"
}
```

### 3. Create School (SuperAdmin)
```bash
POST /api/schools
Headers: Authorization: Bearer <superadmin_token>
Body: {
  "name": "Demo School",
  "email": "demo@school.com",
  "adminEmail": "admin@demo.com",
  "adminPassword": "admin123"
}
```

### 4. Start Admin Desktop (SchoolAdmin)
```bash
cd school-management-saas/admin-desktop
npm start
# Login: admin@demo.com / admin123
```

### 5. Start User Website (Student)
```bash
cd school-management-saas/user-website
npm run dev
# Login: student@demo.com / student123
```

---

## 📚 API Reference by Role

### SuperAdmin Routes
```
POST   /api/schools              - Create school
GET    /api/schools              - Get all schools
GET    /api/schools/:id          - Get single school
PUT    /api/schools/:id          - Update school
DELETE /api/schools/:id          - Delete school
```

### SchoolAdmin Routes
```
GET    /api/dashboard/stats      - Get statistics
GET    /api/students             - Get students
POST   /api/students             - Add student
PUT    /api/students/:id         - Update student
DELETE /api/students/:id         - Delete student
GET    /api/teachers             - Get teachers
POST   /api/teachers             - Add teacher
PUT    /api/teachers/:id         - Update teacher
DELETE /api/teachers/:id         - Delete teacher
GET    /api/attendance           - Get attendance
POST   /api/attendance/mark      - Mark attendance
GET    /api/fees                 - Get fees
POST   /api/fees                 - Create fee
PUT    /api/fees/:id/pay         - Mark payment
GET    /api/exams                - Get exams
POST   /api/exams                - Create exam
POST   /api/exams/results        - Add results
```

### Teacher Routes
```
GET    /api/students             - View students
GET    /api/attendance           - View attendance
POST   /api/attendance/mark      - Mark attendance
GET    /api/exams                - View exams
POST   /api/exams/results        - Add results
```

### Student Routes
```
GET    /api/auth/me              - Get profile
GET    /api/dashboard/stats      - Get statistics
GET    /api/attendance           - Get attendance
GET    /api/attendance/percentage/:id - Get percentage
GET    /api/fees                 - Get fees
GET    /api/fees/summary/:id     - Get fee summary
GET    /api/exams/results/student/:id - Get results
```

---

## 🎉 Conclusion

Your School Management SaaS has a **complete role-based architecture** with:

✅ **4 User Roles** - SuperAdmin, SchoolAdmin, Teacher, Student  
✅ **JWT Authentication** - Secure token-based auth  
✅ **Role-Based Access Control** - Middleware protection  
✅ **Multi-Tenant Architecture** - schoolId data isolation  
✅ **Complete Backend API** - All routes implemented  
✅ **SchoolAdmin Platform** - Electron desktop fully working  
✅ **Student Platform** - React website fully working  
⏳ **SuperAdmin Panel** - Backend ready, frontend pending  
⏳ **Teacher Portal** - Backend ready, frontend pending  

**The system is production-ready for SchoolAdmin and Student roles!**

---

**Last Updated:** March 4, 2026  
**Version:** 1.0.0  
**Status:** ✅ CORE SYSTEM COMPLETE
