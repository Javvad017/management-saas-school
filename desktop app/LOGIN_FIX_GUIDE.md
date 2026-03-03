# Login Issue Fix Guide

## Files Updated

1. ✅ `backend/server.js` - Added detailed logging and auto-create admin
2. ✅ `backend/routes/auth.js` - Added comprehensive debug logging
3. ✅ `src/pages/Login.jsx` - Added frontend logging
4. ✅ `src/context/AuthContext.jsx` - Added error logging

## How to Fix Login Issue

### Step 1: Make Sure MongoDB is Running

**Windows:**
1. Press `Win + R`, type `services.msc`, press Enter
2. Find "MongoDB" service in the list
3. Make sure Status is "Running"
4. If not, right-click and select "Start"

**Or run in Command Prompt (as Administrator):**
```cmd
net start MongoDB
```

### Step 2: Stop All Running Processes

Press `Ctrl + C` in the terminal to stop the current dev server.

### Step 3: Reset Admin User (Optional but Recommended)

Run this command to create a fresh admin user:
```bash
npm run reset-admin
```

You should see:
```
✓ Connected to MongoDB
✓ Cleared existing admins
✓ Admin created successfully
  Email: admin@school.com
  Password: admin123
✓ Admin verified in database
✓ Done
```

### Step 4: Start the App

```bash
npm run dev
```

### Step 5: Check Backend Logs

You should see these messages in the terminal:
```
Starting server...
Connecting to MongoDB: mongodb://localhost:27017/school-management
✓ MongoDB connected successfully
✓ Default admin created: admin@school.com / admin123
  (or "✓ Admin already exists")
✓ Server running on port 5000
✓ API available at http://localhost:5000/api
✓ Ready to accept connections
```

### Step 6: Try Login

1. Open the app (Electron should launch automatically)
2. Enter credentials:
   - Email: `admin@school.com`
   - Password: `admin123`
3. Click "Sign In"

### Step 7: Check Console Logs

**Backend Terminal** should show:
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

**Browser DevTools Console** (F12) should show:
```
=== Frontend Login Attempt ===
Email: admin@school.com
Password length: 8
API URL: http://localhost:5000/api
AuthContext: Calling login API...
AuthContext: Login API response: {success: true, token: "...", user: {...}}
AuthContext: Login successful, token saved
Login result: {success: true}
Login successful!
```

## Common Issues

### Issue 1: "MongoDB connection error"
**Solution:** MongoDB is not running. Start MongoDB service (see Step 1).

### Issue 2: "Admin found: NO"
**Solution:** Admin user doesn't exist. Run `npm run reset-admin` (see Step 3).

### Issue 3: "Password match: NO"
**Solution:** Password hash mismatch. Run `npm run reset-admin` to recreate admin.

### Issue 4: "Network Error" or "ERR_CONNECTION_REFUSED"
**Solution:** Backend is not running. Make sure you see "Server running on port 5000" in terminal.

### Issue 5: Login button does nothing
**Solution:** Check browser console (F12) for JavaScript errors.

## Verify Everything is Working

1. Backend running: http://localhost:5000/api/health should return `{"status":"ok","message":"Server is running"}`
2. Frontend running: http://localhost:5173 should show the login page
3. MongoDB running: Run `mongosh` in terminal, should connect without errors

## Default Credentials

- **Email:** admin@school.com
- **Password:** admin123

## Need More Help?

Check the terminal logs for detailed error messages. All login attempts are now logged with full details.
