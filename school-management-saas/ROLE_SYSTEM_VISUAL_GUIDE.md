# 🎨 Role System Visual Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SCHOOL MANAGEMENT SAAS                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Super Admin  │  │ School Admin │  │   Teacher    │  │   Student    │
│   (React)    │  │  (Electron)  │  │   (React)    │  │   (React)    │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │                 │
       └─────────────────┴─────────────────┴─────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   JWT Authentication  │
                    │   Role Authorization  │
                    │   School Isolation    │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │    Backend API        │
                    │    (Express.js)       │
                    │    Port 5000          │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │      MongoDB          │
                    │   11 Collections      │
                    └───────────────────────┘
```

---

## Role Hierarchy

```
                    ┌─────────────────┐
                    │  Super Admin    │
                    │  (Platform)     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  School Admin   │
                    │  (School)       │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
        ┌───────▼────────┐       ┌───────▼────────┐
        │    Teacher     │       │    Student     │
        │    (Class)     │       │  (Individual)  │
        └────────────────┘       └────────────────┘
```

---

## Data Flow: Adding a Student

```
1. School Admin Login
   ┌─────────────────┐
   │ POST /api/auth/ │
   │      login      │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │  JWT Token      │
   │  role: School   │
   │  Admin          │
   └────────┬────────┘
            │
2. Create Student    │
   ┌─────────────────▼────┐
   │ POST /api/students   │
   │ Authorization: Token │
   └────────┬─────────────┘
            │
3. Middleware Chain  │
   ┌─────────────────▼────┐
   │ protect()            │
   │ ✓ Verify JWT         │
   └────────┬─────────────┘
            │
   ┌────────▼─────────────┐
   │ authorize()          │
   │ ✓ Check role         │
   └────────┬─────────────┘
            │
4. Create Records    │
   ┌─────────────────▼────┐
   │ Create User          │
   │ role: Student        │
   │ schoolId: XXX        │
   └────────┬─────────────┘
            │
   ┌────────▼─────────────┐
   │ Create Student       │
   │ userId: YYY          │
   │ schoolId: XXX        │
   └────────┬─────────────┘
            │
5. Student Can Login │
   ┌─────────────────▼────┐
   │ POST /api/auth/login │
   │ email: student@...   │
   └────────┬─────────────┘
            │
6. Access Portal     │
   ┌─────────────────▼────┐
   │ GET /api/student/    │
   │     dashboard        │
   └──────────────────────┘
```

---

## API Access Matrix

```
┌──────────────┬─────────────┬──────────────┬──────────┬──────────┐
│   Endpoint   │ SuperAdmin  │ SchoolAdmin  │ Teacher  │ Student  │
├──────────────┼─────────────┼──────────────┼──────────┼──────────┤
│ Schools      │ ✅ Full     │ ❌           │ ❌       │ ❌       │
│ Revenue      │ ✅ Full     │ ❌           │ ❌       │ ❌       │
│ Students     │ ✅ View All │ ✅ Full      │ ✅ View  │ ❌       │
│ Teachers     │ ✅ View All │ ✅ Full      │ ✅ View  │ ❌       │
│ Attendance   │ ✅ View All │ ✅ Full      │ ✅ Mark  │ ✅ Own   │
│ Fees         │ ✅ View All │ ✅ Full      │ ✅ View  │ ✅ Own   │
│ Exams        │ ✅ View All │ ✅ Full      │ ✅ View  │ ✅ Own   │
│ Homework     │ ✅ View All │ ✅ Full      │ ✅ Full  │ ✅ Own   │
│ Announce     │ ✅ View All │ ✅ Full      │ ✅ View  │ ✅ Own   │
│ Student API  │ ❌          │ ❌           │ ❌       │ ✅ Full  │
└──────────────┴─────────────┴──────────────┴──────────┴──────────┘
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                         COLLECTIONS                              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│    users     │  ← All users (4 roles)
├──────────────┤
│ _id          │
│ name         │
│ email        │
│ password     │
│ role         │  ← SuperAdmin, SchoolAdmin, Teacher, Student
│ schoolId     │  ← Links to schools (null for SuperAdmin)
│ isActive     │
└──────┬───────┘
       │
       ├─────────────────┐
       │                 │
┌──────▼───────┐  ┌──────▼───────┐
│   schools    │  │   students   │
├──────────────┤  ├──────────────┤
│ _id          │  │ _id          │
│ name         │  │ userId       │ ← Links to users
│ email        │  │ schoolId     │ ← Links to schools
│ adminId      │  │ rollNumber   │
│ isActive     │  │ class        │
│ subscription │  │ section      │
└──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  attendance  │  │    fees      │  │   exams      │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ studentId    │  │ studentId    │  │ name         │
│ schoolId     │  │ schoolId     │  │ schoolId     │
│ date         │  │ amount       │  │ class        │
│ status       │  │ paidAmount   │  │ subject      │
└──────────────┘  └──────────────┘  └──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  homework    │  │ announcements│  │subscriptions │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ title        │  │ title        │  │ schoolId     │
│ teacherId    │  │ message      │  │ plan         │
│ schoolId     │  │ schoolId     │  │ amount       │
│ class        │  │ target       │  │ status       │
│ dueDate      │  │ priority     │  │ endDate      │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      LOGIN PROCESS                               │
└─────────────────────────────────────────────────────────────────┘

1. User submits credentials
   ┌─────────────────┐
   │ email: xxx      │
   │ password: yyy   │
   └────────┬────────┘
            │
2. Backend validates
   ┌────────▼────────┐
   │ Find user       │
   │ Check password  │
   │ Verify active   │
   └────────┬────────┘
            │
3. Generate JWT
   ┌────────▼────────┐
   │ Token payload:  │
   │ - id            │
   │ - role          │
   │ - schoolId      │
   └────────┬────────┘
            │
4. Return token
   ┌────────▼────────┐
   │ {               │
   │   token: "..."  │
   │   user: {...}   │
   │ }               │
   └────────┬────────┘
            │
5. Client stores token
   ┌────────▼────────┐
   │ localStorage    │
   │ or sessionStore │
   └─────────────────┘
```

---

## Request Flow with Middleware

```
┌─────────────────────────────────────────────────────────────────┐
│                    API REQUEST FLOW                              │
└─────────────────────────────────────────────────────────────────┘

Client Request
   │
   ▼
┌──────────────────────┐
│ POST /api/students   │
│ Authorization: Token │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 1. protect()         │
│    - Extract token   │
│    - Verify JWT      │
│    - Load user       │
│    - Check active    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 2. authorize()       │
│    - Check role      │
│    - Allow/Deny      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 3. checkSchoolAccess │
│    - Verify schoolId │
│    - Data isolation  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ 4. Controller        │
│    - Business logic  │
│    - Database ops    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Response             │
│ { success, data }    │
└──────────────────────┘
```

---

## Multi-Tenant Data Isolation

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA ISOLATION                                │
└─────────────────────────────────────────────────────────────────┘

School A (schoolId: AAA)
┌──────────────────────────────────────┐
│ Users:                               │
│ - admin@schoola.com (SchoolAdmin)    │
│ - teacher1@schoola.com (Teacher)     │
│ - student1@schoola.com (Student)     │
│                                      │
│ Students: 100                        │
│ Teachers: 10                         │
│ Attendance: 5000 records             │
│ Fees: 200 records                    │
└──────────────────────────────────────┘

School B (schoolId: BBB)
┌──────────────────────────────────────┐
│ Users:                               │
│ - admin@schoolb.com (SchoolAdmin)    │
│ - teacher1@schoolb.com (Teacher)     │
│ - student1@schoolb.com (Student)     │
│                                      │
│ Students: 150                        │
│ Teachers: 15                         │
│ Attendance: 7500 records             │
│ Fees: 300 records                    │
└──────────────────────────────────────┘

❌ School A cannot access School B data
❌ School B cannot access School A data
✅ SuperAdmin can access all schools
```

---

## Student Portal Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   STUDENT PORTAL FLOW                            │
└─────────────────────────────────────────────────────────────────┘

1. Student Login
   ┌─────────────────┐
   │ POST /api/auth/ │
   │      login      │
   └────────┬────────┘
            │
2. Get Dashboard
   ┌────────▼────────┐
   │ GET /api/student│
   │   /dashboard    │
   └────────┬────────┘
            │
3. Backend Finds Student
   ┌────────▼────────┐
   │ Find Student by │
   │ userId + school │
   └────────┬────────┘
            │
4. Fetch Related Data
   ┌────────▼────────┐
   │ - Attendance    │
   │ - Fees          │
   │ - Homework      │
   │ - Announcements │
   └────────┬────────┘
            │
5. Return Dashboard
   ┌────────▼────────┐
   │ {               │
   │   student: {...}│
   │   attendance: []│
   │   fees: []      │
   │   homework: []  │
   │ }               │
   └─────────────────┘
```

---

## Testing Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    TESTING WORKFLOW                              │
└─────────────────────────────────────────────────────────────────┘

Step 1: Create Super Admin
   node scripts/createAdmin.js
   ↓
Step 2: Login as Super Admin
   POST /api/auth/login
   ↓
Step 3: Create School
   POST /api/schools
   ↓
Step 4: Login as School Admin
   POST /api/auth/login
   ↓
Step 5: Add Students
   POST /api/students
   ↓
Step 6: Add Teachers
   POST /api/teachers
   ↓
Step 7: Login as Teacher
   POST /api/auth/login
   ↓
Step 8: Mark Attendance
   POST /api/attendance/mark
   ↓
Step 9: Login as Student
   POST /api/auth/login
   ↓
Step 10: View Dashboard
   GET /api/student/dashboard
```

---

## Summary

✅ **4 Roles** with distinct permissions
✅ **11 Collections** with proper relationships
✅ **50+ Endpoints** with role-based access
✅ **JWT Authentication** with role & schoolId
✅ **Data Isolation** by schoolId
✅ **Complete API** ready for frontend integration

**Your backend is production-ready!** 🚀
