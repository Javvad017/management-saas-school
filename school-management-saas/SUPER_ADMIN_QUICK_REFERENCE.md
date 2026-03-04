# 🔐 Super Admin Quick Reference

## Credentials

```
Email:    superadmin@example.com
Password: admin123
Role:     SuperAdmin
```

---

## Create Super Admin

```bash
cd school-management-saas/backend
node scripts/createSuperAdmin.js
```

---

## Test Login (API)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"superadmin@example.com\",\"password\":\"admin123\"}"
```

---

## Test Login (Frontend)

1. Open: `super-admin-panel/login.html`
2. Email: `superadmin@example.com`
3. Password: `admin123`
4. Click "Sign In"

---

## Verify in Database

```bash
mongosh
use school_management_saas
db.users.findOne({ role: 'SuperAdmin' })
```

---

## Reset Password

```bash
cd school-management-saas/backend
node scripts/resetPassword.js superadmin@example.com newpassword
```

---

## Delete Super Admin

```bash
cd school-management-saas/backend
node scripts/deleteUser.js superadmin@example.com
```

---

## Auto-Creation

The server automatically creates a Super Admin on startup if none exists.

Just start the server:
```bash
cd school-management-saas/backend
node server.js
```

Look for:
```
✅ Auto-created Super Admin account
   Email: superadmin@example.com
   Password: admin123
```

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| "Invalid credentials" | Run `node scripts/createSuperAdmin.js` |
| "User already exists" | Use existing credentials or reset password |
| "MongoDB connection error" | Start MongoDB: `net start MongoDB` |
| Wrong password | Reset: `node scripts/resetPassword.js superadmin@example.com admin123` |

---

## Files

| File | Purpose |
|------|---------|
| `scripts/createSuperAdmin.js` | Create Super Admin script |
| `server.js` | Auto-creates Super Admin on startup |
| `SUPER_ADMIN_SETUP_GUIDE.md` | Detailed documentation |

---

## Quick Commands

```bash
# Create Super Admin
node scripts/createSuperAdmin.js

# List all users
node scripts/listUsers.js

# Reset password
node scripts/resetPassword.js superadmin@example.com admin123

# Delete user
node scripts/deleteUser.js superadmin@example.com

# Start server
node server.js

# Test health
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"superadmin@example.com\",\"password\":\"admin123\"}"
```

---

**Ready to login!** 🚀
