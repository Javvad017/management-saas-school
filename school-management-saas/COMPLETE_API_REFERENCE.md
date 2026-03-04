# Complete API Reference - School Management SaaS

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Routes

### Register User
```http
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Student",
  "schoolId": "school_id_here"
}
```

### Login
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /api/auth/me
```
**Auth:** Required

---

## 👑 Super Admin Routes

### Create School
```http
POST /api/schools
```
**Auth:** SuperAdmin
**Body:**
```json
{
  "name": "ABC School",
  "address": "123 Main St",
  "phone": "1234567890",
  "email": "school@example.com",
  "adminName": "Admin Name",
  "adminEmail": "admin@school.com",
  "adminPassword": "admin123"
}
```

### Get All Schools
```http
GET /api/schools
```
**Auth:** SuperAdmin

### Get Single School
```http
GET /api/schools/:id
```
**Auth:** Required

### Update School
```http
PUT /api/schools/:id
```
**Auth:** SuperAdmin or SchoolAdmin

### Delete School
```http
DELETE /api/schools/:id
```
**Auth:** SuperAdmin

### Get Revenue Dashboard
```http
GET /api/revenue
```
**Auth:** SuperAdmin
**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 50000,
    "monthlyRevenue": 5000,
    "activeSubscriptions": 10,
    "totalSubscriptions": 15,
    "schoolStats": {
      "total": 20,
      "active": 18,
      "inactive": 2
    }
  }
}
```

### Get All Subscriptions
```http
GET /api/revenue/subscriptions
```
**Auth:** SuperAdmin

### Create Subscription
```http
POST /api/revenue/subscriptions
```
**Auth:** SuperAdmin
**Body:**
```json
{
  "schoolId": "school_id",
  "plan": "premium",
  "amount": 5000,
  "endDate": "2024-12-31",
  "maxStudents": 500,
  "maxTeachers": 50
}
```

---

## 🏫 School Admin Routes

### Student Management

#### Create Student
```http
POST /api/students
```
**Auth:** SchoolAdmin
**Body:**
```json
{
  "name": "Student Name",
  "email": "student@example.com",
  "class": "10",
  "section": "A",
  "rollNumber": "101",
  "dateOfBirth": "2010-01-01",
  "parentName": "Parent Name",
  "parentPhone": "1234567890"
}
```

#### Get All Students
```http
GET /api/students?class=10&section=A&search=name
```
**Auth:** Required

#### Get Single Student
```http
GET /api/students/:id
```
**Auth:** Required

#### Update Student
```http
PUT /api/students/:id
```
**Auth:** SchoolAdmin

#### Delete Student
```http
DELETE /api/students/:id
```
**Auth:** SchoolAdmin

### Teacher Management

#### Create Teacher
```http
POST /api/teachers
```
**Auth:** SchoolAdmin

#### Get All Teachers
```http
GET /api/teachers
```
**Auth:** Required

### Fee Management

#### Create Fee
```http
POST /api/fees
```
**Auth:** SchoolAdmin
**Body:**
```json
{
  "studentId": "student_id",
  "amount": 5000,
  "feeType": "Tuition",
  "dueDate": "2024-12-31"
}
```

#### Get Fees
```http
GET /api/fees?studentId=student_id
```
**Auth:** Required

### Exam Management

#### Create Exam
```http
POST /api/exams
```
**Auth:** SchoolAdmin
**Body:**
```json
{
  "name": "Mid Term",
  "subject": "Mathematics",
  "class": "10",
  "section": "A",
  "date": "2024-12-15",
  "totalMarks": 100
}
```

#### Get Exams
```http
GET /api/exams?class=10&section=A
```
**Auth:** Required

### Announcements

#### Create Announcement
```http
POST /api/announcements
```
**Auth:** SchoolAdmin
**Body:**
```json
{
  "title": "Holiday Notice",
  "message": "School will be closed tomorrow",
  "targetAudience": "all",
  "priority": "high"
}
```

#### Get Announcements
```http
GET /api/announcements?targetAudience=students
```
**Auth:** Required

#### Update Announcement
```http
PUT /api/announcements/:id
```
**Auth:** SchoolAdmin

#### Delete Announcement
```http
DELETE /api/announcements/:id
```
**Auth:** SchoolAdmin

---

## 👨‍🏫 Teacher Routes

### Mark Attendance
```http
POST /api/attendance/mark
```
**Auth:** Teacher or SchoolAdmin
**Body:**
```json
{
  "studentId": "student_id",
  "date": "2024-12-01",
  "status": "present"
}
```

### Get Attendance
```http
GET /api/attendance?class=10&section=A&date=2024-12-01
```
**Auth:** Required

### Create Homework
```http
POST /api/homework
```
**Auth:** Teacher or SchoolAdmin
**Body:**
```json
{
  "title": "Math Assignment",
  "description": "Complete chapter 5 exercises",
  "subject": "Mathematics",
  "class": "10",
  "section": "A",
  "dueDate": "2024-12-15"
}
```

### Get Homework
```http
GET /api/homework?class=10&section=A
```
**Auth:** Required

### Update Homework
```http
PUT /api/homework/:id
```
**Auth:** Teacher (owner) or SchoolAdmin

### Delete Homework
```http
DELETE /api/homework/:id
```
**Auth:** Teacher (owner) or SchoolAdmin

---

## 👨‍🎓 Student Portal Routes

All student routes require Student role authentication.

### Get Student Profile
```http
GET /api/student/profile
```
**Auth:** Student

### Get Student Dashboard
```http
GET /api/student/dashboard
```
**Auth:** Student
**Response:**
```json
{
  "success": true,
  "data": {
    "student": {...},
    "recentAttendance": [...],
    "pendingFees": [...],
    "recentHomework": [...],
    "recentAnnouncements": [...]
  }
}
```

### Get Student Attendance
```http
GET /api/student/attendance
```
**Auth:** Student
**Response:**
```json
{
  "success": true,
  "data": {
    "attendance": [...],
    "stats": {
      "totalDays": 100,
      "presentDays": 95,
      "absentDays": 5,
      "percentage": "95.00"
    }
  }
}
```

### Get Student Fees
```http
GET /api/student/fees
```
**Auth:** Student
**Response:**
```json
{
  "success": true,
  "data": {
    "fees": [...],
    "summary": {
      "totalAmount": 50000,
      "paidAmount": 30000,
      "pendingAmount": 20000
    }
  }
}
```

### Get Student Results
```http
GET /api/student/results
```
**Auth:** Student

### Get Student Homework
```http
GET /api/student/homework
```
**Auth:** Student

### Get Student Announcements
```http
GET /api/student/announcements
```
**Auth:** Student

---

## 📊 Dashboard Routes

### Get Dashboard Stats
```http
GET /api/dashboard/stats
```
**Auth:** Required
**Response varies by role:**
- SuperAdmin: Platform-wide stats
- SchoolAdmin: School-specific stats
- Teacher: Class-specific stats
- Student: Personal stats

---

## Role-Based Access Summary

| Route | SuperAdmin | SchoolAdmin | Teacher | Student |
|-------|-----------|-------------|---------|---------|
| Schools | ✅ Full | ❌ | ❌ | ❌ |
| Revenue | ✅ | ❌ | ❌ | ❌ |
| Students | ✅ View | ✅ Full | ✅ View | ❌ |
| Teachers | ✅ View | ✅ Full | ✅ View | ❌ |
| Attendance | ✅ View | ✅ Full | ✅ Mark | ✅ View Own |
| Fees | ✅ View | ✅ Full | ✅ View | ✅ View Own |
| Exams | ✅ View | ✅ Full | ✅ View | ✅ View Own |
| Homework | ✅ View | ✅ Full | ✅ Full | ✅ View Own |
| Announcements | ✅ View | ✅ Full | ✅ View | ✅ View Own |
| Student Portal | ❌ | ❌ | ❌ | ✅ |

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Data Isolation

All data is isolated by `schoolId`:
- SuperAdmin can access all schools
- SchoolAdmin, Teacher, Student can only access their own school data
- Middleware automatically filters data based on user's schoolId
