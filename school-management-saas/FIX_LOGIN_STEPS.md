# Login Issue Fixed - Steps to Test

## What Was Wrong?
The backend CORS configuration only allowed `http://localhost:3000` and `http://localhost:5173`, but when you open HTML files directly (double-click), they use the `file://` protocol which was blocked.

## What I Fixed
Updated `backend/server.js` to allow all origins during development:
```javascript
app.use(cors({
  origin: true, // Allow all origins (for file:// protocol and any localhost port)
  credentials: true
}));
```

## Steps to Test Login

### 1. Restart Backend Server
```bash
cd school-management-saas/backend
# Stop the current server (Ctrl+C in the terminal where it's running)
# Then start it again:
node server.js
```

You should see:
```
Server running in development mode on port 5000
MongoDB connected: localhost
```

### 2. Create Super Admin User (if not exists)
```bash
cd school-management-saas/backend
node scripts/createAdmin.js
```

This creates:
- Email: `superadmin@example.com`
- Password: `admin123`
- Role: `SuperAdmin`

### 3. Test Login
1. Open `school-management-saas/super-admin-panel/login.html` in your browser
2. Enter credentials:
   - Email: `superadmin@example.com`
   - Password: `admin123`
3. Click "Sign In"
4. You should be redirected to the dashboard

## Alternative: Use Live Server
If you still have issues, use a local web server instead of opening files directly:

### Option A: Using Python
```bash
cd school-management-saas/super-admin-panel
python -m http.server 8080
```
Then open: `http://localhost:8080/login.html`

### Option B: Using Node.js http-server
```bash
npm install -g http-server
cd school-management-saas/super-admin-panel
http-server -p 8080
```
Then open: `http://localhost:8080/login.html`

### Option C: Using VS Code Live Server Extension
1. Install "Live Server" extension in VS Code
2. Right-click on `login.html`
3. Select "Open with Live Server"

## Verify Backend is Running
Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"success":true,"message":"Server is running"}
```

## Test Login API Directly
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"superadmin@example.com\",\"password\":\"admin123\"}"
```

Should return a token and user data.

## Troubleshooting

### Still getting "Failed to fetch"?
1. Check browser console (F12) for detailed error
2. Verify backend is running: `netstat -ano | findstr :5000`
3. Check MongoDB is running: `mongod --version`
4. Restart backend server

### "Access denied. Super Admin only"?
The user exists but doesn't have SuperAdmin role. Run:
```bash
cd school-management-saas/backend
node scripts/listUsers.js
```

Check the role. If wrong, delete and recreate:
```bash
node scripts/deleteUser.js superadmin@example.com
node scripts/createAdmin.js
```

### MongoDB Connection Error?
Start MongoDB:
```bash
# Windows
net start MongoDB

# Or if installed manually
mongod --dbpath C:\data\db
```

## Next Steps After Login Works
1. Complete Student Portal pages
2. Build Teacher Portal
3. Create Admin Desktop (Electron)
4. Test all CRUD operations
