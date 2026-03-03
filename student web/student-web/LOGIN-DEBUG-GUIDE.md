# 🔧 Login Debug Guide

## ✅ All Files Fixed!

The following files have been updated with complete debugging and error handling:

1. ✅ `backend/server.js` - CORS fixed for ports 5173 & 5174
2. ✅ `backend/routes/auth.js` - Complete logging added
3. ✅ `student-web/src/config/api.js` - Request/response logging
4. ✅ `student-web/src/context/AuthContext.jsx` - Detailed error handling
5. ✅ `student-web/src/pages/Login.jsx` - Form validation & logging

## 🧪 Testing Steps

### Step 1: Test Backend

```bash
# Start backend
cd backend
npm run dev
```

**Test in browser:**
```
http://127.0.0.1:5000/api/test
```

**Expected response:**
```json
{
  "message": "Backend is working!",
  "timestamp": "2024-..."
}
```

### Step 2: Test Frontend

```bash
# Start frontend
cd student-web
npm run dev
```

**Access:**
```
http://localhost:5174
```

### Step 3: Open Browser DevTools

Press `F12` to open DevTools, then:

1. Go to **Console** tab
2. Clear console (trash icon)
3. Try to login
4. Watch console logs

## 📊 What You Should See in Console

### When You Click "Sign In":

```
=== FORM SUBMIT ===
Email: student@school.com
Password: ***
Role: student
Calling login function...
=== LOGIN ATTEMPT ===
Email: student@school.com
Password: ***
Role: student
Sending login request to: http://127.0.0.1:5000/api/auth/login
API Request: POST /auth/login
Token: Missing
API Response: 200 /auth/login
Login response: { token: "...", user: {...} }
Login successful! User: {...}
Navigating to dashboard for role: student
Login result: { success: true, role: "student" }
Login successful! Redirecting...
Navigating to /student/dashboard
```

### Backend Console Should Show:

```
2024-... - POST /api/auth/login
=== LOGIN ATTEMPT ===
Email: student@school.com
Role: student
Password provided: true
Searching for user with email: student@school.com and role: student
✅ User found: John Doe
✅ Password valid
✅ Token generated
✅ Login successful for: student@school.com
```

## 🐛 Common Errors & Solutions

### Error 1: "Network Error" or "ERR_CONNECTION_REFUSED"

**Problem:** Backend is not running

**Solution:**
```bash
cd backend
npm run dev
```

**Verify:** Open http://127.0.0.1:5000/api/test

---

### Error 2: "CORS Error" or "Access-Control-Allow-Origin"

**Problem:** CORS not configured properly

**Solution:** Already fixed in `backend/server.js`

**Verify:** Check backend console shows:
```
✅ Server running on port 5000
```

---

### Error 3: "Invalid email or password"

**Problem:** User account doesn't exist in database

**Solution:** Create user account first

**Using MongoDB Compass:**
1. Connect to `mongodb://localhost:27017`
2. Open `school-management` database
3. Open `users` collection
4. Insert document:

```json
{
  "name": "Test Student",
  "email": "student@school.com",
  "password": "$2a$10$...", // hashed password
  "role": "student",
  "linkedStudentId": "STUDENT_ID_HERE",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Or use the register endpoint:**
```bash
curl -X POST http://127.0.0.1:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "student@school.com",
    "password": "student123",
    "role": "student",
    "linkedStudentId": "STUDENT_ID_HERE"
  }'
```

---

### Error 4: "Cannot read property 'token' of undefined"

**Problem:** Response format mismatch

**Solution:** Already fixed in `AuthContext.jsx`

**Verify:** Check console shows:
```
Login response: { token: "...", user: {...} }
```

---

### Error 5: Nothing happens when clicking "Sign In"

**Problem:** Form not submitting or JavaScript error

**Solution:**
1. Open DevTools Console (F12)
2. Look for red error messages
3. Check if you see "=== FORM SUBMIT ===" log
4. If not, there's a JavaScript error

**Common causes:**
- Missing dependencies: Run `npm install`
- Syntax error in code
- Browser cache: Clear cache and reload

---

### Error 6: "401 Unauthorized" after login

**Problem:** Token not being sent with requests

**Solution:** Already fixed in `api.js`

**Verify:** Check console shows:
```
API Request: GET /students/...
Token: Present
```

---

### Error 7: MongoDB connection error

**Problem:** MongoDB not running

**Solution:**
```bash
# Windows
net start MongoDB

# Mac/Linux
brew services start mongodb-community
# or
sudo systemctl start mongod
```

**Verify:** Backend console shows:
```
✅ MongoDB connected
```

---

## 🔍 Debugging Checklist

Use this checklist to debug login issues:

- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 5174
- [ ] MongoDB is running and connected
- [ ] Browser DevTools Console is open
- [ ] No red errors in console
- [ ] Backend console shows login attempt logs
- [ ] User account exists in database
- [ ] Email and password are correct
- [ ] Role matches user's role in database
- [ ] CORS is configured correctly
- [ ] Token is being generated
- [ ] Token is being stored in localStorage
- [ ] Navigation happens after successful login

## 📝 Console Log Reference

### Frontend Logs (Browser Console):

| Log Message | Meaning |
|------------|---------|
| `=== FORM SUBMIT ===` | Form submitted |
| `Calling login function...` | AuthContext login called |
| `Sending login request to:` | API request being sent |
| `API Request: POST /auth/login` | Axios interceptor |
| `API Response: 200` | Success response |
| `Login successful!` | Login completed |
| `Navigating to...` | Redirect happening |

### Backend Logs (Terminal):

| Log Message | Meaning |
|------------|---------|
| `POST /api/auth/login` | Request received |
| `=== LOGIN ATTEMPT ===` | Processing login |
| `✅ User found` | User exists |
| `✅ Password valid` | Password correct |
| `✅ Token generated` | JWT created |
| `✅ Login successful` | Response sent |

## 🎯 Quick Test

Run this in browser console to test API directly:

```javascript
fetch('http://127.0.0.1:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'student@school.com',
    password: 'student123',
    role: 'student'
  })
})
.then(res => res.json())
.then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err))
```

**Expected output:**
```javascript
Response: {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "...",
    name: "Test Student",
    email: "student@school.com",
    role: "student",
    linkedStudentId: "..."
  }
}
```

## 🆘 Still Not Working?

If login still doesn't work after following this guide:

1. **Check all console logs** - Both browser and backend
2. **Verify MongoDB** - Make sure it's running and has data
3. **Test API directly** - Use the fetch test above
4. **Check network tab** - See if request is being sent
5. **Clear everything** - Clear localStorage, cookies, cache
6. **Restart everything** - Stop and restart both servers

## ✅ Success Indicators

You'll know login is working when:

- ✅ No errors in browser console
- ✅ Backend logs show "Login successful"
- ✅ Token is stored in localStorage
- ✅ User is redirected to dashboard
- ✅ Dashboard loads with user data

## 🎉 Done!

Your login should now be working with complete debugging enabled!
