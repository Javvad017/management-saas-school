# Quick Setup Guide

## ✅ Dependencies Installed!

Both the backend and student-web projects now have all dependencies installed.

## Starting the System

### Option 1: Using Batch Files (Easiest)

1. **Start Backend** (in one terminal):
   - Double-click `start-backend.bat`
   - Or run: `.\start-backend.bat`

2. **Start Web Portal** (in another terminal):
   - Double-click `start-web.bat`
   - Or run: `.\start-web.bat`

### Option 2: Manual Commands

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Web Portal:**
```powershell
cd student-web
npm run dev
```

## Important: MongoDB Required!

Before starting the backend, ensure MongoDB is running:

### Install MongoDB (if not installed):
1. Download from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will start automatically

### Check if MongoDB is running:
```powershell
mongosh
```

If it connects, MongoDB is running. Type `exit` to quit.

### Start MongoDB manually (if needed):
```powershell
net start MongoDB
```

## Access URLs

Once both servers are running:

- **Web Portal**: http://localhost:5174
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Network Access (For School Devices)

### 1. Find Your PC's IP Address:
```powershell
ipconfig
```
Look for "IPv4 Address" under your active network adapter (e.g., 192.168.1.100)

### 2. Update Web Portal Configuration:

Edit `student-web/.env`:
```env
VITE_API_URL=http://YOUR_PC_IP:5000/api
```
Replace `YOUR_PC_IP` with your actual IP address.

### 3. Configure Windows Firewall:

Run PowerShell as Administrator:
```powershell
# Allow Backend (Port 5000)
New-NetFirewallRule -DisplayName "School Backend API" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow

# Allow Web Portal (Port 5174)
New-NetFirewallRule -DisplayName "School Web Portal" -Direction Inbound -LocalPort 5174 -Protocol TCP -Action Allow
```

### 4. Access from Other Devices:

Students/Parents can access from any device on the same network:
```
http://YOUR_PC_IP:5174
```

## Creating User Accounts

### Method 1: Using API (Postman/Insomnia)

**Create Admin Account:**
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@school.com",
  "password": "admin123",
  "role": "admin"
}
```

**Create Student Account:**
First, create a student record, then create user account:
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@school.com",
  "password": "student123",
  "role": "student",
  "linkedStudentId": "STUDENT_ID_FROM_DATABASE"
}
```

### Method 2: Using MongoDB Compass

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Open `school-management` database
4. Manually insert documents into collections

## Testing the System

### 1. Test Backend:
```powershell
curl http://localhost:5000/api/health
```

Should return: `{"status":"OK","message":"Server is running"}`

### 2. Test Web Portal:
Open browser: http://localhost:5174

You should see the login page.

### 3. Test Login:
After creating user accounts, try logging in with:
- Email: student@school.com
- Password: student123
- Role: Student

## Troubleshooting

### Backend won't start:
- ❌ MongoDB not running → Start MongoDB
- ❌ Port 5000 in use → Change PORT in backend/.env
- ❌ Dependencies missing → Run `npm install` in backend folder

### Web portal won't start:
- ❌ Port 5174 in use → Change port in vite.config.js
- ❌ Dependencies missing → Run `npm install` in student-web folder

### Can't login:
- ❌ No user accounts → Create accounts via API
- ❌ Wrong credentials → Check email/password
- ❌ Backend not running → Start backend first

### Network access not working:
- ❌ Wrong IP in .env → Update VITE_API_URL
- ❌ Firewall blocking → Configure firewall rules
- ❌ Different network → Ensure devices on same WiFi

## PowerShell Commands Reference

Since you're using PowerShell, here are the correct commands:

```powershell
# Navigate to folders (use semicolon, not &&)
cd backend; npm run dev

# List files
Get-ChildItem

# Check running processes
Get-Process node

# Kill a process on port
npx kill-port 5000

# Find your IP
ipconfig

# Test API
Invoke-WebRequest http://localhost:5000/api/health
```

## Next Steps

1. ✅ Install MongoDB (if not installed)
2. ✅ Start MongoDB service
3. ✅ Start backend server
4. ✅ Start web portal
5. ✅ Create admin account
6. ✅ Create student records
7. ✅ Create student/parent user accounts
8. ✅ Test login on web portal

## Support

Check the README files in each folder for detailed documentation:
- `README.md` - Main overview
- `backend/README.md` - Backend API documentation
- `student-web/README.md` - Web portal documentation
