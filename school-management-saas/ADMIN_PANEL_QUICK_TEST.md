# 🚀 Admin Panel - Quick Test Guide

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

### Step 3: Test Students

1. Click "Students" in sidebar
2. Check console (F12) for logs
3. Should see: "Fetching students from API..."
4. Table should display students OR "No students found"

### Step 4: Add Student

1. Click "Add Student" button
2. Fill form:
   - Name: Test Student
   - Email: test@student.com
   - Password: test123
   - Roll Number: TEST001
   - Class: 10
   - Section: A
   - Date of Birth: 2010-01-01
   - Parent Name: Test Parent
   - Parent Phone: 1234567890
   - Address: Test Address
3. Click "Add Student"
4. Should see success alert
5. Student should appear in table

### Step 5: Test Teachers

1. Click "Teachers" in sidebar
2. Check console for logs
3. Should see: "Fetching teachers from API..."
4. Table should display teachers OR "No teachers found"

### Step 6: Add Teacher

1. Click "Add Teacher" button
2. Fill form:
   - Name: Test Teacher
   - Email: test@teacher.com
   - Password: test123
   - Phone: 1234567890
   - Employee ID: T001
   - Subject: Mathematics
   - Qualification: M.Sc, B.Ed
   - Salary: 50000
   - Address: Test Address
3. Click "Add Teacher"
4. Should see success alert
5. Teacher should appear in table

---

## Expected Console Logs

### Loading Students
```
Fetching students from API...
Students API response: {success: true, count: 1, data: [...]}
Loaded 1 students
```

### Adding Student
```
Add Student button clicked
Opening Add Student modal
Add Student form submitted
Student data to submit: {name: "Test Student", ...}
Sending POST request to /students
Student created successfully: {success: true, data: {...}}
Fetching students from API...
```

### Loading Teachers
```
Fetching teachers from API...
Teachers API response: {success: true, count: 1, data: [...]}
Loaded 1 teachers
```

### Adding Teacher
```
Add Teacher button clicked
Opening Add Teacher modal
Add Teacher form submitted
Teacher data to submit: {name: "Test Teacher", ...}
Sending POST request to /teachers
Teacher created successfully: {success: true, data: {...}}
Fetching teachers from API...
```

---

## Debug Checklist

### ✅ Backend Running
```bash
# Should see:
Server running on port 5000
MongoDB Connected
```

### ✅ Admin Desktop Running
```bash
# Electron window should open
```

### ✅ Login Successful
- Dashboard loads
- Stats display

### ✅ API Calls Working
- Console shows request logs
- Console shows response logs
- Network tab shows 200/201 status

---

## Common Issues

### Issue: Empty Tables
**Fix:** Add data using Add buttons

### Issue: "Network Error"
**Fix:** Check backend is running

### Issue: "401 Unauthorized"
**Fix:** Re-login to get fresh token

### Issue: Modal Doesn't Open
**Fix:** Check console for JavaScript errors

---

## Test Data

**Student 1:**
- Name: Alice Johnson
- Email: alice@student.com
- Password: alice123
- Roll: S001
- Class: 10, Section: A

**Student 2:**
- Name: Bob Smith
- Email: bob@student.com
- Password: bob123
- Roll: S002
- Class: 10, Section: B

**Teacher 1:**
- Name: Jane Doe
- Email: jane@teacher.com
- Password: jane123
- Employee ID: T001
- Subject: Mathematics
- Salary: 50000

**Teacher 2:**
- Name: John Smith
- Email: john@teacher.com
- Password: john123
- Employee ID: T002
- Subject: Science
- Salary: 55000

---

## Success Indicators

✅ Students table loads  
✅ Teachers table loads  
✅ Add Student works  
✅ Add Teacher works  
✅ Delete buttons work  
✅ Console shows logs  
✅ No errors in console  

---

**Full Guide:** [ADMIN_PANEL_DATA_FIX_GUIDE.md](ADMIN_PANEL_DATA_FIX_GUIDE.md)

**Last Updated:** March 4, 2026
