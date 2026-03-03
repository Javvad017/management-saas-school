# 🎓 School Management Website

A complete School Management System for Students and Parents built with React + Vite + Tailwind CSS v4.

## ✅ Project Status: COMPLETE

All default Vite template files have been replaced with a fully functional school portal.

## 🚀 Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Access at:** http://localhost:5174

## 📋 Prerequisites

- Backend API running on http://127.0.0.1:5000/api
- Node.js installed
- npm or yarn

## 🎨 Features

### For Students
- ✅ Login with email/password
- 📊 Dashboard with attendance statistics
- 🗓️ Attendance records (filterable by month/year)
- 📢 School announcements
- 📱 Mobile responsive design

### For Parents
- ✅ Login with email/password
- 👶 View child's information
- 📊 Child's attendance statistics
- 🗓️ Child's attendance records
- 📢 School announcements
- 📱 Mobile responsive design

## 🏗️ Project Structure

```
student-web/
├── src/
│   ├── index.css                    # Tailwind v4 import
│   ├── main.jsx                     # App entry point
│   ├── App.jsx                      # Routes configuration
│   ├── config/
│   │   └── api.js                   # Axios instance with JWT
│   ├── context/
│   │   └── AuthContext.jsx          # Authentication state
│   ├── components/
│   │   ├── Layout.jsx               # Sidebar + Navbar
│   │   ├── ProtectedRoute.jsx       # Route protection
│   │   └── LoadingSpinner.jsx       # Loading indicator
│   └── pages/
│       ├── Login.jsx                # Login page
│       ├── student/
│       │   ├── StudentDashboard.jsx
│       │   ├── StudentAttendance.jsx
│       │   └── StudentAnnouncements.jsx
│       └── parent/
│           ├── ParentDashboard.jsx
│           ├── ParentAttendance.jsx
│           └── ParentAnnouncements.jsx
├── vite.config.js                   # Vite configuration
├── postcss.config.cjs               # PostCSS with Tailwind v4
└── package.json                     # Dependencies
```

## 🎯 Routes

### Public Routes
- `/` - Redirects to login or dashboard
- `/login` - Login page with role selector

### Student Routes (Protected)
- `/student/dashboard` - Overview with stats
- `/student/attendance` - Attendance table
- `/student/announcements` - All announcements

### Parent Routes (Protected)
- `/parent/dashboard` - Child info and stats
- `/parent/attendance` - Child's attendance
- `/parent/announcements` - School announcements

## 🔐 Authentication

- JWT token stored in localStorage
- Auto-restore session on page reload
- Auto-logout on 401 response
- Role-based route protection

## 🎨 UI Design

- **Primary Color:** #1565C0 (Blue)
- **Background:** Gray-50
- **Cards:** White with rounded-xl and shadow-md
- **Badges:** Green (Present) / Red (Absent)
- **Fully Responsive:** Mobile, tablet, desktop
- **Smooth Transitions:** Hover effects

## 🔧 Configuration

### Tailwind CSS v4
```css
/* src/index.css */
@import "tailwindcss";
```

### PostCSS
```javascript
/* postcss.config.cjs */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### API Base URL
```javascript
/* src/config/api.js */
baseURL: 'http://127.0.0.1:5000/api'
```

## 🧪 Testing

### Test Credentials

**Student Account:**
```
Email: student@school.com
Password: student123
Role: Student
```

**Parent Account:**
```
Email: parent@school.com
Password: parent123
Role: Parent
```

### Test Flow

1. Start backend server (port 5000)
2. Start web portal (port 5174)
3. Open http://localhost:5174
4. Login with test credentials
5. Verify dashboard loads
6. Check attendance page
7. Check announcements page

## 📡 API Integration

### Endpoints Used

**Authentication:**
- `POST /api/auth/login` - Login with email, password, role

**Students:**
- `GET /api/students/:id` - Get student details and attendance

**Announcements:**
- `GET /api/announcements` - Get all announcements

### Request Headers
```javascript
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

## 🐛 Troubleshooting

### Backend Connection Error
**Problem:** Cannot connect to API
**Solution:**
- Ensure backend is running on port 5000
- Check `src/config/api.js` has correct URL
- Verify firewall allows port 5000

### Login Fails
**Problem:** Invalid credentials
**Solution:**
- Create user accounts in backend first
- Check email/password are correct
- Verify role matches account type

### Styles Not Showing
**Problem:** Tailwind classes not working
**Solution:**
- Ensure `@import "tailwindcss"` in index.css
- Check postcss.config.cjs is correct
- Restart dev server
- Clear browser cache

### Page Not Found
**Problem:** 404 on routes
**Solution:**
- Check React Router is installed
- Verify routes in App.jsx
- Ensure BrowserRouter wraps App

## 📦 Dependencies

### Production
- `react` - UI library
- `react-dom` - React DOM renderer
- `react-router-dom` - Routing
- `axios` - HTTP client
- `tailwindcss` - CSS framework
- `@tailwindcss/postcss` - Tailwind v4 plugin

### Development
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin
- `autoprefixer` - CSS vendor prefixes

## 🔄 Development Workflow

1. **Start backend:** `cd backend && npm run dev`
2. **Start web portal:** `cd student-web && npm run dev`
3. **Make changes:** Files auto-reload on save
4. **Test in browser:** http://localhost:5174
5. **Check console:** F12 for errors/logs

## 📱 Mobile Support

- Responsive sidebar with hamburger menu
- Touch-friendly buttons and links
- Optimized for all screen sizes
- Works on iOS and Android browsers

## 🌐 Network Access

To allow other devices on your network:

1. Find your PC's IP address
2. Access from other devices: `http://YOUR_IP:5174`
3. Configure firewall to allow port 5174

## 🎯 Next Steps

1. ✅ Backend API is running
2. ✅ Web portal is running
3. ✅ Create test user accounts
4. ✅ Test login flow
5. ✅ Verify all features
6. ✅ Test on mobile devices
7. ✅ Deploy to production

## 📚 Documentation

- `COMPLETE-SETUP.md` - Full setup guide
- `README.md` - This file
- Code comments in all files

## 🆘 Support

If you encounter issues:
1. Check this README first
2. Review browser console errors
3. Check backend API logs
4. Verify database has correct data

## 📄 License

Proprietary - School Use Only

## 🎉 Success!

Your School Management Website is ready to use!

**Happy coding! 🚀**
