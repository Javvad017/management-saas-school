# Authentication Quick Reference Card

## 🚀 Quick Commands

```bash
# Start backend
cd backend
npm run dev

# Create admin account
npm run create-admin

# Test login system
npm run test-login

# Reset password
npm run reset-password admin@test.com newpass123
```

---

## 🔑 Default Test Credentials

```json
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

---

## 📡 API Endpoints

### Register
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "SuperAdmin"
}
```

### Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

### Get Current User
```http
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🐛 Debugging

### Check Backend Logs
Look for these messages:
- ✅ `Login successful for email: ...`
- ❌ `Login failed: No user found...`
- ❌ `Login failed: Invalid password...`
- ❌ `Login failed: Account deactivated...`

### Check Database
```javascript
// In mongosh or MongoDB Compass
db.users.find({ email: "admin@test.com" })
```

### Verify Password Hash
Password should start with `$2a$10$` or `$2b$10$`
NOT plain text like "admin123"

---

## ✅ Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Invalid credentials | Run `npm run test-login` |
| User not found | Run `npm run create-admin` |
| Wrong password | Run `npm run reset-password email newpass` |
| MongoDB not connected | Check if MongoDB is running |
| JWT error | Check .env has JWT_SECRET |

---

## 🔐 What Was Fixed

✅ Email case sensitivity (lowercase normalization)  
✅ Password hashing (bcrypt with pre-save hook)  
✅ Password field selection (.select('+password'))  
✅ Token payload (includes role and schoolId)  
✅ Pre-save hook (proper return statement)  
✅ Error handling (try-catch in hooks)  
✅ Debugging logs (console.log for tracking)  
✅ Whitespace handling (.trim() on email)  

---

## 📚 Documentation

- **Complete Fix:** [AUTH_FIX_SUMMARY.md](AUTH_FIX_SUMMARY.md)
- **Troubleshooting:** [AUTH_TROUBLESHOOTING.md](AUTH_TROUBLESHOOTING.md)
- **API Examples:** [API_EXAMPLES.md](API_EXAMPLES.md)

---

## 🎯 Testing Checklist

- [ ] Backend running on port 5000
- [ ] MongoDB connected
- [ ] Admin account created
- [ ] Test login script passes
- [ ] Postman login works
- [ ] Token is returned
- [ ] Backend logs show success

---

## 💡 Pro Tips

1. **Always check backend logs** - They show exactly what's failing
2. **Use test-login script** - It checks all authentication steps
3. **Email is case-insensitive** - ADMIN@TEST.COM = admin@test.com
4. **Password must be 6+ characters** - Enforced by schema
5. **Token expires in 7 days** - Configurable in .env

---

**Need help? See [AUTH_TROUBLESHOOTING.md](AUTH_TROUBLESHOOTING.md)**
