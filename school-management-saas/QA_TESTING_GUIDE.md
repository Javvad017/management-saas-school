# 🧪 QA Testing Guide

Manual testing checklist and test cases for the School Management SaaS platform.

---

## 🔧 Test Environment Setup

1. Start MongoDB locally
2. Start backend: `cd backend && npm run dev`
3. Verify: `http://localhost:5000/api/health` returns `{ success: true }`
4. Note the auto-created Super Admin credentials from the console

---

## 🔐 Test Account Credentials

| Role         | Email                   | Password   | Created Via          |
|--------------|-------------------------|------------|----------------------|
| Super Admin  | superadmin@example.com  | admin123   | Auto-created         |
| School Admin | *(create via admin)*    | *(custom)* | Super Admin panel    |
| Teacher      | *(create via admin)*    | *(custom)* | Admin Desktop        |
| Student      | *(create via admin)*    | *(custom)* | Admin Desktop        |

---

## TC-1: Authentication

### TC-1.1 — Login (Admin Desktop)
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open Electron app (`cd admin-desktop && npm run dev`) | Login screen appears |
| 2 | Enter `superadmin@example.com` / `admin123` | Dashboard loads |
| 3 | Enter wrong password | Error message shows |
| 4 | Leave fields empty and submit | Validation error shows |
| 5 | Click Logout | Returns to login screen |

### TC-1.2 — Login (Student Portal)
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open `user-website/login.html` | Login page shows |
| 2 | Enter valid Student credentials | Dashboard loads with sidebar, stats, charts |
| 3 | Enter wrong credentials | Error message displays |
| 4 | Refresh page after login | Should stay logged in (token in localStorage) |
| 5 | Click Logout in sidebar | Returns to login page |

---

## TC-2: Admin Desktop — Student Management

### TC-2.1 — Add Student
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Users page | Students list displayed |
| 2 | Click "Add Student" | Modal form opens |
| 3 | Fill all fields and submit | Student created, list refreshes, alert shows |
| 4 | Submit with empty required fields | Validation error displays |
| 5 | Add duplicate email | Backend error message displays |

### TC-2.2 — Delete Student
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Delete" on a student row | Confirm dialog appears |
| 2 | Confirm deletion | Student removed, list refreshes |
| 3 | Cancel deletion | Nothing happens |

---

## TC-3: Admin Desktop — Teacher Management

### TC-3.1 — Add Teacher
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Users page | Teachers list displayed |
| 2 | Click "Add Teacher" | Modal form opens |
| 3 | Fill all fields (name, email, subject, salary, etc.) | Teacher created successfully |
| 4 | Verify new teacher in list | Shows name, subject, phone, salary |

---

## TC-4: Admin Desktop — Attendance

### TC-4.1 — Mark Attendance
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Attendance page | Attendance records displayed |
| 2 | Click "Mark Attendance" | Modal with student list opens |
| 3 | Set date and mark Present/Absent for each student | All radio buttons work |
| 4 | Click Submit | Attendance saved, list refreshes, success alert |
| 5 | Check records table | New entries appear with correct status |

---

## TC-5: Admin Desktop — Fees

### TC-5.1 — View and Pay Fees
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Fees page | Fee records list displayed |
| 2 | See unpaid fee row | "Mark Paid" button available |
| 3 | Click "Mark Paid" | Confirm dialog, fee status updates to Paid |
| 4 | Paid fee row | Button disappears, status shows "Paid" |

---

## TC-6: Admin Desktop — Reports

### TC-6.1 — Generate Reports
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to Reports page | 6 report cards + stats + charts visible |
| 2 | Verify quick stats update | Total Students, Teachers, Attendance Rate, Fees show data |
| 3 | Verify charts render | Attendance bar chart + Fees doughnut chart display |
| 4 | Click "Generate Report" on Student Report card | Modal opens with loading spinner, then data table shows |
| 5 | Verify table columns | #, Name, Roll No, Class, Section, Parent columns present |
| 6 | Repeat for all 6 reports | Each shows correct data and columns |

### TC-6.2 — Export Functionality
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Generate any report | Report modal with data visible |
| 2 | Click "Export CSV" | `.csv` file downloads |
| 3 | Open CSV in Excel/Sheets | Data matches the table |
| 4 | Click "Export PDF" | `.pdf` file downloads |
| 5 | Open PDF | Formatted table with title, data, timestamp |
| 6 | Click "Print" | Print preview opens in new window |

### TC-6.3 — Real-Time Auto-Refresh
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Stay on Reports page for 15+ seconds | "Last updated" timestamp changes |
| 2 | Add a student via another window | Stats update within 10 seconds without page refresh |

---

## TC-7: Student Portal — Dashboard

### TC-7.1 — Dashboard Layout
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as Student | Dashboard page loads |
| 2 | Verify sidebar | All 7 menu items present with icons |
| 3 | Verify top navbar | Student name, avatar shown |
| 4 | Verify 4 stat cards | Attendance %, Fees Due, Subjects, Upcoming Exams |
| 5 | Verify charts | Attendance line chart, Performance bar chart, Fees doughnut |
| 6 | Verify activity feed | Recent activities listed |

### TC-7.2 — Real-Time Refresh
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Stay on dashboard 15+ seconds | "Live" indicator visible, data auto-refreshes |
| 2 | Check browser console | No errors during refresh cycles |

---

## TC-8: Student Portal — Sub Pages

### TC-8.1 — Attendance Page
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Attendance" in sidebar | Attendance page loads |
| 2 | Verify 3 stat cards | Total Days, Present, Absent |
| 3 | Verify trend chart | Line chart renders |
| 4 | Verify records table | Date, Day, Status (badge), Remarks columns |

### TC-8.2 — Fees Page
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Fees" in sidebar | Fees page loads |
| 2 | Verify 3 stat cards | Total, Paid, Pending amounts |
| 3 | Verify doughnut chart | Paid vs Pending with center percentage |
| 4 | Verify fee types bar chart | Bar chart by category |
| 5 | Verify payment table | Fee Type, Amount, Paid, Status columns |

### TC-8.3 — Results Page
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Results" in sidebar | Results page loads |
| 2 | Verify 4 stat cards | Total Exams, Avg Score, Best Subject, Subjects |
| 3 | Verify performance chart | Bar chart by subject |
| 4 | Verify results table | Subject, Exam, Marks, Total, %, Grade columns |

### TC-8.4 — Notifications Page
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Notifications" in sidebar | Notifications page loads |
| 2 | Verify filter tabs | All, Announcements, Alerts, Reminders buttons work |
| 3 | Click a filter tab | List filters by type |
| 4 | Click "Mark all read" | Unread indicators disappear |
| 5 | Verify auto-refresh | Notifications refresh every 10 seconds |

### TC-8.5 — Settings Page
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Settings" in sidebar | Settings page loads |
| 2 | Verify profile info | Name, email, class shown |
| 3 | Toggle notification preferences | Toast "Preference saved" appears |
| 4 | Click "Sign Out" | Redirects to login page |

---

## TC-9: Navigation & Sidebar

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click each sidebar link | Correct page loads |
| 2 | Verify active state | Current page highlighted in sidebar |
| 3 | Verify Logout | Clears session, redirects to login |

---

## TC-10: API Endpoint Testing (Postman / cURL)

### TC-10.1 — Auth
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@example.com","password":"admin123"}'

# Expected: { success: true, data: { token: "...", ... } }
```

### TC-10.2 — Protected Routes
```bash
# Get students (requires token)
curl http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN"

# Expected: { success: true, count: N, data: [...] }
```

### TC-10.3 — Unauthorized Access
```bash
# Without token
curl http://localhost:5000/api/students

# Expected: 401 Unauthorized error
```

---

## 🐛 Bug Report Template

When reporting issues, include:

```
**Title:** [Short description]
**Severity:** Critical / Major / Minor / UI
**Page:** [Which page/section]
**Steps to Reproduce:**
1. ...
2. ...
3. ...

**Expected Result:** What should happen
**Actual Result:** What actually happens
**Browser/App:** Chrome / Electron
**Console Errors:** [Copy any errors]
**Screenshot:** [Attach if applicable]
```

---

## ✅ Test Completion Checklist

- [ ] All login flows work (Admin, Student)
- [ ] Student CRUD operations work
- [ ] Teacher CRUD operations work
- [ ] Attendance marking works
- [ ] Fee payment works
- [ ] All 6 reports generate correctly
- [ ] CSV export downloads valid file
- [ ] PDF export downloads valid file
- [ ] Auto-refresh updates data every 10 seconds
- [ ] Charts render with real data
- [ ] All sidebar navigation links work
- [ ] Logout clears session on all portals
- [ ] No console errors during normal usage
- [ ] API returns proper errors for unauthorized access
