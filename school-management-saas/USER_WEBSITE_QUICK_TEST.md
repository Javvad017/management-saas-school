# 🚀 User Website - Quick Test Guide

## Quick Test (5 Minutes)

### Step 1: Start Services

```bash
# Terminal 1: Backend
cd school-management-saas/backend
npm run dev

# Terminal 2: User Website
cd school-management-saas/user-website
npm run dev
```

### Step 2: Create Test Student (if needed)

**Option A: Using Admin Desktop**
1. Start admin desktop: `cd admin-desktop && npm start`
2. Login as admin
3. Add student with credentials

**Option B: Using Backend Script**
```bash
cd school-management-saas/backend

# Create school admin first (if not exists)
npm run create-school-admin

# Then manually create student via admin panel
```

### Step 3: Test Login

1. Open http://localhost:3000
2. Should redirect to /login
3. Enter student credentials
4. Click "Login"

**Expected:**
- ✅ Redirects to /dashboard
- ✅ Console shows API logs

### Step 4: Check Console

Open DevTools (F12) → Console tab

**Expected Logs:**
```
API Request: POST /auth/login
API Response: POST /auth/login {success: true, data: {...}}
Fetching dashboard data...
API Request: GET /auth/me
API Request: GET /dashboard/stats
Profile received: {...}
Stats received: {...}
```

### Step 5: Test All Pages

**Dashboard:**
- ✅ Shows welcome message
- ✅ Shows profile card
- ✅ Shows stats cards

**Attendance:**
- ✅ Shows date filter
- ✅ Shows attendance stats
- ✅ Shows attendance table

**Fees:**
- ✅ Shows fee summary
- ✅ Shows fee table

**Results:**
- ✅ Shows exam results
- ✅ Shows grades

---

## Debug Checklist

### ✅ Backend Running
```bash
# Should see:
Server running on port 5000
MongoDB Connected
```

### ✅ Frontend Running
```bash
# Should see:
VITE ready
Local: http://localhost:3000
```

### ✅ Token Saved
```javascript
// In browser console:
localStorage.getItem('token')
// Should return JWT token
```

### ✅ API Requests Working
```
Network tab should show:
- POST http://localhost:5000/api/auth/login (200)
- GET http://localhost:5000/api/auth/me (200)
- GET http://localhost:5000/api/dashboard/stats (200)
```

---

## Common Issues

### Issue: "Network Error"
**Fix:** Check backend is running on port 5000

### Issue: "401 Unauthorized"
**Fix:** Re-login to get fresh token

### Issue: No data displays
**Fix:** Add data using admin panel

### Issue: Page keeps loading
**Fix:** Check console for errors, check network tab

---

## Test Credentials

Use these if you have test data:

**Student 1:**
- Email: student1@school.com
- Password: student123

**Student 2:**
- Email: student2@school.com
- Password: student123

---

## Quick Verification

```javascript
// In browser console after login:

// Check token
console.log('Token:', localStorage.getItem('token'));

// Check user
console.log('User:', JSON.parse(localStorage.getItem('user')));

// Test API call
fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(d => console.log('Profile:', d));
```

---

## Success Indicators

✅ Login redirects to dashboard  
✅ Console shows API request logs  
✅ Console shows API response logs  
✅ Profile displays user name  
✅ Stats display numbers  
✅ All pages load without errors  
✅ Logout works  

---

**Full Guide:** [USER_WEBSITE_FIX_GUIDE.md](USER_WEBSITE_FIX_GUIDE.md)

**Last Updated:** March 4, 2026
