# Student/Parent Web Portal - Setup Guide

## ✅ Installation Complete!

All dependencies have been installed and the project is ready to run.

## 🚀 Quick Start

### Start the Development Server

```powershell
cd student-web
npm run dev
```

The website will be available at:
- **Local**: http://localhost:5174
- **Network**: http://YOUR_PC_IP:5174

## 📋 Prerequisites

Before running the web portal, ensure:

1. **Backend API is running** on port 5000
   - Navigate to backend folder
   - Run: `npm run dev`
   - Verify: http://127.0.0.1:5000/api/health

2. **MongoDB is running**
   - Check with: `mongosh`
   - Or start service: `net start MongoDB`

## 🔧 Configuration

The API base URL is configured in `src/config/api.js`:
```javascript
baseURL: 'http://127.0.0.1:5000/api'
```

To change it, edit the file directly or use environment variables.

## 📱 Features

### For Students:
- ✅ Login with email/password
- ✅ View personal dashboard
- ✅ Check attendance records (filterable by month/year)
- ✅ View school announcements
- ✅ Responsive design for mobile/tablet

### For Parents:
- ✅ Login with email/password
- ✅ View child's information
- ✅ Monitor child's attendance
- ✅ View school announcements
- ✅ Responsive design for mobile/tablet

## 🎨 UI Features

- **Beautiful gradient login page** with purple/blue theme
- **Toast notifications** for success/error messages
- **Loading spinners** on all data fetches
- **Responsive sidebar** navigation
- **Color-coded attendance** (green=present, red=absent)
- **Stats cards** with attendance percentage
- **Mobile-friendly** design

## 🧪 Testing

### Test Login Flow:

1. Start the dev server: `npm run dev`
2. Open browser: http://localhost:5174
3. You should see the login page with:
   - 🎓 School logo
   - Role selector (Student/Parent)
   - Email and password fields
   - Sign In button

### Test with Backend:

Make sure you have created test accounts in the backend:

**Student Account:**
```json
{
  "email": "student@school.com",
  "password": "student123",
  "role": "student",
  "linkedStudentId": "STUDENT_ID_FROM_DB"
}
```

**Parent Account:**
```json
{
  "email": "parent@school.com",
  "password": "parent123",
  "role": "parent",
  "linkedStudentId": "STUDENT_ID_FROM_DB"
}
```

## 📂 Project Structure

```
student-web/
├── src/
│   ├── main.jsx                 # Entry point with Router & Toast
│   ├── App.jsx                  # Route configuration
│   ├── index.css                # Tailwind CSS
│   ├── config/
│   │   └── api.js              # Axios instance with interceptors
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication state management
│   ├── services/
│   │   ├── authService.js      # Login/logout API calls
│   │   ├── studentService.js   # Student data API calls
│   │   ├── attendanceService.js # Attendance API calls
│   │   └── announcementService.js # Announcements API calls
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation bar
│   │   ├── Sidebar.jsx         # Side navigation menu
│   │   ├── ProtectedRoute.jsx  # Route protection wrapper
│   │   ├── LoadingSpinner.jsx  # Loading indicator
│   │   ├── AttendanceCard.jsx  # Attendance table row
│   │   └── AnnouncementCard.jsx # Announcement display card
│   └── pages/
│       ├── Login.jsx           # Login page
│       ├── student/
│       │   ├── StudentDashboard.jsx
│       │   ├── StudentAttendance.jsx
│       │   └── StudentAnnouncements.jsx
│       └── parent/
│           ├── ParentDashboard.jsx
│           ├── ParentAttendance.jsx
│           └── ParentAnnouncements.jsx
├── vite.config.js              # Vite configuration (port 5174)
├── tailwind.config.js          # Tailwind CSS configuration
└── package.json                # Dependencies
```

## 🔐 Authentication Flow

1. User enters email, password, and selects role
2. Frontend calls `POST /api/auth/login`
3. Backend validates credentials and returns JWT token
4. Token is stored in localStorage
5. Token is attached to all subsequent API requests
6. On 401 error, user is logged out and redirected to login

## 🌐 Network Access

To allow other devices on your network to access the portal:

### 1. Find Your PC's IP Address:
```powershell
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

### 2. Configure Windows Firewall:

Run PowerShell as Administrator:
```powershell
New-NetFirewallRule -DisplayName "School Web Portal" -Direction Inbound -LocalPort 5174 -Protocol TCP -Action Allow
```

### 3. Access from Other Devices:

Students/Parents can access from any device on the same network:
```
http://YOUR_PC_IP:5174
```

Example: `http://192.168.1.100:5174`

## 🐛 Troubleshooting

### Cannot connect to backend:
- ✅ Ensure backend is running on port 5000
- ✅ Check `src/config/api.js` has correct baseURL
- ✅ Verify firewall allows port 5000

### Login fails:
- ✅ Ensure user accounts exist in database
- ✅ Check email/password are correct
- ✅ Verify role matches account type
- ✅ Check browser console for errors

### Blank page or errors:
- ✅ Check browser console (F12)
- ✅ Ensure all dependencies installed: `npm install`
- ✅ Clear browser cache
- ✅ Try incognito/private mode

### Toast notifications not showing:
- ✅ Check `react-hot-toast` is installed
- ✅ Verify `<Toaster />` is in main.jsx
- ✅ Check browser console for errors

### Attendance not loading:
- ✅ Ensure student has attendance records in database
- ✅ Check linkedStudentId is correct
- ✅ Verify backend API returns attendance data
- ✅ Check browser network tab for API responses

## 📦 Build for Production

```powershell
npm run build
```

This creates an optimized build in the `dist/` folder.

To preview the production build:
```powershell
npm run preview
```

## 🔄 Development Workflow

1. **Start backend**: `cd backend && npm run dev`
2. **Start web portal**: `cd student-web && npm run dev`
3. **Make changes**: Files auto-reload on save
4. **Test in browser**: http://localhost:5174
5. **Check console**: F12 for errors/logs

## 📝 API Endpoints Used

- `POST /api/auth/login` - User authentication
- `GET /api/students/:id` - Get student details
- `GET /api/announcements` - Get all announcements

## 🎯 Next Steps

1. ✅ Start the backend server
2. ✅ Start the web portal
3. ✅ Create test user accounts
4. ✅ Test login flow
5. ✅ Test all features
6. ✅ Configure network access
7. ✅ Deploy to production

## 💡 Tips

- Use Chrome DevTools (F12) for debugging
- Check Network tab for API call details
- Use React DevTools extension for component inspection
- Monitor backend logs for API errors
- Test on mobile devices for responsive design

## 🆘 Support

If you encounter issues:
1. Check this guide first
2. Review browser console errors
3. Check backend API logs
4. Verify database has correct data
5. Test API endpoints directly with Postman

## 🎉 Success!

Your School Management Web Portal is ready to use!

Students and parents can now access their information from any device on the school network.
