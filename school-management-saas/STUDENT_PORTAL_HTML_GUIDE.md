# 👨‍🎓 Student Portal - HTML/CSS/JS Implementation

## 📁 Folder Structure

```
student-portal/
├── index.html
├── login.html
├── dashboard.html
├── attendance.html
├── fees.html
├── results.html
├── homework.html
├── announcements.html
├── css/
│   └── style.css
└── js/
    ├── api.js
    ├── auth.js
    ├── login.js
    ├── dashboard.js
    ├── attendance.js
    ├── fees.js
    ├── results.js
    ├── homework.js
    └── announcements.js
```

---

## 🚀 Quick Setup

```bash
cd school-management-saas
mkdir student-portal
cd student-portal
mkdir css js
```

---

## 📄 Complete Implementation

### 1. Shared Files (api.js, auth.js, style.css)

Use the same files from Super Admin Panel guide.

### 2. login.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Portal - Login</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="login-container">
        <div class="login-card">
            <h1>Student Portal</h1>
            <form id="loginForm">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="password" required>
                </div>
                <div id="error" class="error"></div>
                <button type="submit" id="loginBtn">Login</button>
            </form>
        </div>
    </div>
    <script src="js/api.js"></script>
    <script src="js/login.js"></script>
</body>
</html>
```

### 3. dashboard.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Student Portal</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">Student Portal</div>
        <ul class="nav-links">
            <li><a href="dashboard.html" class="active">Dashboard</a></li>
            <li><a href="attendance.html">Attendance</a></li>
            <li><a href="fees.html">Fees</a></li>
            <li><a href="results.html">Results</a></li>
            <li><a href="homework.html">Homework</a></li>
            <li><a href="announcements.html">Announcements</a></li>
        </ul>
        <button onclick="logout()" class="logout-btn">Logout</button>
    </nav>

    <div class="container">
        <div id="studentInfo" class="student-info">
            <!-- Student info will be loaded here -->
        </div>

        <div class="dashboard-grid">
            <div class="card">
                <h3>Recent Attendance</h3>
                <div id="recentAttendance"></div>
            </div>

            <div class="card">
                <h3>Pending Fees</h3>
                <div id="pendingFees"></div>
            </div>

            <div class="card">
                <h3>Recent Homework</h3>
                <div id="recentHomework"></div>
            </div>

            <div class="card">
                <h3>Announcements</h3>
                <div id="recentAnnouncements"></div>
            </div>
        </div>
    </div>

    <script src="js/api.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/dashboard.js"></script>
</body>
</html>
```

### 4. attendance.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Attendance - Student Portal</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">Student Portal</div>
        <ul class="nav-links">
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="attendance.html" class="active">Attendance</a></li>
            <li><a href="fees.html">Fees</a></li>
            <li><a href="results.html">Results</a></li>
            <li><a href="homework.html">Homework</a></li>
            <li><a href="announcements.html">Announcements</a></li>
        </ul>
        <button onclick="logout()" class="logout-btn">Logout</button>
    </nav>

    <div class="container">
        <h1>My Attendance</h1>

        <div class="stats-grid" id="attendanceStats">
            <!-- Stats will be loaded here -->
        </div>

        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody id="attendanceBody">
                <!-- Attendance records will be loaded here -->
            </tbody>
        </table>
    </div>

    <script src="js/api.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/attendance.js"></script>
</body>
</html>
```

### 5. fees.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fees - Student Portal</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">Student Portal</div>
        <ul class="nav-links">
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="attendance.html">Attendance</a></li>
            <li><a href="fees.html" class="active">Fees</a></li>
            <li><a href="results.html">Results</a></li>
            <li><a href="homework.html">Homework</a></li>
            <li><a href="announcements.html">Announcements</a></li>
        </ul>
        <button onclick="logout()" class="logout-btn">Logout</button>
    </nav>

    <div class="container">
        <h1>Fee Details</h1>

        <div class="stats-grid" id="feeStats">
            <!-- Fee summary will be loaded here -->
        </div>

        <table>
            <thead>
                <tr>
                    <th>Fee Type</th>
                    <th>Amount</th>
                    <th>Paid</th>
                    <th>Pending</th>
                    <th>Due Date</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody id="feesBody">
                <!-- Fee records will be loaded here -->
            </tbody>
        </table>
    </div>

    <script src="js/api.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/fees.js"></script>
</body>
</html>
```

### 6. js/login.js
```javascript
// js/login.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');
    const loginBtn = document.getElementById('loginBtn');

    try {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';
        errorDiv.classList.remove('show');

        const response = await api.post('/auth/login', { email, password });
        
        if (response.data.role !== 'Student') {
            throw new Error('Access denied. Students only.');
        }

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.name);
        window.location.href = 'dashboard.html';
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.add('show');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
});
```

### 7. js/dashboard.js
```javascript
// js/dashboard.js
async function loadDashboard() {
    try {
        const response = await api.get('/student/dashboard');
        const data = response.data;

        // Student info
        const studentInfo = document.getElementById('studentInfo');
        studentInfo.innerHTML = `
            <h2>Welcome, ${data.student.userId?.name || 'Student'}</h2>
            <p><strong>Class:</strong> ${data.student.class}-${data.student.section}</p>
            <p><strong>Roll Number:</strong> ${data.student.rollNumber}</p>
        `;

        // Recent attendance
        const attendanceDiv = document.getElementById('recentAttendance');
        attendanceDiv.innerHTML = data.recentAttendance.slice(0, 5).map(att => `
            <div class="list-item">
                <span>${new Date(att.date).toLocaleDateString()}</span>
                <span class="badge ${att.status === 'present' ? 'active' : 'inactive'}">
                    ${att.status}
                </span>
            </div>
        `).join('') || '<p>No attendance records</p>';

        // Pending fees
        const feesDiv = document.getElementById('pendingFees');
        if (data.pendingFees.length === 0) {
            feesDiv.innerHTML = '<p>No pending fees</p>';
        } else {
            feesDiv.innerHTML = data.pendingFees.map(fee => `
                <div class="list-item">
                    <span>${fee.feeType}</span>
                    <span>$${fee.amount - fee.paidAmount}</span>
                </div>
            `).join('');
        }

        // Recent homework
        const homeworkDiv = document.getElementById('recentHomework');
        homeworkDiv.innerHTML = data.recentHomework.map(hw => `
            <div class="list-item">
                <div>
                    <strong>${hw.title}</strong>
                    <p>Due: ${new Date(hw.dueDate).toLocaleDateString()}</p>
                </div>
            </div>
        `).join('') || '<p>No homework</p>';

        // Announcements
        const announcementsDiv = document.getElementById('recentAnnouncements');
        announcementsDiv.innerHTML = data.recentAnnouncements.map(ann => `
            <div class="list-item">
                <div>
                    <strong>${ann.title}</strong>
                    <p>${ann.message}</p>
                </div>
            </div>
        `).join('') || '<p>No announcements</p>';

    } catch (error) {
        console.error('Error loading dashboard:', error);
        alert('Error loading dashboard');
    }
}

loadDashboard();
```

### 8. js/attendance.js
```javascript
// js/attendance.js
async function loadAttendance() {
    try {
        const response = await api.get('/student/attendance');
        const { attendance, stats } = response.data;

        // Load stats
        const statsHTML = `
            <div class="stat-card">
                <h3>Total Days</h3>
                <div class="value">${stats.totalDays}</div>
            </div>
            <div class="stat-card">
                <h3>Present</h3>
                <div class="value success">${stats.presentDays}</div>
            </div>
            <div class="stat-card">
                <h3>Absent</h3>
                <div class="value warning">${stats.absentDays}</div>
            </div>
            <div class="stat-card">
                <h3>Percentage</h3>
                <div class="value success">${stats.percentage}%</div>
            </div>
        `;
        document.getElementById('attendanceStats').innerHTML = statsHTML;

        // Load attendance records
        const tbody = document.getElementById('attendanceBody');
        tbody.innerHTML = attendance.map(record => `
            <tr>
                <td>${new Date(record.date).toLocaleDateString()}</td>
                <td>
                    <span class="badge ${record.status === 'present' ? 'active' : 'inactive'}">
                        ${record.status}
                    </span>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading attendance:', error);
    }
}

loadAttendance();
```

### 9. js/fees.js
```javascript
// js/fees.js
async function loadFees() {
    try {
        const response = await api.get('/student/fees');
        const { fees, summary } = response.data;

        // Load summary
        const statsHTML = `
            <div class="stat-card">
                <h3>Total Amount</h3>
                <div class="value">$${summary.totalAmount}</div>
            </div>
            <div class="stat-card">
                <h3>Paid Amount</h3>
                <div class="value success">$${summary.paidAmount}</div>
            </div>
            <div class="stat-card">
                <h3>Pending Amount</h3>
                <div class="value warning">$${summary.pendingAmount}</div>
            </div>
        `;
        document.getElementById('feeStats').innerHTML = statsHTML;

        // Load fee records
        const tbody = document.getElementById('feesBody');
        tbody.innerHTML = fees.map(fee => `
            <tr>
                <td>${fee.feeType}</td>
                <td>$${fee.amount}</td>
                <td>$${fee.paidAmount}</td>
                <td>$${fee.amount - fee.paidAmount}</td>
                <td>${new Date(fee.dueDate).toLocaleDateString()}</td>
                <td>
                    <span class="badge ${fee.status === 'paid' ? 'active' : 'inactive'}">
                        ${fee.status}
                    </span>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading fees:', error);
    }
}

loadFees();
```

### 10. Additional CSS for Student Portal
```css
/* Add to css/style.css */

.student-info {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card h3 {
    margin-bottom: 1rem;
    color: #2c3e50;
}

.list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #eee;
}

.list-item:last-child {
    border-bottom: none;
}

.list-item p {
    margin: 0.25rem 0 0 0;
    font-size: 0.875rem;
    color: #666;
}
```

---

## 🧪 Testing

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Open Student Portal:**
   - Open `login.html` in browser

3. **Login as Student:**
   - Use student credentials created by school admin

4. **Test Features:**
   - View dashboard
   - Check attendance
   - View fees
   - View homework
   - View announcements

---

## ✅ Checklist

- [ ] Create all HTML files
- [ ] Create all JS files
- [ ] Test login
- [ ] Test dashboard
- [ ] Test attendance view
- [ ] Test fees view
- [ ] Test homework view
- [ ] Test announcements

---

**Status:** Ready to implement
**Time:** 2-3 hours
