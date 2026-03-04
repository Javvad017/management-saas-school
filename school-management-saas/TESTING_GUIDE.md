# Testing Guide

## Prerequisites

- Backend running on http://localhost:5000
- MongoDB running on localhost:27017
- Postman, Thunder Client, or curl installed

## Test Flow

### Phase 1: Authentication & School Setup

#### 1.1 Create SuperAdmin

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Super Admin",
  "email": "superadmin@test.com",
  "password": "admin123",
  "role": "SuperAdmin"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Super Admin",
    "email": "superadmin@test.com",
    "role": "SuperAdmin",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token as SUPERADMIN_TOKEN**

#### 1.2 Verify SuperAdmin Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "superadmin@test.com",
  "password": "admin123"
}
```

**Expected:** Same response as registration

#### 1.3 Get Current User

```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer SUPERADMIN_TOKEN
```

**Expected:** User details without password

#### 1.4 Create School

```bash
POST http://localhost:5000/api/schools
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "name": "ABC International School",
  "address": "123 Education Lane, New York",
  "phone": "+1234567890",
  "email": "contact@abcschool.com",
  "adminName": "John Admin",
  "adminEmail": "admin@abcschool.com",
  "adminPassword": "admin123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "ABC International School",
    "address": "123 Education Lane, New York",
    "phone": "+1234567890",
    "email": "contact@abcschool.com",
    "adminId": "...",
    "isActive": true,
    "subscriptionStatus": "trial"
  }
}
```

**Save the school _id as SCHOOL_ID**

#### 1.5 Login as School Admin

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@abcschool.com",
  "password": "admin123"
}
```

**Save the token as SCHOOLADMIN_TOKEN**

### Phase 2: Student Management

#### 2.1 Create Student

```bash
POST http://localhost:5000/api/students
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@student.com",
  "password": "student123",
  "rollNumber": "2024001",
  "class": "10",
  "section": "A",
  "dateOfBirth": "2010-05-15",
  "parentName": "Mr. Johnson",
  "parentPhone": "+1987654321",
  "address": "456 Student Street, New York"
}
```

**Expected:** Student created with userId populated

**Save the student _id as STUDENT_ID**

#### 2.2 Get All Students

```bash
GET http://localhost:5000/api/students
Authorization: Bearer SCHOOLADMIN_TOKEN
```

**Expected:** Array of students for the school

#### 2.3 Get Single Student

```bash
GET http://localhost:5000/api/students/STUDENT_ID
Authorization: Bearer SCHOOLADMIN_TOKEN
```

**Expected:** Single student details

#### 2.4 Update Student

```bash
PUT http://localhost:5000/api/students/STUDENT_ID
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "class": "11",
  "section": "B"
}
```

**Expected:** Updated student details

#### 2.5 Test Student Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "alice@student.com",
  "password": "student123"
}
```

**Save the token as STUDENT_TOKEN**

### Phase 3: Teacher Management

#### 3.1 Create Teacher

```bash
POST http://localhost:5000/api/teachers
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "name": "Mr. Robert Smith",
  "email": "robert@teacher.com",
  "password": "teacher123",
  "employeeId": "EMP001",
  "subject": "Mathematics",
  "qualification": "M.Sc Mathematics",
  "phone": "+1555123456",
  "address": "789 Teacher Avenue, New York",
  "salary": 50000
}
```

**Save the teacher _id as TEACHER_ID**

#### 3.2 Get All Teachers

```bash
GET http://localhost:5000/api/teachers
Authorization: Bearer SCHOOLADMIN_TOKEN
```

**Expected:** Array of teachers

#### 3.3 Update Teacher

```bash
PUT http://localhost:5000/api/teachers/TEACHER_ID
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "salary": 55000
}
```

#### 3.4 Test Teacher Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "robert@teacher.com",
  "password": "teacher123"
}
```

**Save the token as TEACHER_TOKEN**

### Phase 4: Attendance Management

#### 4.1 Mark Attendance (as Teacher)

```bash
POST http://localhost:5000/api/attendance
Authorization: Bearer TEACHER_TOKEN
Content-Type: application/json

{
  "studentId": "STUDENT_ID",
  "date": "2024-03-04",
  "status": "Present",
  "remarks": "On time"
}
```

**Expected:** Attendance record created

#### 4.2 Mark Another Attendance

```bash
POST http://localhost:5000/api/attendance
Authorization: Bearer TEACHER_TOKEN
Content-Type: application/json

{
  "studentId": "STUDENT_ID",
  "date": "2024-03-05",
  "status": "Absent",
  "remarks": "Sick leave"
}
```

#### 4.3 Get All Attendance

```bash
GET http://localhost:5000/api/attendance
Authorization: Bearer TEACHER_TOKEN
```

**Expected:** Array of attendance records

#### 4.4 Get Attendance by Student

```bash
GET http://localhost:5000/api/attendance?studentId=STUDENT_ID
Authorization: Bearer STUDENT_TOKEN
```

**Expected:** Attendance records for that student only

#### 4.5 Test Duplicate Prevention

```bash
POST http://localhost:5000/api/attendance
Authorization: Bearer TEACHER_TOKEN
Content-Type: application/json

{
  "studentId": "STUDENT_ID",
  "date": "2024-03-04",
  "status": "Present"
}
```

**Expected:** Error - duplicate entry

### Phase 5: Fee Management

#### 5.1 Create Fee Record

```bash
POST http://localhost:5000/api/fees
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "studentId": "STUDENT_ID",
  "amount": 5000,
  "dueDate": "2024-04-01",
  "feeType": "Tuition",
  "month": "March",
  "year": 2024
}
```

**Save the fee _id as FEE_ID**

#### 5.2 Create Multiple Fee Records

```bash
POST http://localhost:5000/api/fees
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "studentId": "STUDENT_ID",
  "amount": 1000,
  "dueDate": "2024-04-01",
  "feeType": "Transport",
  "month": "March",
  "year": 2024
}
```

#### 5.3 Get All Fees

```bash
GET http://localhost:5000/api/fees
Authorization: Bearer SCHOOLADMIN_TOKEN
```

**Expected:** Array of fee records

#### 5.4 Get Fees by Student

```bash
GET http://localhost:5000/api/fees?studentId=STUDENT_ID
Authorization: Bearer STUDENT_TOKEN
```

**Expected:** Fee records for that student

#### 5.5 Get Pending Fees

```bash
GET http://localhost:5000/api/fees?status=Pending
Authorization: Bearer SCHOOLADMIN_TOKEN
```

**Expected:** Only pending fees

#### 5.6 Update Fee Payment (Partial)

```bash
PUT http://localhost:5000/api/fees/FEE_ID/pay
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "paidAmount": 2000
}
```

**Expected:** Fee status still "Pending", paidAmount = 2000

#### 5.7 Complete Fee Payment

```bash
PUT http://localhost:5000/api/fees/FEE_ID/pay
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "paidAmount": 3000
}
```

**Expected:** Fee status = "Paid", paidAmount = 5000

### Phase 6: Dashboard Statistics

#### 6.1 Get Dashboard Stats

```bash
GET http://localhost:5000/api/dashboard/stats
Authorization: Bearer SCHOOLADMIN_TOKEN
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 1,
    "totalTeachers": 1,
    "presentToday": 0,
    "absentToday": 0,
    "pendingFees": 1,
    "totalPendingAmount": 1000
  }
}
```

### Phase 7: Authorization Testing

#### 7.1 Test Student Cannot Create Student

```bash
POST http://localhost:5000/api/students
Authorization: Bearer STUDENT_TOKEN
Content-Type: application/json

{
  "name": "Test",
  "email": "test@test.com",
  "password": "test123",
  "rollNumber": "999",
  "class": "10",
  "section": "A",
  "dateOfBirth": "2010-01-01",
  "parentName": "Parent",
  "parentPhone": "1234567890",
  "address": "Address"
}
```

**Expected:** 403 Forbidden

#### 7.2 Test Teacher Cannot Delete Student

```bash
DELETE http://localhost:5000/api/students/STUDENT_ID
Authorization: Bearer TEACHER_TOKEN
```

**Expected:** 403 Forbidden

#### 7.3 Test SchoolAdmin Cannot Create School

```bash
POST http://localhost:5000/api/schools
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "name": "Test School",
  "address": "Test",
  "phone": "123",
  "email": "test@school.com",
  "adminName": "Admin",
  "adminEmail": "admin@test.com",
  "adminPassword": "admin123"
}
```

**Expected:** 403 Forbidden

#### 7.4 Test No Token

```bash
GET http://localhost:5000/api/students
```

**Expected:** 401 Unauthorized

#### 7.5 Test Invalid Token

```bash
GET http://localhost:5000/api/students
Authorization: Bearer invalid_token_here
```

**Expected:** 401 Unauthorized

### Phase 8: Multi-Tenant Testing

#### 8.1 Create Second School

```bash
POST http://localhost:5000/api/schools
Authorization: Bearer SUPERADMIN_TOKEN
Content-Type: application/json

{
  "name": "XYZ School",
  "address": "456 School Road",
  "phone": "+1111111111",
  "email": "xyz@school.com",
  "adminName": "XYZ Admin",
  "adminEmail": "admin@xyz.com",
  "adminPassword": "admin123"
}
```

#### 8.2 Login as Second School Admin

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@xyz.com",
  "password": "admin123"
}
```

**Save as SCHOOLADMIN2_TOKEN**

#### 8.3 Verify Data Isolation

```bash
GET http://localhost:5000/api/students
Authorization: Bearer SCHOOLADMIN2_TOKEN
```

**Expected:** Empty array (no students in second school)

```bash
GET http://localhost:5000/api/students
Authorization: Bearer SCHOOLADMIN_TOKEN
```

**Expected:** Array with Alice Johnson (first school's student)

### Phase 9: Error Handling Testing

#### 9.1 Test Invalid Email Format

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test",
  "email": "invalid-email",
  "password": "test123",
  "role": "Student"
}
```

**Expected:** Validation error

#### 9.2 Test Duplicate Email

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test",
  "email": "alice@student.com",
  "password": "test123",
  "role": "Student",
  "schoolId": "SCHOOL_ID"
}
```

**Expected:** 400 - User already exists

#### 9.3 Test Invalid ObjectId

```bash
GET http://localhost:5000/api/students/invalid_id
Authorization: Bearer SCHOOLADMIN_TOKEN
```

**Expected:** 404 - Resource not found

#### 9.4 Test Missing Required Fields

```bash
POST http://localhost:5000/api/students
Authorization: Bearer SCHOOLADMIN_TOKEN
Content-Type: application/json

{
  "name": "Test Student"
}
```

**Expected:** Validation error listing missing fields

### Phase 10: Frontend Testing

#### 10.1 Test User Website

1. Open http://localhost:3000
2. Login with: alice@student.com / student123
3. Verify dashboard loads
4. Navigate to Attendance page
5. Verify attendance records display
6. Navigate to Fees page
7. Verify fee records display
8. Logout
9. Verify redirect to login

#### 10.2 Test Admin Desktop

1. Launch Electron app
2. Login with: admin@abcschool.com / admin123
3. Verify dashboard shows correct stats
4. Navigate to Students
5. Verify student list displays
6. Navigate to Teachers
7. Verify teacher list displays
8. Navigate to Attendance
9. Verify attendance records display
10. Navigate to Fees
11. Verify fee records display
12. Logout
13. Verify redirect to login

## Test Checklist

### Authentication ✓
- [x] Register SuperAdmin
- [x] Register SchoolAdmin (via school creation)
- [x] Register Student (via student creation)
- [x] Register Teacher (via teacher creation)
- [x] Login with valid credentials
- [x] Login with invalid credentials
- [x] Get current user
- [x] Token expiration handling

### Authorization ✓
- [x] SuperAdmin can create schools
- [x] SchoolAdmin can create students
- [x] SchoolAdmin can create teachers
- [x] Teacher can mark attendance
- [x] Student cannot create anything
- [x] Role-based access control

### Multi-Tenant ✓
- [x] Data isolation between schools
- [x] SchoolAdmin sees only their school data
- [x] SuperAdmin sees all schools

### CRUD Operations ✓
- [x] Create school
- [x] Create student
- [x] Create teacher
- [x] Create attendance
- [x] Create fee
- [x] Read all records
- [x] Read single record
- [x] Update records
- [x] Delete records

### Business Logic ✓
- [x] Password hashing
- [x] JWT token generation
- [x] Duplicate prevention (attendance)
- [x] Unique constraints (email, roll number)
- [x] Fee payment calculation
- [x] Dashboard statistics

### Error Handling ✓
- [x] Invalid credentials
- [x] Missing required fields
- [x] Duplicate entries
- [x] Invalid ObjectId
- [x] Unauthorized access
- [x] Forbidden actions

## Performance Testing

### Load Testing (Optional)

Use tools like Apache Bench or Artillery:

```bash
# Test login endpoint
ab -n 1000 -c 10 -p login.json -T application/json http://localhost:5000/api/auth/login

# Test get students endpoint
ab -n 1000 -c 10 -H "Authorization: Bearer TOKEN" http://localhost:5000/api/students
```

## Automated Testing (Future)

Consider adding:
- Jest for unit tests
- Supertest for API integration tests
- React Testing Library for frontend tests
- Cypress for E2E tests

## Conclusion

If all tests pass, your School Management SaaS system is working correctly and ready for:
- Development
- Demonstration
- Further customization
- Production deployment (with security hardening)
