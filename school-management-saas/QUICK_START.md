# Quick Start - 5 Minutes Setup

## Prerequisites Check

```bash
# Check Node.js (should be v18+)
node --version

# Check MongoDB (should be running)
mongosh --version
```

## 1. Start MongoDB

**Windows:**
```bash
net start MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl start mongodb
# or
brew services start mongodb-community
```

## 2. Backend (Terminal 1)

```bash
cd school-management-saas/backend
npm install
npm run dev
```

Wait for: `Server running in development mode on port 5000`

## 3. Create Test Data (Terminal 2)

```bash
cd school-management-saas/backend

# Create SuperAdmin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Super Admin\",\"email\":\"super@admin.com\",\"password\":\"admin123\",\"role\":\"SuperAdmin\"}"

# Save the token from response, then create school:
curl -X POST http://localhost:5000/api/schools \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"name\":\"Demo School\",\"address\":\"123 St\",\"phone\":\"1234567890\",\"email\":\"demo@school.com\",\"adminName\":\"School Admin\",\"adminEmail\":\"admin@demo.com\",\"adminPassword\":\"admin123\"}"
```

## 4. User Website (Terminal 3)

```bash
cd school-management-saas/user-website
npm install
npm run dev
```

Open: http://localhost:3000

## 5. Admin Desktop (Terminal 4)

```bash
cd school-management-saas/admin-desktop
npm install
npm start
```

## Test Credentials

After creating school in step 3:

**Admin Desktop Login:**
- Email: admin@demo.com
- Password: admin123

**Create a student first via Admin Desktop, then:**

**User Website Login:**
- Email: (student email you created)
- Password: (student password you set)

## Troubleshooting

### MongoDB not running?
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

### Port 5000 already in use?
Edit `backend/.env` and change PORT to 5001

### Can't connect to backend?
Make sure backend terminal shows "MongoDB Connected"

### CORS error?
Backend is configured for localhost:3000 and localhost:5173

## What's Next?

1. Login to Admin Desktop
2. Create students and teachers
3. Mark attendance
4. Add fee records
5. Login to User Website with student credentials
6. View dashboard, attendance, and fees

## Full Documentation

- See `README.md` for complete documentation
- See `API_EXAMPLES.md` for all API endpoints
- See `SETUP_GUIDE.md` for detailed setup instructions
