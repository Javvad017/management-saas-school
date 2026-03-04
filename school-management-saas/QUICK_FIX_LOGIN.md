# 🚀 Quick Fix: Login Issue

## Problem
```
Login failed: No user found with email: admin@school.com
```

## Solution (3 Steps)

### Step 1: Navigate to Backend
```bash
cd school-management-saas/backend
```

### Step 2: Run Diagnostic
```bash
npm run diagnose-login admin@school.com admin123
```

### Step 3: Create Admin (if needed)
```bash
npm run create-school-admin
```

## Test Login

### Using npm script:
```bash
npm run test-login
```

### Using Postman:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "admin123"
}
```

## Default Credentials
- **Email:** admin@school.com
- **Password:** admin123

## Need More Help?
See [LOGIN_TROUBLESHOOTING.md](LOGIN_TROUBLESHOOTING.md) for detailed guide.

---

## All Helper Commands

```bash
# Create admin user
npm run create-school-admin

# List all users
npm run list-users

# Diagnose login
npm run diagnose-login <email> <password>

# Reset password
npm run reset-password <email> <newpassword>

# Delete user
npm run delete-user <email>

# Test login
npm run test-login
```

## Checklist

- [ ] MongoDB is running
- [ ] Backend is running (`npm run dev`)
- [ ] Admin user created (`npm run create-school-admin`)
- [ ] Diagnostic passes (`npm run diagnose-login`)
- [ ] Login works in Postman

---

**Quick Start:** [START_HERE.md](START_HERE.md)  
**Full Guide:** [LOGIN_TROUBLESHOOTING.md](LOGIN_TROUBLESHOOTING.md)
