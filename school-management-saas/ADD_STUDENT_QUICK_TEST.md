# 🚀 Add Student - Quick Test Guide

## Quick Test (5 Minutes)

### Step 1: Start Services
```bash
# Terminal 1: Backend
cd school-management-saas/backend
npm run dev

# Terminal 2: Admin Desktop
cd school-management-saas/admin-desktop
npm start
```

### Step 2: Login
- Email: `admin@school.com`
- Password: `admin123`

### Step 3: Add Student
1. Click "Students" in sidebar
2. Click "Add Student" button
3. Fill form:
   - Name: `Test Student`
   - Email: `test@student.com`
   - Password: `test123`
   - Roll Number: `TEST001`
   - Class: `10`
   - Section: `A`
   - Date of Birth: `2010-01-01`
   - Parent Name: `Test Parent`
   - Parent Phone: `1234567890`
   - Address: `Test Address`
4. Click "Add Student"

### Step 4: Verify
- ✅ Modal closes
- ✅ Success alert shown
- ✅ Student appears in list

---

## Debug Checklist

Open DevTools (F12) and check Console:

### Expected Logs (Success)
```
Add Student button clicked
Opening Add Student modal
Add Student form submitted
Student data to submit: {...}
Sending POST request to /students
Student created successfully: {...}
```

### If Button Does Nothing
- Check: "Add Student button clicked" appears
- If not: Event listener not attached

### If Modal Doesn't Open
- Check: "Opening Add Student modal" appears
- If yes but no modal: CSS issue

### If Form Doesn't Submit
- Check: "Add Student form submitted" appears
- If not: Form validation failed

### If API Fails
- Check: Error message in console
- Check: Network tab for request details
- Check: Authorization header has token

---

## Common Errors

### "Email already registered"
**Solution:** Use different email

### "Roll number already exists"
**Solution:** Use different roll number

### "Not authorized"
**Solution:** Re-login to get fresh token

### "User role SchoolAdmin is required"
**Solution:** Login with admin account

---

## Test Data

Use these for quick testing:

**Student 1:**
```
Name: Alice Johnson
Email: alice@student.com
Password: alice123
Roll: S001
Class: 10
Section: A
DOB: 2010-01-15
Parent: Robert Johnson
Parent Phone: 1234567890
Address: 123 Main St
```

**Student 2:**
```
Name: Bob Smith
Email: bob@student.com
Password: bob123
Roll: S002
Class: 10
Section: B
DOB: 2010-02-20
Parent: Mary Smith
Parent Phone: 0987654321
Address: 456 Oak Ave
```

**Student 3:**
```
Name: Carol Davis
Email: carol@student.com
Password: carol123
Roll: S003
Class: 9
Section: A
DOB: 2011-03-10
Parent: John Davis
Parent Phone: 5551234567
Address: 789 Pine Rd
```

---

## Postman Test

**1. Login:**
```
POST http://localhost:5000/api/auth/login
Body: {"email":"admin@school.com","password":"admin123"}
```

**2. Copy token from response**

**3. Add Student:**
```
POST http://localhost:5000/api/students
Headers: Authorization: Bearer <TOKEN>
Body: {
  "name": "Test Student",
  "email": "test@student.com",
  "password": "test123",
  "rollNumber": "TEST001",
  "class": "10",
  "section": "A",
  "dateOfBirth": "2010-01-01",
  "parentName": "Test Parent",
  "parentPhone": "1234567890",
  "address": "Test Address"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": {
      "name": "Test Student",
      "email": "test@student.com"
    },
    "rollNumber": "TEST001",
    "class": "10",
    "section": "A"
  }
}
```

---

## Verification Commands

### Check Database
```bash
mongosh
use school_management_saas
db.students.countDocuments()
db.students.find().pretty()
```

### Check Users
```bash
db.users.find({role: "Student"}).pretty()
```

### Check Specific Student
```bash
db.students.findOne({rollNumber: "TEST001"})
```

---

## Success Indicators

✅ Button click opens modal  
✅ All form fields visible  
✅ Form validation works  
✅ Submit button shows "Adding..." during request  
✅ Modal closes on success  
✅ Alert shows "Student added successfully!"  
✅ Student list refreshes automatically  
✅ New student appears in table  
✅ Console shows success logs  
✅ No errors in console  

---

## Quick Fixes

### Modal Not Opening
```javascript
// In DevTools Console:
document.getElementById('add-student-modal').style.display = 'flex';
```

### Check Token
```javascript
// In DevTools Console:
console.log('Token:', token);
```

### Force Refresh List
```javascript
// In DevTools Console:
loadStudents();
```

### Check Current User
```javascript
// In DevTools Console:
console.log('Current User:', currentUser);
```

---

**Full Guide:** [ADD_STUDENT_FIX_GUIDE.md](ADD_STUDENT_FIX_GUIDE.md)

**Last Updated:** March 4, 2026
