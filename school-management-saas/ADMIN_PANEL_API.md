# Admin Panel API Documentation

Complete API reference for School Management SaaS Admin Panel.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All requests (except login/register) require JWT token in Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 1️⃣ STUDENT MANAGEMENT

### Create Student
```http
POST /api/students
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@student.com",
  "password": "student123",
  "phone": "1234567890",
  "rollNumber": "2024001",
  "class": "10",
  "section": "A",
  "dateOfBirth": "2010-05-15",
  "parentName": "Mr. Doe",
  "parentPhone": "9876543210",
  "address": "123 Student Street"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65f123...",
    "userId": {
      "_id": "65f456...",
      "name": "John Doe",
      "email": "john.doe@student.com",
      "isActive": true
    },
    "rollNumber": "2024001",
    "class": "10",
    "section": "A",
    "parentName": "Mr. Doe",
    "parentPhone": "9876543210"
  }
}
```

---

### Get All Students
```http
GET /api/students?class=10&section=A&search=john
Authorization: Bearer TOKEN
```

**Query Parameters:**
- `class` (optional) - Filter by class
- `section` (optional) - Filter by section
- `search` (optional) - Search by name

**Response (200):**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "65f123...",
      "userId": {
        "name": "John Doe",
        "email": "john.doe@student.com"
      },
      "rollNumber": "2024001",
      "class": "10",
      "section": "A"
    }
  ]
}
```

---

### Get Single Student
```http
GET /api/students/:id
Authorization: Bearer TOKEN
```

---

### Update Student
```http
PUT /api/students/:id
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "class": "11",
  "section": "B",
  "parentPhone": "9999999999"
}
```

---

### Delete Student
```http
DELETE /api/students/:id
Authorization: Bearer TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Student deleted successfully"
  }
}
```

---

## 2️⃣ TEACHER MANAGEMENT

### Create Teacher
```http
POST /api/teachers
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Mr. Robert Smith",
  "email": "robert@teacher.com",
  "password": "teacher123",
  "phone": "5551234567",
  "employeeId": "EMP001",
  "subject": "Mathematics",
  "qualification": "M.Sc Mathematics",
  "address": "456 Teacher Avenue",
  "salary": 50000
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65f789...",
    "userId": {
      "name": "Mr. Robert Smith",
      "email": "robert@teacher.com"
    },
    "employeeId": "EMP001",
    "subject": "Mathematics",
    "salary": 50000
  }
}
```

---

### Get All Teachers
```http
GET /api/teachers?subject=Mathematics&search=robert
Authorization: Bearer TOKEN
```

**Query Parameters:**
- `subject` (optional) - Filter by subject
- `search` (optional) - Search by name

---

### Update Teacher
```http
PUT /api/teachers/:id
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "salary": 55000,
  "subject": "Advanced Mathematics"
}
```

---

### Delete Teacher
```http
DELETE /api/teachers/:id
Authorization: Bearer TOKEN
```

---

## 3️⃣ ATTENDANCE MANAGEMENT

### Mark Attendance (Bulk)
```http
POST /api/attendance/mark
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "date": "2024-03-04",
  "students": [
    {
      "studentId": "65f123...",
      "status": "Present",
      "remarks": "On time"
    },
    {
      "studentId": "65f456...",
      "status": "Absent",
      "remarks": "Sick leave"
    },
    {
      "studentId": "65f789...",
      "status": "Late",
      "remarks": "Arrived 10 mins late"
    }
  ]
}
```

**Status Options:** `Present`, `Absent`, `Late`, `Excused`

**Response (201):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65fabc...",
      "studentId": "65f123...",
      "date": "2024-03-04",
      "status": "Present",
      "remarks": "On time"
    }
  ],
  "errors": [],
  "message": "3 attendance records marked successfully"
}
```

---

### Get Attendance by Class
```http
GET /api/attendance/class?class=10&section=A&date=2024-03-04
Authorization: Bearer TOKEN
```

**Required Parameters:**
- `class` - Class name
- `date` - Date (YYYY-MM-DD)

**Optional Parameters:**
- `section` - Section name

**Response (200):**
```json
{
  "success": true,
  "count": 30,
  "data": [
    {
      "student": {
        "_id": "65f123...",
        "name": "John Doe",
        "rollNumber": "2024001",
        "class": "10",
        "section": "A"
      },
      "attendance": {
        "status": "Present",
        "remarks": "On time",
        "markedAt": "2024-03-04T08:30:00.000Z"
      }
    },
    {
      "student": {
        "_id": "65f456...",
        "name": "Jane Smith",
        "rollNumber": "2024002",
        "class": "10",
        "section": "A"
      },
      "attendance": null
    }
  ]
}
```

---

### Get Student Attendance History
```http
GET /api/attendance?studentId=65f123...&startDate=2024-03-01&endDate=2024-03-31
Authorization: Bearer TOKEN
```

---

### Get Attendance Percentage
```http
GET /api/attendance/percentage/65f123...?startDate=2024-03-01&endDate=2024-03-31
Authorization: Bearer TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalDays": 20,
    "presentDays": 18,
    "absentDays": 2,
    "percentage": 90.00
  }
}
```

---

### Get Class Attendance Report
```http
GET /api/attendance/report?class=10&section=A&startDate=2024-03-01&endDate=2024-03-31
Authorization: Bearer TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "count": 30,
  "data": [
    {
      "student": {
        "_id": "65f123...",
        "name": "John Doe",
        "rollNumber": "2024001"
      },
      "totalDays": 20,
      "presentDays": 18,
      "absentDays": 2,
      "percentage": 90.00
    }
  ]
}
```

---

## 4️⃣ FEE MANAGEMENT

### Create Fee Record
```http
POST /api/fees
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "studentId": "65f123...",
  "amount": 5000,
  "dueDate": "2024-04-01",
  "feeType": "Tuition",
  "month": "March",
  "year": 2024
}
```

**Fee Types:** `Tuition`, `Transport`, `Library`, `Lab`, `Other`

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65fdef...",
    "studentId": {
      "_id": "65f123...",
      "userId": {
        "name": "John Doe"
      }
    },
    "amount": 5000,
    "paidAmount": 0,
    "status": "Pending",
    "feeType": "Tuition",
    "month": "March",
    "year": 2024
  }
}
```

---

### Create Bulk Fees for Class
```http
POST /api/fees/bulk
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "class": "10",
  "section": "A",
  "amount": 5000,
  "dueDate": "2024-04-01",
  "feeType": "Tuition",
  "month": "March",
  "year": 2024
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "30 fee records created successfully",
  "data": {
    "fees": [...],
    "errors": [],
    "created": 30
  }
}
```

---

### Get Fees
```http
GET /api/fees?studentId=65f123...&status=Pending&feeType=Tuition&month=March&year=2024
Authorization: Bearer TOKEN
```

**Query Parameters (all optional):**
- `studentId` - Filter by student
- `status` - Filter by status (Paid/Pending/Overdue)
- `feeType` - Filter by fee type
- `month` - Filter by month
- `year` - Filter by year

---

### Record Payment
```http
PUT /api/fees/:id/pay
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "paidAmount": 2000
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "65fdef...",
    "amount": 5000,
    "paidAmount": 2000,
    "dueAmount": 3000,
    "status": "Pending"
  }
}
```

---

### Get Unpaid Students
```http
GET /api/fees/unpaid?class=10
Authorization: Bearer TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "student": {
        "_id": "65f123...",
        "userId": {
          "name": "John Doe"
        },
        "rollNumber": "2024001",
        "class": "10"
      },
      "fees": [
        {
          "_id": "65fdef...",
          "amount": 5000,
          "paidAmount": 2000,
          "dueAmount": 3000,
          "feeType": "Tuition"
        }
      ],
      "totalDue": 3000
    }
  ]
}
```

---

### Get Student Fee Summary
```http
GET /api/fees/summary/:studentId
Authorization: Bearer TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalAmount": 15000,
    "totalPaid": 10000,
    "totalDue": 5000,
    "paidCount": 2,
    "pendingCount": 1,
    "overdueCount": 0
  }
}
```

---

## 5️⃣ EXAM & RESULTS MANAGEMENT

### Create Exam
```http
POST /api/exams
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "examName": "Mid Term Exam",
  "class": "10",
  "section": "A",
  "examDate": "2024-04-15",
  "subjects": [
    {
      "subjectName": "Mathematics",
      "totalMarks": 100
    },
    {
      "subjectName": "Science",
      "totalMarks": 100
    },
    {
      "subjectName": "English",
      "totalMarks": 100
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65fghi...",
    "examName": "Mid Term Exam",
    "class": "10",
    "section": "A",
    "examDate": "2024-04-15",
    "subjects": [...],
    "status": "Scheduled"
  }
}
```

---

### Get All Exams
```http
GET /api/exams?class=10&section=A&status=Completed
Authorization: Bearer TOKEN
```

**Query Parameters (all optional):**
- `class` - Filter by class
- `section` - Filter by section
- `status` - Filter by status (Scheduled/Ongoing/Completed)

---

### Update Exam
```http
PUT /api/exams/:id
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "status": "Completed",
  "examDate": "2024-04-16"
}
```

---

### Delete Exam
```http
DELETE /api/exams/:id
Authorization: Bearer TOKEN
```

---

### Add Result for Student
```http
POST /api/exams/results
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "studentId": "65f123...",
  "examId": "65fghi...",
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
    },
    {
      "subject": "English",
      "marksObtained": 78,
      "totalMarks": 100
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "65fjkl...",
    "studentId": "65f123...",
    "examId": "65fghi...",
    "marks": [...],
    "totalMarksObtained": 253,
    "totalMarks": 300,
    "percentage": 84.33,
    "grade": "A"
  }
}
```

**Grade Calculation:**
- A+: 90% and above
- A: 80-89%
- B+: 70-79%
- B: 60-69%
- C: 50-59%
- D: 40-49%
- F: Below 40%

---

### Get Exam Results
```http
GET /api/exams/:id/results
Authorization: Bearer TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "count": 30,
  "data": [
    {
      "_id": "65fjkl...",
      "studentId": {
        "_id": "65f123...",
        "userId": {
          "name": "John Doe"
        },
        "rollNumber": "2024001"
      },
      "percentage": 84.33,
      "grade": "A",
      "totalMarksObtained": 253,
      "totalMarks": 300
    }
  ]
}
```

---

### Get Student Results
```http
GET /api/exams/results/student/:studentId
Authorization: Bearer TOKEN
```

---

### Get Exam Statistics
```http
GET /api/exams/:id/statistics
Authorization: Bearer TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalStudents": 30,
    "averagePercentage": "75.50",
    "highestPercentage": 95.33,
    "lowestPercentage": 45.67,
    "passCount": 28,
    "failCount": 2,
    "passPercentage": "93.33"
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Email already registered"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "User role Teacher is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Student not found"
}
```

---

## Testing in Postman

### 1. Setup Environment
Create environment variables:
- `BASE_URL`: http://localhost:5000/api
- `TOKEN`: (will be set after login)

### 2. Login
```http
POST {{BASE_URL}}/auth/login
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

Save the token from response to `TOKEN` variable.

### 3. Test Endpoints
Use `{{BASE_URL}}` and `{{TOKEN}}` in your requests.

---

## Role-Based Access

| Feature | SuperAdmin | SchoolAdmin | Teacher | Student |
|---------|-----------|-------------|---------|---------|
| Create Student | ✅ | ✅ | ❌ | ❌ |
| View Students | ✅ | ✅ | ✅ | ❌ |
| Create Teacher | ✅ | ✅ | ❌ | ❌ |
| Mark Attendance | ✅ | ✅ | ✅ | ❌ |
| Create Fees | ✅ | ✅ | ❌ | ❌ |
| View Fees | ✅ | ✅ | ✅ | ✅ |
| Create Exam | ✅ | ✅ | ❌ | ❌ |
| Add Results | ✅ | ✅ | ✅ | ❌ |
| View Results | ✅ | ✅ | ✅ | ✅ |

---

## Multi-Tenant Data Isolation

All data is automatically filtered by `schoolId`:
- SchoolAdmin can only access their school's data
- Teachers can only access their school's data
- Students can only access their own data
- SuperAdmin can access all schools' data

---

**Complete API implementation ready for production! 🚀**
