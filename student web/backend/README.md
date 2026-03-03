# School Management System - Backend API

Express.js + MongoDB backend for the School Management System. Serves both the desktop admin app and the student/parent web portal.

## Features

- User authentication with JWT
- Student management
- Attendance tracking
- Announcements system
- Role-based access (Admin, Student, Parent)
- RESTful API design

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Install MongoDB

Download and install MongoDB Community Edition from:
https://www.mongodb.com/try/download/community

Or use MongoDB Atlas (cloud) for free.

### 3. Configure Environment

Edit the `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school-management
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on:
- Local: http://localhost:5000
- Network: http://YOUR_PC_IP:5000

## API Endpoints

### Authentication

**POST /api/auth/login**
- Login for students, parents, and admins
- Body: `{ email, password, role }`
- Returns: `{ token, user }`

**POST /api/auth/register**
- Create new user account (admin only)
- Body: `{ name, email, password, role, linkedStudentId }`
- Returns: `{ user }`

### Students

**GET /api/students**
- Get all students
- Protected route

**GET /api/students/:id**
- Get student by ID
- Protected route

**GET /api/students/profile/:userId**
- Get student profile by user ID
- Protected route

**GET /api/students/:id/attendance**
- Get attendance records for a student
- Query params: `month`, `year`
- Protected route

**GET /api/students/:id/attendance/summary**
- Get attendance summary for a student
- Protected route

**POST /api/students**
- Create new student
- Protected route (admin only)

**PUT /api/students/:id**
- Update student
- Protected route (admin only)

**DELETE /api/students/:id**
- Delete student
- Protected route (admin only)

### Announcements

**GET /api/announcements**
- Get all announcements
- Query params: `limit` (optional)
- Protected route

**GET /api/announcements/:id**
- Get announcement by ID
- Protected route

**POST /api/announcements**
- Create new announcement
- Protected route (admin only)

**PUT /api/announcements/:id**
- Update announcement
- Protected route (admin only)

**DELETE /api/announcements/:id**
- Delete announcement
- Protected route (admin only)

## Database Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student/parent/admin),
  linkedStudentId: ObjectId (ref: Student),
  createdAt: Date
}
```

### Student
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  class: String,
  section: String,
  rollNumber: String,
  parentName: String,
  parentPhone: String,
  createdAt: Date
}
```

### Attendance
```javascript
{
  studentId: ObjectId (ref: Student),
  date: Date,
  status: String (Present/Absent),
  createdAt: Date
}
```

### Announcement
```javascript
{
  title: String,
  message: String,
  createdAt: Date
}
```

## Creating User Accounts

Use the `/api/auth/register` endpoint to create accounts:

### Create Admin Account
```json
{
  "name": "Admin User",
  "email": "admin@school.com",
  "password": "admin123",
  "role": "admin"
}
```

### Create Student Account
```json
{
  "name": "John Doe",
  "email": "john@school.com",
  "password": "student123",
  "role": "student",
  "linkedStudentId": "STUDENT_MONGODB_ID"
}
```

### Create Parent Account
```json
{
  "name": "Jane Doe",
  "email": "jane@school.com",
  "password": "parent123",
  "role": "parent",
  "linkedStudentId": "STUDENT_MONGODB_ID"
}
```

## Network Access

To allow network access:

1. Server already listens on `0.0.0.0` (all interfaces)
2. Find your PC's IP address
3. Configure firewall to allow port 5000
4. Update frontend `.env` files with your IP

## Testing the API

Use Postman, Insomnia, or curl to test endpoints:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@school.com","password":"student123","role":"student"}'

# Get students (with token)
curl http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### MongoDB connection error
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env
- For Atlas, ensure IP is whitelisted

### Port already in use
- Change PORT in .env
- Kill process using port 5000: `npx kill-port 5000`

### JWT errors
- Ensure JWT_SECRET is set in .env
- Check token format in Authorization header

## Security Notes

- Change JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting
- Add input validation
- Use environment variables for sensitive data
- Never commit .env file to version control

## Development Tips

- Use `npm run dev` for auto-restart on file changes
- Check MongoDB with MongoDB Compass
- Use Postman collections for API testing
- Enable CORS for frontend development
