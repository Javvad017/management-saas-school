# 🚀 Quick Start Guide

## Login Issue Fixed! ✅

The CORS configuration has been updated. Follow these steps to test:

## Step 1: Restart Backend (REQUIRED)

### Option A: Using Batch Script (Easiest)
Double-click: `restart-backend.bat`

### Option B: Manual Restart
1. Find the terminal running the backend
2. Press `Ctrl+C` to stop
3. Run:
```bash
cd school-management-saas/backend
node server.js
```

## Step 2: Login to Super Admin Panel

1. Open: `school-management-saas/super-admin-panel/login.html`
2. Enter credentials:
   - **Email**: `admin@test.com`
   - **Password**: `admin123`
3. Click "Sign In"
4. You'll be redirected to the dashboard! 🎉

## What Was Fixed?

The backend CORS was blocking requests from `file://` protocol. Now it accepts requests from any origin during development.

**Changed in `backend/server.js`:**
```javascript
// Now allows all origins (including file://)
app.use(cors({
  origin: true,
  credentials: true
}));
```

## Verify Backend is Running

```bash
curl http://localhost:5000/api/health
```

Should return: `{"success":true,"message":"Server is running"}`

## Test Login API

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@test.com\",\"password\":\"admin123\"}"
```

Should return token and user data.

## Troubleshooting

### Still getting "Failed to fetch"?
- ❌ Backend not restarted → Restart using steps above
- ❌ Wrong port → Check: `netstat -ano | findstr :5000`
- ❌ MongoDB not running → Start MongoDB service

### "Invalid credentials"?
- Use: `admin@test.com` (not `superadmin@example.com`)
- Password: `admin123`

### Need to create new admin?
```bash
cd school-management-saas/backend
node scripts/createAdmin.js
```

## Next Steps

After login works:
1. Explore the Super Admin dashboard
2. Create a school
3. Test school management features
4. Continue building Student Portal
5. Build Teacher Portal
6. Create Admin Desktop (Electron)

## Available Portals

| Portal | Status | URL |
|--------|--------|-----|
| Super Admin Panel | ✅ Complete | `super-admin-panel/login.html` |
| Student Portal | 🔄 10% | `student-portal/login.html` |
| Teacher Portal | ⏳ Not Started | - |
| Admin Desktop | ⏳ Not Started | - |

---

**Ready to test!** Restart backend and login with `admin@test.com` / `admin123`
