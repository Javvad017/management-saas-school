# Postman Testing Guide

Complete guide to test all Admin Panel APIs using Postman.

## Setup

### 1. Create Environment
Create a new environment in Postman with these variables:

| Variable | Initial Value | Current Value |
|----------|--------------|---------------|
| BASE_URL | http://localhost:5000/api | |
| TOKEN | | (will be set after login) |
| SCHOOL_ID | | (will be set after school creation) |
| STUDENT_ID | | (will be set after student creation) |
| TEACHER_ID | | (will be set after teacher creation) |
| EXAM_ID | | (will be set after exam creation) |

---

## Test Flow

### Phase 1: Authentication

#### 1.1 Create SuperAdmin
```
POST {{BASE_URL}}/auth/register
Content-Type: application/json

{
  "name": "Super Admin",
  "email": "superadmin@test.com",
  "password": "admin123",
  "role": "SuperAdmin"
}
```

**Tests Script:**
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Token is present", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.token).to.exist;
    pm.environment.set("TOKEN", jsonData.data.token);
});
```

#### 1.2 Create School
```
POST {{BASE_URL}}/schools
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "name": "Test School",
  "address": "123 School St",
  "phone": "1234567890",
  "email": "test@school.com",
  "adminName": "School Admin",
  "adminEmail": "admin@test.com",
  "adminPassword": "admin123"
}
```

**Tests Script:**
```javascript
pm.test("School created", function () {
    var jsonData = pm.response.json();
    pm.environment.set("SCHOOL_ID", jsonData.data._id);
});
```

#### 1.3 Login as School Admin
```
POST {{BASE_URL}}/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

**Tests Script:**
```javascript
pm.test("Login successful", function () {
    var jsonData = pm.response.json();
    pm.environment.set("TOKEN", jsonData.data.token);
});
```

---

### Phase 2: Student Management

#### 2.1 Create Student
```
POST {{BASE_URL}}/students
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@student.com",
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

**Tests Script:**
```javascript
pm.test("Student created", function () {
    var jsonData = pm.response.json();
    pm.environment.set("STUDENT_ID", jsonData.data._id);
});
```

#### 2.2 Get All Students
```
GET {{BASE_URL}}/students
Authorization: Bearer {{TOKEN}}
```

#### 2.3 Get Students by Class
```
GET {{BASE_URL}}/students?class=10&section=A
Authorization: Bearer {{TOKEN}}
```

#### 2.4 Search Students
```
GET {{BASE_URL}}/students?search=john
Authorization: Bearer {{TOKEN}}
```

#### 2.5 Get Single Student
```
GET {{BASE_URL}}/students/{{STUDENT_ID}}
Authorization: Bearer {{TOKEN}}
```

#### 2.6 Update Student
```
PUT {{BASE_URL}}/students/{{STUDENT_ID}}
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "class": "11",
  "section": "B"
}
```

---

### Phase 3: Teacher Management

#### 3.1 Create Teacher
```
POST {{BASE_URL}}/teachers
Authorization: Bearer {{TOKEN}}
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

**Tests Script:**
```javascript
pm.test("Teacher created", function () {
    var jsonData = pm.response.json();
    pm.environment.set("TEACHER_ID", jsonData.data._id);
});
```

#### 3.2 Get All Teachers
```
GET {{BASE_URL}}/teachers
Authorization: Bearer {{TOKEN}}
```

#### 3.3 Filter Teachers by Subject
```
GET {{BASE_URL}}/teachers?subject=Mathematics
Authorization: Bearer {{TOKEN}}
```

#### 3.4 Update Teacher
```
PUT {{BASE_URL}}/teachers/{{TEACHER_ID}}
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "salary": 55000
}
```

---

### Phase 4: Attendance Management

#### 4.1 Mark Attendance (Bulk)
```
POST {{BASE_URL}}/attendance/mark
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "date": "2024-03-04",
  "students": [
    {
      "studentId": "{{STUDENT_ID}}",
      "status": "Present",
      "remarks": "On time"
    }
  ]
}
```

#### 4.2 Get Attendance by Class
```
GET {{BASE_URL}}/attendance/class?class=10&section=A&date=2024-03-04
Authorization: Bearer {{TOKEN}}
```

#### 4.3 Get Student Attendance History
```
GET {{BASE_URL}}/attendance?studentId={{STUDENT_ID}}&startDate=2024-03-01&endDate=2024-03-31
Authorization: Bearer {{TOKEN}}
```

#### 4.4 Get Attendance Percentage
```
GET {{BASE_URL}}/attendance/percentage/{{STUDENT_ID}}?startDate=2024-03-01&endDate=2024-03-31
Authorization: Bearer {{TOKEN}}
```

#### 4.5 Get Class Attendance Report
```
GET {{BASE_URL}}/attendance/report?class=10&section=A&startDate=2024-03-01&endDate=2024-03-31
Authorization: Bearer {{TOKEN}}
```

---

### Phase 5: Fee Management

#### 5.1 Create Fee Record
```
POST {{BASE_URL}}/fees
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "studentId": "{{STUDENT_ID}}",
  "amount": 5000,
  "dueDate": "2024-04-01",
  "feeType": "Tuition",
  "month": "March",
  "year": 2024
}
```

#### 5.2 Create Bulk Fees for Class
```
POST {{BASE_URL}}/fees/bulk
Authorization: Bearer {{TOKEN}}
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

#### 5.3 Get All Fees
```
GET {{BASE_URL}}/fees
Authorization: Bearer {{TOKEN}}
```

#### 5.4 Get Student Fees
```
GET {{BASE_URL}}/fees?studentId={{STUDENT_ID}}
Authorization: Bearer {{TOKEN}}
```

#### 5.5 Get Pending Fees
```
GET {{BASE_URL}}/fees?status=Pending
Authorization: Bearer {{TOKEN}}
```

#### 5.6 Record Payment
```
PUT {{BASE_URL}}/fees/{{FEE_ID}}/pay
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "paidAmount": 2000
}
```

#### 5.7 Get Unpaid Students
```
GET {{BASE_URL}}/fees/unpaid
Authorization: Bearer {{TOKEN}}
```

#### 5.8 Get Student Fee Summary
```
GET {{BASE_URL}}/fees/summary/{{STUDENT_ID}}
Authorization: Bearer {{TOKEN}}
```

---

### Phase 6: Exam & Results

#### 6.1 Create Exam
```
POST {{BASE_URL}}/exams
Authorization: Bearer {{TOKEN}}
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

**Tests Script:**
```javascript
pm.test("Exam created", function () {
    var jsonData = pm.response.json();
    pm.environment.set("EXAM_ID", jsonData.data._id);
});
```

#### 6.2 Get All Exams
```
GET {{BASE_URL}}/exams
Authorization: Bearer {{TOKEN}}
```

#### 6.3 Get Exams by Class
```
GET {{BASE_URL}}/exams?class=10&section=A
Authorization: Bearer {{TOKEN}}
```

#### 6.4 Update Exam
```
PUT {{BASE_URL}}/exams/{{EXAM_ID}}
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "status": "Completed"
}
```

#### 6.5 Add Result for Student
```
POST {{BASE_URL}}/exams/results
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "studentId": "{{STUDENT_ID}}",
  "examId": "{{EXAM_ID}}",
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

#### 6.6 Get Exam Results
```
GET {{BASE_URL}}/exams/{{EXAM_ID}}/results
Authorization: Bearer {{TOKEN}}
```

#### 6.7 Get Student Results
```
GET {{BASE_URL}}/exams/results/student/{{STUDENT_ID}}
Authorization: Bearer {{TOKEN}}
```

#### 6.8 Get Exam Statistics
```
GET {{BASE_URL}}/exams/{{EXAM_ID}}/statistics
Authorization: Bearer {{TOKEN}}
```

---

## Common Test Scripts

### Check Success Response
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
});
```

### Check Data Exists
```javascript
pm.test("Data exists", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.exist;
});
```

### Check Array Response
```javascript
pm.test("Data is array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.be.an('array');
});

pm.test("Count matches array length", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.count).to.equal(jsonData.data.length);
});
```

---

## Error Testing

### Test Invalid Token
```
GET {{BASE_URL}}/students
Authorization: Bearer invalid_token
```

**Expected:** 401 Unauthorized

### Test Missing Required Fields
```
POST {{BASE_URL}}/students
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "name": "Test Student"
}
```

**Expected:** 400 Bad Request

### Test Duplicate Email
```
POST {{BASE_URL}}/students
Authorization: Bearer {{TOKEN}}
Content-Type: application/json

{
  "name": "Another Student",
  "email": "john@student.com",
  ...
}
```

**Expected:** 400 Bad Request - "Email already registered"

---

## Collection Organization

### Folder Structure
```
School Management API
├── 1. Authentication
│   ├── Register SuperAdmin
│   ├── Create School
│   └── Login as School Admin
├── 2. Student Management
│   ├── Create Student
│   ├── Get All Students
│   ├── Get Student by ID
│   ├── Update Student
│   └── Delete Student
├── 3. Teacher Management
│   ├── Create Teacher
│   ├── Get All Teachers
│   ├── Get Teacher by ID
│   ├── Update Teacher
│   └── Delete Teacher
├── 4. Attendance
│   ├── Mark Attendance
│   ├── Get Attendance by Class
│   ├── Get Student Attendance
│   ├── Get Attendance Percentage
│   └── Get Class Report
├── 5. Fee Management
│   ├── Create Fee
│   ├── Create Bulk Fees
│   ├── Get Fees
│   ├── Record Payment
│   ├── Get Unpaid Students
│   └── Get Student Summary
└── 6. Exams & Results
    ├── Create Exam
    ├── Get Exams
    ├── Update Exam
    ├── Add Result
    ├── Get Exam Results
    ├── Get Student Results
    └── Get Exam Statistics
```

---

## Quick Test Sequence

Run these in order for complete testing:

1. ✅ Register SuperAdmin
2. ✅ Create School
3. ✅ Login as School Admin
4. ✅ Create 3 Students
5. ✅ Create 2 Teachers
6. ✅ Mark Attendance for all students
7. ✅ Create Bulk Fees for class
8. ✅ Record payment for 1 student
9. ✅ Create Exam
10. ✅ Add Results for all students
11. ✅ Get Exam Statistics

---

## Tips

1. **Save Responses:** Use environment variables to save IDs from responses
2. **Use Pre-request Scripts:** Set up data before requests
3. **Chain Requests:** Use Collection Runner for sequential testing
4. **Export Collection:** Share with team members
5. **Use Variables:** Keep BASE_URL and TOKEN in environment

---

**Happy Testing! 🚀**
