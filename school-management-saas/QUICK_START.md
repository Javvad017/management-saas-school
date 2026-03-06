# Quick Start Guide - School Management SaaS

## 🚀 Get Started in 5 Minutes

This guide will help you set up and run the upgraded School Management SaaS platform locally.

## Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Git installed

## Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/Javvad017/management-saas-school.git
cd management-saas-school

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (optional for testing)
cd ../super-admin-panel
npm install

cd ../admin-desktop
npm install
```

## Step 2: Configure Environment

```bash
# Navigate to backend
cd backend

# Copy example env file
cp .env.example .env

# Edit .env file with your settings
# Minimum required:
# - MONGODB_URI (use local or Atlas)
# - JWT_SECRET (generate a random string)
```

### Quick .env Setup

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/school_management_saas
JWT_SECRET=your_super_secret_jwt_key_change_this_to_random_string
JWT_EXPIRE=7d
NODE_ENV=development
```

## Step 3: Start MongoDB

### Option A: Local MongoDB
```bash
# Start MongoDB service
# Windows:
net start MongoDB

# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### Option B: MongoDB Atlas
1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Get connection string
3. Update MONGODB_URI in .env

## Step 4: Start Backend Server

```bash
cd backend
npm start

# Or for development with auto-reload:
npm run dev
```

You should see:
```
🚀 Server running on port 5000
📊 Environment: development
🔌 Socket.IO ready for real-time connections
✅ Auto-created Super Admin account
   Email: superadmin@example.com
   Password: Admin@123
```

## Step 5: Test the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-03-15T10:30:00.000Z",
  "environment": "development"
}
```

### Login as Super Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@example.com",
    "password": "Admin@123"
  }'
```

You'll receive a JWT token in the response.

## Step 6: Register a Test School

```bash
curl -X POST http://localhost:5000/api/schools/register \
  -H "Content-Type: application/json" \
  -d '{
    "schoolName": "Demo School",
    "schoolAddress": "123 Demo Street",
    "schoolPhone": "1234567890",
    "schoolEmail": "demo@school.com",
    "adminName": "School Admin",
    "adminEmail": "admin@demo.com",
    "adminPassword": "SecurePass123!",
    "plan": "Starter"
  }'
```

## Step 7: Start Frontend (Optional)

### Super Admin Panel
```bash
cd super-admin-panel
npm run dev
# Opens at http://localhost:5173
```

### Admin Desktop (Electron)
```bash
cd admin-desktop
npm start
```

## 🎯 What's Working Now

### ✅ Backend Features
- Multi-tenant architecture
- Role-based access control (SuperAdmin, SchoolAdmin, Teacher, Student)
- School registration and onboarding
- Subscription management (Starter, Pro, Enterprise)
- Real-time updates via Socket.IO
- File upload support
- Rate limiting and security
- Comprehensive logging
- Input validation

### ✅ API Endpoints

**Authentication**
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

**Schools**
- POST `/api/schools/register` - Register new school (public)
- GET `/api/schools` - Get all schools (SuperAdmin)
- GET `/api/schools/:id` - Get school details
- PUT `/api/schools/:id` - Update school
- PUT `/api/schools/:id/subscription` - Update subscription
- GET `/api/schools/:id/stats` - Get school statistics

**Students**
- POST `/api/students` - Create student
- GET `/api/students` - Get students (filtered by school)
- GET `/api/students/:id` - Get student details
- PUT `/api/students/:id` - Update student
- DELETE `/api/students/:id` - Delete student

**Teachers**
- POST `/api/teachers` - Create teacher
- GET `/api/teachers` - Get teachers
- GET `/api/teachers/:id` - Get teacher details
- PUT `/api/teachers/:id` - Update teacher
- DELETE `/api/teachers/:id` - Delete teacher

**Attendance**
- POST `/api/attendance/mark` - Mark attendance
- GET `/api/attendance` - Get attendance records
- GET `/api/attendance/class` - Get class attendance
- GET `/api/attendance/percentage/:studentId` - Get attendance percentage
- GET `/api/attendance/report` - Get attendance report

**Fees**
- POST `/api/fees` - Create fee record
- GET `/api/fees` - Get fees
- GET `/api/fees/:id` - Get fee details
- PUT `/api/fees/:id` - Update fee
- DELETE `/api/fees/:id` - Delete fee
- POST `/api/fees/:id/payment` - Record payment
- POST `/api/fees/bulk` - Create bulk fees
- GET `/api/fees/unpaid` - Get unpaid students
- GET `/api/fees/summary/:studentId` - Get student fee summary

**Exams**
- POST `/api/exams` - Create exam
- GET `/api/exams` - Get exams
- GET `/api/exams/:id` - Get exam details
- PUT `/api/exams/:id` - Update exam
- DELETE `/api/exams/:id` - Delete exam
- POST `/api/exams/:id/results` - Publish results
- GET `/api/exams/:id/results` - Get exam results

**Homework**
- POST `/api/homework` - Create homework
- GET `/api/homework` - Get homework
- GET `/api/homework/:id` - Get homework details
- PUT `/api/homework/:id` - Update homework
- DELETE `/api/homework/:id` - Delete homework

**Dashboard**
- GET `/api/dashboard/stats` - Get dashboard statistics

**Sections**
- POST `/api/sections` - Create section
- GET `/api/sections` - Get sections
- GET `/api/sections/:id` - Get section details
- PUT `/api/sections/:id` - Update section
- DELETE `/api/sections/:id` - Delete section

## 🧪 Testing the System

### 1. Create a School
Use the registration endpoint above.

### 2. Login as School Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@demo.com",
    "password": "SecurePass123!"
  }'
```

Save the token from response.

### 3. Create a Student
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "John Doe",
    "email": "john@demo.com",
    "password": "Student123!",
    "rollNumber": "001",
    "class": "5",
    "section": "A",
    "dateOfBirth": "2010-01-15",
    "parentName": "Jane Doe",
    "parentPhone": "9876543210",
    "address": "456 Student St"
  }'
```

### 4. Mark Attendance
```bash
curl -X POST http://localhost:5000/api/attendance/mark \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "date": "2024-03-15",
    "students": [
      {
        "studentId": "STUDENT_ID_FROM_STEP_3",
        "status": "Present"
      }
    ]
  }'
```

### 5. Create Fee Record
```bash
curl -X POST http://localhost:5000/api/fees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "studentId": "STUDENT_ID_FROM_STEP_3",
    "amount": 5000,
    "dueDate": "2024-04-01",
    "feeType": "Tuition",
    "month": "March",
    "year": 2024
  }'
```

## 🔍 Monitoring & Debugging

### View Logs
```bash
# Backend logs
cd backend
tail -f logs/combined.log

# Error logs only
tail -f logs/error.log
```

### Check Database
```bash
# Connect to MongoDB
mongosh

# Switch to database
use school_management_saas

# View collections
show collections

# View schools
db.schools.find().pretty()

# View users
db.users.find().pretty()
```

### Test Real-Time Features
Open browser console and connect to Socket.IO:
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

socket.on('connect', () => {
  console.log('Connected to Socket.IO');
});

socket.on('attendance:updated', (data) => {
  console.log('Attendance updated:', data);
});
```

## 🐛 Troubleshooting

### Issue: Cannot connect to MongoDB
**Solution:**
- Check if MongoDB is running: `mongosh`
- Verify MONGODB_URI in .env
- For Atlas, check IP whitelist

### Issue: Port 5000 already in use
**Solution:**
- Change PORT in .env to another port (e.g., 5001)
- Or kill the process using port 5000

### Issue: JWT token invalid
**Solution:**
- Ensure JWT_SECRET is set in .env
- Token might be expired (default 7 days)
- Login again to get new token

### Issue: CORS errors
**Solution:**
- Backend CORS is configured to allow all origins in development
- If still having issues, check CORS_ORIGIN in .env

### Issue: File upload fails
**Solution:**
- Check UPLOAD_PATH directory exists
- Verify file size is under MAX_FILE_SIZE (5MB default)
- Check file type is in ALLOWED_FILE_TYPES

## 📚 Next Steps

1. **Read Full Documentation**
   - `UPGRADE_SUMMARY.md` - Complete feature list
   - `PRODUCTION_DEPLOYMENT_GUIDE.md` - Deploy to production
   - `README.md` - Project overview

2. **Explore Frontend Apps**
   - Super Admin Panel - Platform management
   - Admin Desktop - School management (Electron)
   - Teacher Portal - Teacher features
   - Student Portal - Student features

3. **Customize**
   - Add your branding
   - Configure subscription plans
   - Set up payment gateway
   - Add email notifications

4. **Deploy**
   - Follow PRODUCTION_DEPLOYMENT_GUIDE.md
   - Set up MongoDB Atlas
   - Deploy to cloud provider
   - Configure domain and SSL

## 🎓 Learning Resources

### API Testing Tools
- Postman: https://www.postman.com/
- Insomnia: https://insomnia.rest/
- Thunder Client (VS Code extension)

### MongoDB Tools
- MongoDB Compass: https://www.mongodb.com/products/compass
- Studio 3T: https://studio3t.com/

### Documentation
- Express.js: https://expressjs.com/
- Mongoose: https://mongoosejs.com/
- Socket.IO: https://socket.io/
- JWT: https://jwt.io/

## 💡 Tips

1. **Use Environment Variables**
   - Never commit .env file
   - Use different .env for dev/staging/production

2. **Test with Postman**
   - Import API endpoints
   - Save authentication tokens
   - Create test collections

3. **Monitor Logs**
   - Keep logs open while developing
   - Check for errors and warnings
   - Use log levels appropriately

4. **Database Backups**
   - Backup before major changes
   - Test restore procedures
   - Automate backups in production

## 🤝 Support

- Check existing issues on GitHub
- Read documentation thoroughly
- Test with sample data first
- Keep dependencies updated

## ✅ Checklist

- [ ] Node.js installed
- [ ] MongoDB running
- [ ] Backend dependencies installed
- [ ] .env file configured
- [ ] Backend server started
- [ ] Health check passed
- [ ] Super Admin login works
- [ ] Test school registered
- [ ] API endpoints tested
- [ ] Logs are working
- [ ] Ready to develop!

---

**Happy Coding! 🚀**

For detailed information, see:
- `UPGRADE_SUMMARY.md` - Complete upgrade details
- `PRODUCTION_DEPLOYMENT_GUIDE.md` - Production deployment
- `README.md` - Project overview
