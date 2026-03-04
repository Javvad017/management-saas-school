# 🎯 Super Admin Panel - HTML/CSS/JS Implementation

## 📁 Folder Structure

```
super-admin-panel/
├── index.html (redirects to login)
├── login.html
├── dashboard.html
├── schools.html
├── subscriptions.html
├── revenue.html
├── css/
│   └── style.css
└── js/
    ├── api.js
    ├── auth.js
    ├── login.js
    ├── dashboard.js
    ├── schools.js
    ├── subscriptions.js
    └── revenue.js
```

---

## 🚀 Quick Setup

```bash
cd school-management-saas
mkdir super-admin-panel
cd super-admin-panel
mkdir css js
```

---

## 📄 Files to Create

### 1. index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Super Admin Panel</title>
    <script>
        // Redirect to login or dashboard
        const token = localStorage.getItem('token');
        window.location.href = token ? 'dashboard.html' : 'login.html';
    </script>
</head>
<body>
    <p>Redirecting...</p>
</body>
</html>
```

### 2. login.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Super Admin Login</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="login-container">
        <div class="login-card">
            <h1>Super Admin Panel</h1>
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
    <title>Dashboard - Super Admin</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">Super Admin Panel</div>
        <ul class="nav-links">
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="schools.html">Schools</a></li>
            <li><a href="subscriptions.html">Subscriptions</a></li>
            <li><a href="revenue.html">Revenue</a></li>
        </ul>
        <button onclick="logout()" class="logout-btn">Logout</button>
    </nav>

    <div class="container">
        <h1>Dashboard</h1>
        <div class="stats-grid" id="statsGrid">
            <!-- Stats will be loaded here -->
        </div>
    </div>

    <script src="js/api.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/dashboard.js"></script>
</body>
</html>
```

### 4. schools.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Schools - Super Admin</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">Super Admin Panel</div>
        <ul class="nav-links">
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="schools.html" class="active">Schools</a></li>
            <li><a href="subscriptions.html">Subscriptions</a></li>
            <li><a href="revenue.html">Revenue</a></li>
        </ul>
        <button onclick="logout()" class="logout-btn">Logout</button>
    </nav>

    <div class="container">
        <div class="header">
            <h1>Schools Management</h1>
            <button onclick="showCreateModal()" class="btn-primary">Create School</button>
        </div>

        <table id="schoolsTable">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="schoolsBody">
                <!-- Schools will be loaded here -->
            </tbody>
        </table>
    </div>

    <!-- Create School Modal -->
    <div id="createModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2>Create School</h2>
            <form id="createSchoolForm">
                <div class="form-group">
                    <label>School Name</label>
                    <input type="text" id="schoolName" required>
                </div>
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" id="address" required>
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="tel" id="phone" required>
                </div>
                <div class="form-group">
                    <label>School Email</label>
                    <input type="email" id="schoolEmail" required>
                </div>
                <div class="form-group">
                    <label>Admin Name</label>
                    <input type="text" id="adminName" required>
                </div>
                <div class="form-group">
                    <label>Admin Email</label>
                    <input type="email" id="adminEmail" required>
                </div>
                <div class="form-group">
                    <label>Admin Password</label>
                    <input type="password" id="adminPassword" required>
                </div>
                <button type="submit" class="btn-primary">Create School</button>
            </form>
        </div>
    </div>

    <script src="js/api.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/schools.js"></script>
</body>
</html>
```

### 5. revenue.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revenue - Super Admin</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">Super Admin Panel</div>
        <ul class="nav-links">
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="schools.html">Schools</a></li>
            <li><a href="subscriptions.html">Subscriptions</a></li>
            <li><a href="revenue.html" class="active">Revenue</a></li>
        </ul>
        <button onclick="logout()" class="logout-btn">Logout</button>
    </nav>

    <div class="container">
        <h1>Revenue Dashboard</h1>
        <div class="stats-grid" id="revenueStats">
            <!-- Revenue stats will be loaded here -->
        </div>
        
        <h2>Recent Subscriptions</h2>
        <table id="subscriptionsTable">
            <thead>
                <tr>
                    <th>School</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody id="subscriptionsBody">
                <!-- Subscriptions will be loaded here -->
            </tbody>
        </table>
    </div>

    <script src="js/api.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/revenue.js"></script>
</body>
</html>
```

### 6. css/style.css

```css
/* css/style.css */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background: #f5f5f5;
}

/* Navbar */
.navbar {
    background: #2c3e50;
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
}

.nav-links a:hover,
.nav-links a.active {
    background: #34495e;
}

.logout-btn {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 2rem;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

/* Login */
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 400px;
}

.login-card h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: #2c3e50;
}

/* Forms */
.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #667eea;
}

/* Buttons */
button {
    cursor: pointer;
    font-size: 1rem;
}

.btn-primary {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
}

.btn-primary:hover {
    background: #5568d3;
}

.btn-danger {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
}

.btn-danger:hover {
    background: #c0392b;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-card h3 {
    color: #666;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.stat-card .value {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
}

.stat-card .value.success {
    color: #27ae60;
}

.stat-card .value.warning {
    color: #f39c12;
}

/* Table */
table {
    width: 100%;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

table th {
    background: #2c3e50;
    color: white;
    padding: 1rem;
    text-align: left;
}

table td {
    padding: 1rem;
    border-bottom: 1px solid #eee;
}

table tr:last-child td {
    border-bottom: none;
}

/* Badge */
.badge {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 600;
}

.badge.active {
    background: #d4edda;
    color: #155724;
}

.badge.inactive {
    background: #f8d7da;
    color: #721c24;
}

/* Modal */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
}

.modal.show {
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
}

.close {
    float: right;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
}

.close:hover {
    color: #333;
}

/* Error */
.error {
    color: #e74c3c;
    margin: 1rem 0;
    padding: 0.75rem;
    background: #fadbd8;
    border-radius: 4px;
    display: none;
}

.error.show {
    display: block;
}

/* Success */
.success {
    color: #27ae60;
    margin: 1rem 0;
    padding: 0.75rem;
    background: #d4edda;
    border-radius: 4px;
}
```

### 7. js/api.js
```javascript
// js/api.js
const API_URL = 'http://localhost:5000/api';

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: { ...headers, ...options.headers }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    get(endpoint) {
        return this.request(endpoint);
    },

    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
};
```

### 8. js/auth.js
```javascript
// js/auth.js
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

// Check auth on page load
if (!window.location.pathname.includes('login.html')) {
    checkAuth();
}
```

### 9. js/login.js
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
        
        if (response.data.role !== 'SuperAdmin') {
            throw new Error('Access denied. Super Admin only.');
        }

        localStorage.setItem('token', response.data.token);
        window.location.href = 'dashboard.html';
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.add('show');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
});
```

### 10. js/dashboard.js
```javascript
// js/dashboard.js
async function loadDashboard() {
    try {
        const [schoolsRes, revenueRes] = await Promise.all([
            api.get('/schools'),
            api.get('/revenue')
        ]);

        const schools = schoolsRes.data;
        const revenue = revenueRes.data;

        const statsHTML = `
            <div class="stat-card">
                <h3>Total Schools</h3>
                <div class="value">${schools.length}</div>
            </div>
            <div class="stat-card">
                <h3>Active Schools</h3>
                <div class="value success">${schools.filter(s => s.isActive).length}</div>
            </div>
            <div class="stat-card">
                <h3>Total Revenue</h3>
                <div class="value success">$${revenue.totalRevenue || 0}</div>
            </div>
            <div class="stat-card">
                <h3>Monthly Revenue</h3>
                <div class="value">$${revenue.monthlyRevenue || 0}</div>
            </div>
        `;

        document.getElementById('statsGrid').innerHTML = statsHTML;
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

loadDashboard();
```

### 11. js/schools.js
```javascript
// js/schools.js
async function loadSchools() {
    try {
        const response = await api.get('/schools');
        const schools = response.data;

        const tbody = document.getElementById('schoolsBody');
        tbody.innerHTML = schools.map(school => `
            <tr>
                <td>${school.name}</td>
                <td>${school.email}</td>
                <td>${school.phone}</td>
                <td>
                    <span class="badge ${school.isActive ? 'active' : 'inactive'}">
                        ${school.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <button onclick="deleteSchool('${school._id}')" class="btn-danger">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading schools:', error);
    }
}

function showCreateModal() {
    document.getElementById('createModal').classList.add('show');
}

function closeModal() {
    document.getElementById('createModal').classList.remove('show');
}

document.getElementById('createSchoolForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('schoolName').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('schoolEmail').value,
        adminName: document.getElementById('adminName').value,
        adminEmail: document.getElementById('adminEmail').value,
        adminPassword: document.getElementById('adminPassword').value
    };

    try {
        await api.post('/schools', formData);
        closeModal();
        loadSchools();
        e.target.reset();
        alert('School created successfully!');
    } catch (error) {
        alert('Error creating school: ' + error.message);
    }
});

async function deleteSchool(id) {
    if (!confirm('Are you sure you want to delete this school?')) return;

    try {
        await api.delete(`/schools/${id}`);
        loadSchools();
        alert('School deleted successfully!');
    } catch (error) {
        alert('Error deleting school: ' + error.message);
    }
}

loadSchools();
```

### 12. js/revenue.js
```javascript
// js/revenue.js
async function loadRevenue() {
    try {
        const response = await api.get('/revenue');
        const data = response.data;

        // Load stats
        const statsHTML = `
            <div class="stat-card">
                <h3>Total Revenue</h3>
                <div class="value success">$${data.totalRevenue || 0}</div>
            </div>
            <div class="stat-card">
                <h3>Monthly Revenue</h3>
                <div class="value">$${data.monthlyRevenue || 0}</div>
            </div>
            <div class="stat-card">
                <h3>Active Subscriptions</h3>
                <div class="value">${data.activeSubscriptions || 0}</div>
            </div>
            <div class="stat-card">
                <h3>Total Subscriptions</h3>
                <div class="value">${data.totalSubscriptions || 0}</div>
            </div>
        `;
        document.getElementById('revenueStats').innerHTML = statsHTML;

        // Load recent subscriptions
        const tbody = document.getElementById('subscriptionsBody');
        tbody.innerHTML = (data.recentSubscriptions || []).map(sub => `
            <tr>
                <td>${sub.schoolId?.name || 'N/A'}</td>
                <td>${sub.plan}</td>
                <td>$${sub.amount}</td>
                <td>
                    <span class="badge ${sub.status === 'active' ? 'active' : 'inactive'}">
                        ${sub.status}
                    </span>
                </td>
                <td>${new Date(sub.createdAt).toLocaleDateString()}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading revenue:', error);
    }
}

loadRevenue();
```

---

## 🧪 Testing

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Open Super Admin Panel:**
   ```bash
   cd super-admin-panel
   # Open login.html in browser
   ```

3. **Login:**
   - Email: superadmin@example.com
   - Password: admin123

4. **Test Features:**
   - View dashboard
   - Create school
   - View revenue
   - Delete school

---

## ✅ Checklist

- [ ] Create all HTML files
- [ ] Create CSS file
- [ ] Create all JS files
- [ ] Test login
- [ ] Test school creation
- [ ] Test school deletion
- [ ] Test revenue dashboard

---

**Status:** Ready to implement
**Time:** 2-3 hours
