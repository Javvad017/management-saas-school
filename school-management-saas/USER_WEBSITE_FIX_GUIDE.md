# 🌐 User Website - Fix Guide

## Issues Fixed

**Problems:**
1. API service was importing itself (circular dependency)
2. No axios instance configured
3. No JWT token attachment
4. Wrong API endpoints
5. No error handling for 401 responses
6. No console logging for debugging
7. Profile endpoint was wrong (`/students/:id` instead of `/auth/me`)

**Status:** ✅ ALL FIXED

---

## ✅ What Was Fixed

### 1. API Service (`services/api.js`)

**Before:** Circular import, no axios configuration
**After:** Complete axios setup with interceptors

**Fixed:**
- ✅ Created axios instance with base URL
- ✅ Added request interceptor to attach JWT token
- ✅ Added response interceptor for error handling
- ✅ Added console logging for debugging
- ✅ Added automatic redirect on 401 Unauthorized
- ✅ Exported all API modules correctly

### 2. Student API Service (`services/studentAPI.js`)

**Before:** Using wrong endpoints, no error handling
**After:** Correct endpoints with comprehensive error handling

**Fixed:**
- ✅ Changed profile endpoint from `/students/:id` to `/auth/me`
- ✅ Added try-catch blocks for all methods
- ✅ Added console logging for debugging
- ✅ Added fallback data for optional endpoints
- ✅ Added user ID validation
- ✅ Improved error messages

### 3. Dashboard Component (`pages/Dashboard.jsx`)

**Before:** Expected student-specific profile structure
**After:** Works with user profile from `/auth/me`

**Fixed:**
- ✅ Updated to use user profile structure
- ✅ Added console logging
- ✅ Improved error display
- ✅ Added null checks for stats

---

## 🔄 Complete Data Flow

### Login Flow

```
1. User enters email/password
   ↓
2. Frontend: POST /api/auth/login
   Headers: Content-Type: application/json
   Body: { email, password }
   ↓
3. Backend: Validates credentials
   ↓
4. Backend: Returns JWT token + user data
   Response: {
     success: true,
     data: {
       _id: "...",
       name: "...",
       email: "...",
       role: "Student",
       schoolId: "...",
       token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
     }
   }
   ↓
5. Frontend: Saves token and user to localStorage
   localStorage.setItem('token', data.data.token)
   localStorage.setItem('user', JSON.stringify(data.data))
   ↓
6. Frontend: Redirects to /dashboard
```

### API Request Flow (After Login)

```
1. Component calls API method
   Example: studentAPI.getMyProfile()
   ↓
2. Request Interceptor:
   - Gets token from localStorage
   - Attaches to Authorization header
   - Logs request details
   ↓
3. Axios sends request:
   GET http://localhost:5000/api/auth/me
   Headers: {
     Authorization: Bearer <JWT_TOKEN>
     Content-Type: application/json
   }
   ↓
4. Backend:
   - Verifies JWT token
   - Extracts user info
   - Returns data
   ↓
5. Response Interceptor:
   - Logs response
   - Returns data to component
   OR
   - Catches 401 error
   - Clears localStorage
   - Redirects to /login
```

---

## 📝 API Configuration

### Base Configuration

```javascript
// API Base URL
const API_URL = 'http://localhost:5000/api';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Request Interceptor

```javascript
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Attach token if exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request for debugging
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);
```

### Response Interceptor

```javascript
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log(`API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    // Log error
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
```

---

## 🎯 Correct API Endpoints

### Authentication
```javascript
// Login
POST /api/auth/login
Body: { email, password }
Response: { success: true, data: { token, ...user } }

// Get current user
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { success: true, data: { ...user } }
```

### Dashboard
```javascript
// Get dashboard stats
GET /api/dashboard/stats
Headers: Authorization: Bearer <token>
Response: {
  success: true,
  data: {
    totalStudents: 10,
    totalTeachers: 5,
    presentToday: 8,
    absentToday: 2,
    pendingFees: 3
  }
}
```

### Attendance
```javascript
// Get attendance records
GET /api/attendance?studentId=<id>&startDate=<date>&endDate=<date>
Headers: Authorization: Bearer <token>
Response: { success: true, data: [...attendance] }

// Get attendance percentage
GET /api/attendance/percentage/<studentId>?startDate=<date>&endDate=<date>
Headers: Authorization: Bearer <token>
Response: {
  success: true,
  data: {
    totalDays: 20,
    presentDays: 18,
    absentDays: 2,
    percentage: 90
  }
}
```

### Fees
```javascript
// Get fee records
GET /api/fees?studentId=<id>
Headers: Authorization: Bearer <token>
Response: { success: true, data: [...fees] }

// Get fee summary
GET /api/fees/summary/<studentId>
Headers: Authorization: Bearer <token>
Response: {
  success: true,
  data: {
    totalAmount: 10000,
    totalPaid: 7000,
    totalDue: 3000,
    pendingCount: 2
  }
}
```

### Exam Results
```javascript
// Get student results
GET /api/exams/results/student/<studentId>
Headers: Authorization: Bearer <token>
Response: { success: true, data: [...results] }
```

---

## 🧪 Testing Guide

### Test 1: Login

**Steps:**
1. Start backend: `cd backend && npm run dev`
2. Start user website: `cd user-website && npm run dev`
3. Open http://localhost:3000
4. Should redirect to /login
5. Enter credentials:
   - Email: (student email)
   - Password: (student password)
6. Click Login

**Expected Result:**
- ✅ Console shows: "API Request: POST /auth/login"
- ✅ Console shows: "API Response: POST /auth/login"
- ✅ Token saved to localStorage
- ✅ User saved to localStorage
- ✅ Redirected to /dashboard

**Check Console:**
```
API Request: POST /auth/login {email: "...", password: "..."}
API Response: POST /auth/login {success: true, data: {...}}
```

**Check localStorage:**
```javascript
localStorage.getItem('token') // Should have JWT token
localStorage.getItem('user')  // Should have user JSON
```

---

### Test 2: Dashboard

**Steps:**
1. After login, should be on /dashboard
2. Check console logs
3. Verify data displays

**Expected Result:**
- ✅ Console shows: "Fetching dashboard data..."
- ✅ Console shows: "API Request: GET /auth/me"
- ✅ Console shows: "API Request: GET /dashboard/stats"
- ✅ Console shows: "Profile received: {...}"
- ✅ Console shows: "Stats received: {...}"
- ✅ Profile card displays user info
- ✅ Stats cards display numbers

---

### Test 3: Attendance

**Steps:**
1. Click "Attendance" in navbar
2. Check console logs
3. Verify attendance records display

**Expected Result:**
- ✅ Console shows: "Fetching attendance..."
- ✅ Console shows: "API Request: GET /attendance"
- ✅ Console shows: "API Request: GET /attendance/percentage/:id"
- ✅ Attendance stats display
- ✅ Attendance table displays records

---

### Test 4: Fees

**Steps:**
1. Click "Fees" in navbar
2. Check console logs
3. Verify fee records display

**Expected Result:**
- ✅ Console shows: "Fetching fees..."
- ✅ Console shows: "API Request: GET /fees"
- ✅ Console shows: "API Request: GET /fees/summary/:id"
- ✅ Fee summary displays
- ✅ Fee table displays records

---

### Test 5: Results

**Steps:**
1. Click "Results" in navbar
2. Check console logs
3. Verify exam results display

**Expected Result:**
- ✅ Console shows: "Fetching results..."
- ✅ Console shows: "API Request: GET /exams/results/student/:id"
- ✅ Results display with grades

---

### Test 6: Token Expiration

**Steps:**
1. Clear token: `localStorage.removeItem('token')`
2. Try to access any page
3. Or wait for token to expire (7 days)

**Expected Result:**
- ✅ API returns 401
- ✅ Response interceptor catches it
- ✅ localStorage cleared
- ✅ Redirected to /login

---

## 🐛 Debug Checklist

### Check 1: Backend Running
```bash
cd school-management-saas/backend
npm run dev

# Should see:
# Server running on port 5000
# MongoDB Connected
```

### Check 2: User Website Running
```bash
cd school-management-saas/user-website
npm run dev

# Should see:
# VITE ready
# Local: http://localhost:3000
```

### Check 3: API Base URL
```javascript
// In browser console:
console.log('API URL:', 'http://localhost:5000/api');

// Should match backend port
```

### Check 4: Token Exists
```javascript
// In browser console:
console.log('Token:', localStorage.getItem('token'));

// Should show JWT token or null
```

### Check 5: User Data Exists
```javascript
// In browser console:
console.log('User:', JSON.parse(localStorage.getItem('user')));

// Should show user object or null
```

### Check 6: Network Requests
```
1. Open DevTools (F12)
2. Go to Network tab
3. Filter: XHR
4. Perform action (login, load page)
5. Check requests:
   - URL should be http://localhost:5000/api/...
   - Headers should include Authorization: Bearer ...
   - Response should be JSON
```

### Check 7: Console Logs
```
Expected logs for each API call:
1. "API Request: METHOD /endpoint"
2. "API Response: METHOD /endpoint {data}"

If error:
1. "API Response Error: {error details}"
```

---

## 🔍 Common Issues & Solutions

### Issue 1: "Network Error"

**Symptoms:**
- API calls fail immediately
- Console shows "Network Error"

**Causes:**
- Backend not running
- Wrong API URL
- CORS issue

**Solution:**
```bash
# Check backend is running
cd backend
npm run dev

# Check API URL in api.js
const API_URL = 'http://localhost:5000/api';

# Check backend CORS configuration
# Should allow http://localhost:3000
```

---

### Issue 2: "401 Unauthorized"

**Symptoms:**
- API returns 401
- Redirected to login

**Causes:**
- No token
- Token expired
- Token invalid

**Solution:**
```javascript
// Check token exists
console.log(localStorage.getItem('token'));

// If no token, login again
// If token exists but still 401, token may be invalid

// Clear and re-login
localStorage.clear();
// Then login again
```

---

### Issue 3: "Cannot read property of undefined"

**Symptoms:**
- Page crashes
- Console shows property access error

**Causes:**
- API returned different structure
- Missing null checks

**Solution:**
```javascript
// Use optional chaining
profile?.userId?.name

// Use default values
profile?.name || 'Student'

// Check data structure in console
console.log('Profile:', profile);
```

---

### Issue 4: Data Not Displaying

**Symptoms:**
- Page loads but no data
- No errors in console

**Causes:**
- API returns empty array
- No data in database

**Solution:**
```javascript
// Check API response
console.log('Data:', data);

// Check if array is empty
if (data.length === 0) {
  // Show "No data" message
}

// Add data to database using admin panel
```

---

### Issue 5: Infinite Loading

**Symptoms:**
- "Loading..." never stops
- No error displayed

**Causes:**
- API call never completes
- Error not caught

**Solution:**
```javascript
// Check network tab for failed requests
// Add timeout to API calls
// Ensure finally block sets loading to false

try {
  // API call
} catch (error) {
  // Handle error
} finally {
  setLoading(false); // Always runs
}
```

---

## 📊 Files Modified

### Modified Files
1. `user-website/src/services/api.js` - Complete rewrite
2. `user-website/src/services/studentAPI.js` - Fixed endpoints and error handling
3. `user-website/src/pages/Dashboard.jsx` - Updated profile structure

### No Changes Needed
- ✅ `pages/Login.jsx` - Already correct
- ✅ `pages/Attendance.jsx` - Already correct
- ✅ `pages/Fees.jsx` - Already correct
- ✅ `pages/Results.jsx` - Already correct
- ✅ `components/Navbar.jsx` - Already correct
- ✅ `components/ProtectedRoute.jsx` - Already correct

---

## ✅ Verification Steps

### 1. Start Services
```bash
# Terminal 1: Backend
cd school-management-saas/backend
npm run dev

# Terminal 2: User Website
cd school-management-saas/user-website
npm run dev
```

### 2. Create Test Student
```bash
# In backend directory
cd school-management-saas/backend

# Create student using admin panel or API
# Or use existing student credentials
```

### 3. Test Login
1. Open http://localhost:3000
2. Login with student credentials
3. Check console for API logs
4. Verify redirect to dashboard

### 4. Test All Pages
1. Dashboard - Check profile and stats
2. Attendance - Check records and percentage
3. Fees - Check fee records and summary
4. Results - Check exam results

### 5. Test Error Handling
1. Stop backend
2. Try to load page
3. Should show error message
4. Start backend
5. Click "Retry" button
6. Should load data

---

## 🎯 Success Criteria

✅ Login works and saves token  
✅ Token attached to all requests  
✅ Dashboard loads profile and stats  
✅ Attendance page shows records  
✅ Fees page shows fee records  
✅ Results page shows exam results  
✅ Console logs show API requests  
✅ Console logs show API responses  
✅ Errors displayed properly  
✅ 401 redirects to login  
✅ Retry buttons work  
✅ No circular dependencies  
✅ No hardcoded data  

---

## 📚 Related Documentation

- [API_EXAMPLES.md](API_EXAMPLES.md) - Backend API reference
- [README.md](README.md) - Project overview
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing procedures

---

**Last Updated:** March 4, 2026  
**Status:** ✅ FIXED AND TESTED

**The user website now works correctly with the existing backend!** 🎉
