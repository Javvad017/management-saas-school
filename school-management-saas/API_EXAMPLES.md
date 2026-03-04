# API Usage Examples

## Authentication

### Register User
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Student",
  "schoolId": "65abc123def456789"
}
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "65abc123def456789",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Student",
    "schoolId": "65abc123def456789",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Current User
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN
```

## School Management

### Create School (SuperAdmin only)
```bash
POST http://localhost:5000/api/schools
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "name": "ABC International School",
  "address": "123 Education Lane, City",
  "phone": "+1234567890",
  "email": "contact@abcschool.com",
  "adminName": "Admin Name",
  "adminEmail": "admin@abcschool.com",
  "adminPassword": "securepassword"
}
```

### Get All Schools
```bash
GET http://localhost:5000/api/schools
Authorization: Bearer SUPERADMIN_TOKEN
```

### Get Single School
```bash
GET http://localhost:5000/api/schools/65abc123def456789
Authorization: Bearer YOUR_TOKEN
```

## Student Management

### Create Student (SchoolAdmin only)
```bash
POST http://localhost:5000/api/students
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@student.com",
  "password": "student123",
  "rollNumber": "2024001",
  "class": "10",
  "section": "A",
  "dateOfBirth": "2010-05-15",
  "parentName": "Mr. Smith",
  "parentPhone": "+1987654321",
  "address": "456 Student Street, City"
}
```

### Get All Students
```bash
GET http://localhost:5000/api/students
Authorization: Bearer YOUR_TOKEN
```

### Get Students by School (SuperAdmin)
```bash
GET http://localhost:5000/api/students?schoolId=65abc123def456789
Authorization: Bearer SUPERADMIN_TOKEN
```

### Get Single Student
```bash
GET http://localhost:5000/api/students/65abc123def456789
Authorization: Bearer YOUR_TOKEN
```

### Update Student
```bash
PUT http://localhost:5000/api/students/65abc123def456789
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "class": "11",
  "section": "B",
  "parentPhone": "+1987654322"
}
```

### Delete Student
```bash
DELETE http://localhost:5000/api/students/65abc123def456789
Authorization: Bearer SCHOOLADMIN_TOKEN
```

## Teacher Management

### Create Teacher
```bash
POST http://localhost:5000/api/teachers
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "name": "Mr. Johnson",
  "email": "johnson@teacher.com",
  "password": "teacher123",
  "employeeId": "EMP001",
  "subject": "Mathematics",
  "qualification": "M.Sc Mathematics",
  "phone": "+1555123456",
  "address": "789 Teacher Avenue",
  "salary": 50000
}
```

### Get All Teachers
```bash
GET http://localhost:5000/api/teachers
Authorization: Bearer YOUR_TOKEN
```

### Update Teacher
```bash
PUT http://localhost:5000/api/teachers/65abc123def456789
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "salary": 55000,
  "subject": "Advanced Mathematics"
}
```

## Attendance Management

### Mark Attendance
```bash
POST http://localhost:5000/api/attendance
Authorization: Bearer TEACHER_TOKEN
Content-Type: application/json

{
  "studentId": "65abc123def456789",
  "date": "2024-03-04",
  "status": "Present",
  "remarks": "On time"
}
```

Status options: "Present", "Absent", "Late", "Excused"

### Get Attendance Records
```bash
GET http://localhost:5000/api/attendance
Authorization: Bearer YOUR_TOKEN
```

### Get Attendance by Student
```bash
GET http://localhost:5000/api/attendance?studentId=65abc123def456789
Authorization: Bearer YOUR_TOKEN
```

### Get Attendance by Date Range
```bash
GET http://localhost:5000/api/attendance?startDate=2024-03-01&endDate=2024-03-31
Authorization: Bearer YOUR_TOKEN
```

## Fee Management

### Create Fee Record
```bash
POST http://localhost:5000/api/fees
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "studentId": "65abc123def456789",
  "amount": 5000,
  "dueDate": "2024-04-01",
  "feeType": "Tuition",
  "month": "March",
  "year": 2024
}
```

Fee types: "Tuition", "Transport", "Library", "Lab", "Other"

### Get Fee Records
```bash
GET http://localhost:5000/api/fees
Authorization: Bearer YOUR_TOKEN
```

### Get Fees by Student
```bash
GET http://localhost:5000/api/fees?studentId=65abc123def456789
Authorization: Bearer YOUR_TOKEN
```

### Get Fees by Status
```bash
GET http://localhost:5000/api/fees?status=Pending
Authorization: Bearer YOUR_TOKEN
```

### Update Fee Payment
```bash
PUT http://localhost:5000/api/fees/65abc123def456789/pay
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "paidAmount": 5000
}
```

## Dashboard

### Get Dashboard Statistics
```bash
GET http://localhost:5000/api/dashboard/stats
Authorization: Bearer YOUR_TOKEN
```

Response:
```json
{
  "success": true,
  "data": {
    "totalStudents": 150,
    "totalTeachers": 25,
    "presentToday": 140,
    "absentToday": 10,
    "pendingFees": 45,
    "totalPendingAmount": 225000
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error message"
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
  "error": "User role SchoolAdmin is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Server Error"
}
```

## Testing with cURL

### Example: Complete Flow

1. Register SuperAdmin:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Super Admin","email":"super@admin.com","password":"admin123","role":"SuperAdmin"}'
```

2. Create School:
```bash
curl -X POST http://localhost:5000/api/schools \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test School","address":"123 St","phone":"1234567890","email":"test@school.com","adminName":"Admin","adminEmail":"admin@test.com","adminPassword":"admin123"}'
```

3. Login as School Admin:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

4. Create Student:
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SCHOOLADMIN_TOKEN" \
  -d '{"name":"Student One","email":"student@test.com","password":"student123","rollNumber":"001","class":"10","section":"A","dateOfBirth":"2010-01-01","parentName":"Parent","parentPhone":"9876543210","address":"Address"}'
```
