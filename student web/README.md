# School Management System

A complete school management solution with separate interfaces for administrators, students, and parents.

## Project Structure

```
school-management/
├── backend/              # Express + MongoDB API server
├── desktop-app/          # Admin desktop application (Electron)
└── student-web/          # Student & Parent web portal (React)
```

## Components

### 1. Backend API (Port 5000)
- Express.js REST API
- MongoDB database
- JWT authentication
- Serves both desktop and web apps

### 2. Desktop Admin App (Port 3000)
- Electron-based desktop application
- For school administrators
- Manage students, attendance, announcements
- Create user accounts

### 3. Student/Parent Web Portal (Port 5174)
- React + Vite web application
- For students and parents
- View attendance, announcements
- Responsive design for all devices

## Quick Start

### 1. Setup Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on: http://localhost:5000

### 2. Setup Student Web Portal

```bash
cd student-web
npm install
npm run dev
```

Web portal runs on: http://localhost:5174

### 3. Setup Desktop Admin App (if needed)

```bash
cd desktop-app
npm install
npm start
```

Desktop app runs on: http://localhost:3000

## Network Setup for School

To make the system accessible across the school network:

### 1. Find Your PC's IP Address

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Mac/Linux:**
```bash
ifconfig
# or
ip addr
```

### 2. Update Configuration Files

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school-management
JWT_SECRET=your-secret-key
```

**Student Web (.env):**
```env
VITE_API_URL=http://192.168.1.100:5000/api
```

Replace `192.168.1.100` with your actual IP.

### 3. Configure Firewall

Allow incoming connections on:
- Port 5000 (Backend API)
- Port 5174 (Student Web)
- Port 3000 (Admin Desktop - optional)

**Windows Firewall:**
1. Open Windows Defender Firewall
2. Advanced Settings → Inbound Rules
3. New Rule → Port → TCP → Specific ports: 5000, 5174
4. Allow the connection

### 4. Access from Other Devices

- Admin Desktop: http://192.168.1.100:3000
- Student/Parent Web: http://192.168.1.100:5174
- API: http://192.168.1.100:5000

## User Roles

### Admin
- Full system access
- Manage students, attendance, announcements
- Create user accounts
- Access via desktop app

### Student
- View own attendance
- View announcements
- Access via web portal

### Parent
- View child's attendance
- View child's information
- View announcements
- Access via web portal

## Creating User Accounts

Admins create accounts through the desktop app or API:

### Via API (POST /api/auth/register)

**Student Account:**
```json
{
  "name": "John Doe",
  "email": "john@school.com",
  "password": "student123",
  "role": "student",
  "linkedStudentId": "STUDENT_ID_FROM_DB"
}
```

**Parent Account:**
```json
{
  "name": "Jane Doe",
  "email": "jane@school.com",
  "password": "parent123",
  "role": "parent",
  "linkedStudentId": "STUDENT_ID_FROM_DB"
}
```

## Workflow

1. **Admin** creates student records in desktop app
2. **Admin** creates user accounts (student/parent) linked to student records
3. **Students/Parents** login to web portal with credentials
4. **Admin** marks attendance daily
5. **Students/Parents** view attendance in real-time
6. **Admin** posts announcements
7. **Students/Parents** see announcements immediately

## Features

### Admin Features
- Student management (CRUD)
- Attendance tracking
- Announcement management
- User account creation
- Reports and analytics

### Student Features
- Personal dashboard
- Attendance history
- Monthly attendance reports
- School announcements
- Profile information

### Parent Features
- Child's dashboard
- Child's attendance tracking
- School announcements
- Child's profile information

## Technology Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Student/Parent Web
- React 18
- Vite
- Tailwind CSS
- React Router v6
- Axios

### Admin Desktop
- Electron
- React
- Material-UI or similar

## Database Schema

### Collections
- users (authentication)
- students (student records)
- attendance (daily attendance)
- announcements (school updates)

## Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Role-based access control
- Protected API routes
- CORS enabled for frontend

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify .env configuration
- Check if port 5000 is available

### Web portal can't connect
- Verify backend is running
- Check VITE_API_URL in .env
- Ensure firewall allows connections

### Login fails
- Verify user account exists
- Check email/password
- Ensure role matches (student/parent)

### Network access issues
- Verify IP address is correct
- Check firewall settings
- Ensure all devices on same network

## Production Deployment

### Backend
1. Use environment variables
2. Enable HTTPS
3. Use production MongoDB (Atlas)
4. Implement rate limiting
5. Add logging and monitoring

### Web Portal
1. Build: `npm run build`
2. Serve with nginx or similar
3. Enable HTTPS
4. Configure proper CORS

## Support

For issues or questions:
1. Check README files in each folder
2. Review API documentation
3. Contact system administrator

## License

Proprietary - School Use Only
