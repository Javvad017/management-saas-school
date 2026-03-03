# Network Error Fix Guide

## What Was Fixed

1. ✅ Changed `localhost` to `127.0.0.1` in all files (better Windows compatibility)
2. ✅ Added comprehensive error handling in `backend/server.js`
3. ✅ Fixed CORS configuration with proper headers
4. ✅ Added timeout and better logging to `src/services/api.js`
5. ✅ Added test endpoint `/api/test` to verify backend
6. ✅ Added port conflict detection
7. ✅ Updated package.json scripts to use 127.0.0.1

## Step-by-Step Fix Instructions

### Step 1: Make Sure MongoDB is Running

**Option A - Start MongoDB Service (Recommended):**
```cmd
net start MongoDB
```

**Option B - Run MongoDB Manually:**
```cmd
mongod --dbpath C:\data\db
```

**Verify MongoDB is Running:**
```cmd
netstat -ano | findstr :27017
```
You should see a line with `:27017` - this means MongoDB is running.

### Step 2: Kill Any Existing Backend Process

Check if port 5000 is already in use:
```cmd
netstat -ano | findstr :5000
```

If you see a result, kill that process:
```cmd
taskkill /PID <PID_NUMBER> /F
```

### Step 3: Stop All Running Dev Servers

Press `Ctrl + C` in your terminal to stop everything.

### Step 4: Reset Admin User

```bash
npm run reset-admin
```

Expected output:
```
Connecting to MongoDB...
✅ Connected to MongoDB
✅ Cleared existing admins
✅ Admin created successfully
  Email: admin@school.com
  Password: admin123
✅ Admin verified in database
✅ Done
```

### Step 5: Start Backend Only (Test First)

```bash
npm run dev:backend
```

**You MUST see these messages:**
```
========================================
Starting School Management System Server
========================================
MongoDB URI: mongodb://127.0.0.1:27017/school-management
Server Port: 5000
JWT Secret: SET
========================================
✅ MongoDB connected successfully
✅ Admin already exists
========================================
✅ Server running successfully!
========================================
Local:   http://127.0.0.1:5000
Local:   http://localhost:5000
API:     http://127.0.0.1:5000/api
Test:    http://127.0.0.1:5000/api/test
========================================
Ready to accept connections...
```

### Step 6: Test Backend in Browser

Open your browser and go to:
```
http://127.0.0.1:5000/api/test
```

**You should see:**
```json
{
  "message": "Backend is working!",
  "timestamp": "2024-03-04T...",
  "mongodb": "Connected"
}
```

If you see this, backend is working perfectly! ✅

### Step 7: Start Full App

Stop the backend (Ctrl+C), then run:
```bash
npm run dev
```

### Step 8: Try Login

1. Wait for Electron window to open
2. Enter credentials:
   - Email: `admin@school.com`
   - Password: `admin123`
3. Click "Sign In"

### Step 9: Check Logs

**Backend Terminal should show:**
```
=== Login Attempt ===
Email: admin@school.com
Password length: 8
Admin found: YES
Password match: YES
Login successful! Generating token...
Token generated successfully
===================
```

**Browser Console (F12) should show:**
```
API Configuration:
Base URL: http://127.0.0.1:5000/api
=== Frontend Login Attempt ===
Email: admin@school.com
API Request: POST /auth/login
API Response: 200 /auth/login
Login successful!
```

## Common Errors and Solutions

### Error: "MongoDB connection error"

**Cause:** MongoDB is not running

**Solution:**
```cmd
net start MongoDB
```

### Error: "Port 5000 is already in use"

**Cause:** Another process is using port 5000

**Solution:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Error: "Network Error" or "ECONNREFUSED"

**Cause:** Backend is not running or crashed

**Solution:**
1. Check backend terminal for error messages
2. Make sure you see "Server running successfully!"
3. Test backend: http://127.0.0.1:5000/api/test

### Error: "UNCAUGHT EXCEPTION" or "UNHANDLED REJECTION"

**Cause:** Code error in backend

**Solution:**
1. Read the error message in terminal
2. Check if all dependencies are installed: `npm install`
3. Check if .env file exists and has correct values

### Error: "Admin found: NO"

**Cause:** Admin user doesn't exist in database

**Solution:**
```bash
npm run reset-admin
```

### Error: "Password match: NO"

**Cause:** Password hash mismatch

**Solution:**
```bash
npm run reset-admin
```

## Verify Everything

### 1. MongoDB Running
```cmd
mongosh
```
Should connect without errors.

### 2. Backend Running
```
http://127.0.0.1:5000/api/test
```
Should return JSON.

### 3. Frontend Running
```
http://127.0.0.1:5173
```
Should show login page.

## Files Changed

1. `.env` - Changed localhost to 127.0.0.1
2. `backend/server.js` - Added error handling, CORS, test endpoint
3. `src/services/api.js` - Changed to 127.0.0.1, added logging
4. `package.json` - Updated dev script to use 127.0.0.1

## Default Credentials

- **Email:** admin@school.com
- **Password:** admin123

## Still Having Issues?

1. Check if Windows Firewall is blocking port 5000
2. Try running terminal as Administrator
3. Check antivirus isn't blocking Node.js
4. Make sure all npm packages are installed: `npm install`
5. Delete node_modules and reinstall: `rmdir /s node_modules && npm install`

## Quick Test Commands

```bash
# Test MongoDB
mongosh

# Test if port 5000 is free
netstat -ano | findstr :5000

# Test if port 27017 is used (MongoDB)
netstat -ano | findstr :27017

# Start MongoDB
net start MongoDB

# Reset admin
npm run reset-admin

# Start backend only
npm run dev:backend

# Test backend in browser
# Open: http://127.0.0.1:5000/api/test
```
