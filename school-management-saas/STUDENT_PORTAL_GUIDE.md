# 👨‍🎓 Student Portal Implementation Guide

## Overview

**Platform:** React + Vite (NEW)
**Location:** `student-portal/` (to be created)
**Port:** 3001
**Role:** Student

---

## 🎯 Features

### Pages
1. Login
2. Dashboard (Overview)
3. Attendance (with stats)
4. Fees (with summary)
5. Results (exam scores)
6. Homework (assignments)
7. Announcements (notifications)

---

## 🚀 Create New Project

```bash
# From school-management-saas directory
npm create vite@latest student-portal -- --template react
cd student-portal
npm install
npm install axios react-router-dom
```

---

## 📁 Project Structure

```
student-portal/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── StatCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Attendance.jsx
│   │   ├── Fees.jsx
│   │   ├── Results.jsx
│   │   ├── Homework.jsx
│   │   └── Announcements.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── package.json
```

---

## 🔧 Implementation

### Step 1: API Service

```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);

// Student Portal
export const getDashboard = () => api.get('/student/dashboard');
export const getAttendance = () => api.get('/student/attendance');
export const getFees = () => api.get('/student/fees');
export const getResults = () => api.get('/student/results');
export const getHomework = () => api.get('/student/homework');
export const getAnnouncements = () => api.get('/student/announcements');

export default api;
```

### Step 2: Login Page

```javascript
// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(credentials);
      const { token, role } = response.data.data;
      
      if (role !== 'Student') {
        setError('This portal is for students only');
        return;
      }

      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Student Portal</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={e => setCredentials({...credentials, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={e => setCredentials({...credentials, password: e.target.value})}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### Step 3: Dashboard Page

```javascript
// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { getDashboard } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await getDashboard();
      setData(response.data.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const { student, recentAttendance, pendingFees, recentHomework, recentAnnouncements } = data;

  return (
    <div className="dashboard">
      <h1>Welcome, {student.userId?.name}</h1>
      
      <div className="student-info">
        <p><strong>Class:</strong> {student.class}-{student.section}</p>
        <p><strong>Roll Number:</strong> {student.rollNumber}</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Recent Attendance</h3>
          {recentAttendance.slice(0, 5).map(att => (
            <div key={att._id} className="attendance-item">
              <span>{new Date(att.date).toLocaleDateString()}</span>
              <span className={`status ${att.status}`}>{att.status}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Pending Fees</h3>
          {pendingFees.length === 0 ? (
            <p>No pending fees</p>
          ) : (
            pendingFees.map(fee => (
              <div key={fee._id} className="fee-item">
                <span>{fee.feeType}</span>
                <span>${fee.amount - fee.paidAmount}</span>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h3>Recent Homework</h3>
          {recentHomework.map(hw => (
            <div key={hw._id} className="homework-item">
              <p><strong>{hw.title}</strong></p>
              <p>Due: {new Date(hw.dueDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <h3>Announcements</h3>
          {recentAnnouncements.map(ann => (
            <div key={ann._id} className="announcement-item">
              <p><strong>{ann.title}</strong></p>
              <p>{ann.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Attendance Page

```javascript
// src/pages/Attendance.jsx
import { useState, useEffect } from 'react';
import { getAttendance } from '../services/api';

export default function Attendance() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const response = await getAttendance();
      setData(response.data.data);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const { attendance, stats } = data;

  return (
    <div className="attendance-page">
      <h1>My Attendance</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Days</h3>
          <p className="count">{stats.totalDays}</p>
        </div>
        <div className="stat-card">
          <h3>Present</h3>
          <p className="count present">{stats.presentDays}</p>
        </div>
        <div className="stat-card">
          <h3>Absent</h3>
          <p className="count absent">{stats.absentDays}</p>
        </div>
        <div className="stat-card">
          <h3>Percentage</h3>
          <p className="percentage">{stats.percentage}%</p>
        </div>
      </div>

      <div className="attendance-list">
        <h2>Attendance Records</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(record => (
              <tr key={record._id}>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${record.status}`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Step 5: Fees Page


```javascript
// src/pages/Fees.jsx
import { useState, useEffect } from 'react';
import { getFees } from '../services/api';

export default function Fees() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    try {
      const response = await getFees();
      setData(response.data.data);
    } catch (error) {
      console.error('Error loading fees:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  const { fees, summary } = data;

  return (
    <div className="fees-page">
      <h1>Fee Details</h1>

      <div className="fee-summary">
        <div className="summary-card">
          <h3>Total Amount</h3>
          <p className="amount">${summary.totalAmount}</p>
        </div>
        <div className="summary-card">
          <h3>Paid Amount</h3>
          <p className="amount paid">${summary.paidAmount}</p>
        </div>
        <div className="summary-card">
          <h3>Pending Amount</h3>
          <p className="amount pending">${summary.pendingAmount}</p>
        </div>
      </div>

      <div className="fee-list">
        <h2>Fee Records</h2>
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
          <tbody>
            {fees.map(fee => (
              <tr key={fee._id}>
                <td>{fee.feeType}</td>
                <td>${fee.amount}</td>
                <td>${fee.paidAmount}</td>
                <td>${fee.amount - fee.paidAmount}</td>
                <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${fee.status}`}>
                    {fee.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Step 6: App.jsx with Routes

```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Fees from './pages/Fees';
import Results from './pages/Results';
import Homework from './pages/Homework';
import Announcements from './pages/Announcements';
import Navbar from './components/Navbar';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <main className="content">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/attendance" element={
          <ProtectedRoute>
            <Layout><Attendance /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/fees" element={
          <ProtectedRoute>
            <Layout><Fees /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute>
            <Layout><Results /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/homework" element={
          <ProtectedRoute>
            <Layout><Homework /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/announcements" element={
          <ProtectedRoute>
            <Layout><Announcements /></Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
```

### Step 7: Navbar Component

```javascript
// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>Student Portal</h2>
      </div>
      <ul className="nav-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/attendance">Attendance</Link></li>
        <li><Link to="/fees">Fees</Link></li>
        <li><Link to="/results">Results</Link></li>
        <li><Link to="/homework">Homework</Link></li>
        <li><Link to="/announcements">Announcements</Link></li>
      </ul>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </nav>
  );
}
```

---

## 🎨 Styling

```css
/* src/index.css */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: #f5f5f5;
}

.app {
  min-height: 100vh;
}

.navbar {
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
}

.content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-card h3 {
  color: #666;
  font-size: 14px;
  margin-bottom: 0.5rem;
}

.stat-card .count {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
}

.stat-card .percentage {
  font-size: 2rem;
  font-weight: bold;
  color: #27ae60;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge.present {
  background: #d4edda;
  color: #155724;
}

.badge.absent {
  background: #f8d7da;
  color: #721c24;
}

.badge.paid {
  background: #d4edda;
  color: #155724;
}

.badge.pending {
  background: #fff3cd;
  color: #856404;
}

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
```

---

## 🧪 Testing

```bash
# 1. Start backend
cd backend && npm start

# 2. Start student portal
cd student-portal && npm run dev

# 3. Login as student
# 4. Test all pages
```

---

## ✅ Checklist

- [ ] Create project with Vite
- [ ] Install dependencies
- [ ] Create API service
- [ ] Create all pages
- [ ] Add routing
- [ ] Add navigation
- [ ] Style components
- [ ] Test all features

---

**Status:** Ready to implement
**Estimated Time:** 4-5 hours
