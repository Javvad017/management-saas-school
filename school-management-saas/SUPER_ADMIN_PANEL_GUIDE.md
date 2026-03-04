# 🎯 Super Admin Panel Implementation Guide

## Overview

**Platform:** React + Vite
**Location:** `super-admin-panel/`
**Port:** 5173
**Role:** SuperAdmin

---

## 📋 Features to Implement

### Pages
1. ✅ Login
2. ✅ Dashboard
3. ✅ Schools Management
4. ❌ Subscriptions (NEW)
5. ❌ Revenue Dashboard (NEW)
6. ❌ Users Management (NEW)

---

## 🚀 Quick Start

```bash
cd super-admin-panel
npm install
npm run dev
```

---

## 📁 Folder Structure

```
super-admin-panel/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx          ✅ Exists
│   │   ├── Dashboard.jsx      ✅ Exists
│   │   ├── Schools.jsx        ✅ Exists
│   │   ├── Subscriptions.jsx  ❌ Create
│   │   ├── Revenue.jsx        ❌ Create
│   │   └── Users.jsx          ❌ Create
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 🔧 Implementation Steps

### Step 1: Update API Service


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

// Schools
export const getSchools = () => api.get('/schools');
export const createSchool = (data) => api.post('/schools', data);
export const deleteSchool = (id) => api.delete(`/schools/${id}`);
export const updateSchool = (id, data) => api.put(`/schools/${id}`, data);

// Revenue
export const getRevenue = () => api.get('/revenue');
export const getSubscriptions = () => api.get('/revenue/subscriptions');
export const createSubscription = (data) => api.post('/revenue/subscriptions', data);

export default api;
```

### Step 2: Create Revenue Dashboard Page

```javascript
// src/pages/Revenue.jsx
import { useState, useEffect } from 'react';
import { getRevenue } from '../services/api';

export default function Revenue() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRevenue();
  }, []);

  const loadRevenue = async () => {
    try {
      const response = await getRevenue();
      setData(response.data.data);
    } catch (error) {
      console.error('Error loading revenue:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="revenue-dashboard">
      <h1>Revenue Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="amount">${data?.totalRevenue || 0}</p>
        </div>
        
        <div className="stat-card">
          <h3>Monthly Revenue</h3>
          <p className="amount">${data?.monthlyRevenue || 0}</p>
        </div>
        
        <div className="stat-card">
          <h3>Active Subscriptions</h3>
          <p className="count">{data?.activeSubscriptions || 0}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Schools</h3>
          <p className="count">{data?.schoolStats?.total || 0}</p>
        </div>
      </div>

      <div className="recent-subscriptions">
        <h2>Recent Subscriptions</h2>
        <table>
          <thead>
            <tr>
              <th>School</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.recentSubscriptions?.map(sub => (
              <tr key={sub._id}>
                <td>{sub.schoolId?.name}</td>
                <td>{sub.plan}</td>
                <td>${sub.amount}</td>
                <td>{sub.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

### Step 3: Create Subscriptions Page

```javascript
// src/pages/Subscriptions.jsx
import { useState, useEffect } from 'react';
import { getSubscriptions, createSubscription, getSchools } from '../services/api';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [schools, setSchools] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    schoolId: '',
    plan: 'basic',
    amount: 0,
    endDate: '',
    maxStudents: 100,
    maxTeachers: 10
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subsRes, schoolsRes] = await Promise.all([
        getSubscriptions(),
        getSchools()
      ]);
      setSubscriptions(subsRes.data.data);
      setSchools(schoolsRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSubscription(formData);
      setShowForm(false);
      loadData();
      alert('Subscription created successfully');
    } catch (error) {
      alert('Error creating subscription');
    }
  };

  return (
    <div className="subscriptions">
      <div className="header">
        <h1>Subscriptions</h1>
        <button onClick={() => setShowForm(true)}>Create Subscription</button>
      </div>

      {showForm && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <h2>Create Subscription</h2>
            
            <select 
              value={formData.schoolId}
              onChange={e => setFormData({...formData, schoolId: e.target.value})}
              required
            >
              <option value="">Select School</option>
              {schools.map(school => (
                <option key={school._id} value={school._id}>
                  {school.name}
                </option>
              ))}
            </select>

            <select
              value={formData.plan}
              onChange={e => setFormData({...formData, plan: e.target.value})}
            >
              <option value="trial">Trial</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
              required
            />

            <input
              type="date"
              value={formData.endDate}
              onChange={e => setFormData({...formData, endDate: e.target.value})}
              required
            />

            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>School</th>
            <th>Plan</th>
            <th>Amount</th>
            <th>Status</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map(sub => (
            <tr key={sub._id}>
              <td>{sub.schoolId?.name}</td>
              <td>{sub.plan}</td>
              <td>${sub.amount}</td>
              <td>{sub.status}</td>
              <td>{new Date(sub.endDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Step 4: Update App.jsx with Routes

```javascript
// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Schools from './pages/Schools';
import Revenue from './pages/Revenue';
import Subscriptions from './pages/Subscriptions';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/schools" element={<ProtectedRoute><Schools /></ProtectedRoute>} />
        <Route path="/revenue" element={<ProtectedRoute><Revenue /></ProtectedRoute>} />
        <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🎨 Styling Tips

```css
/* Add to index.css */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-card h3 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 14px;
}

.stat-card .amount {
  font-size: 32px;
  font-weight: bold;
  color: #2ecc71;
  margin: 0;
}

.stat-card .count {
  font-size: 32px;
  font-weight: bold;
  color: #3498db;
  margin: 0;
}
```

---

## 🧪 Testing

```bash
# 1. Login as super admin
# 2. Navigate to Revenue page
# 3. Check dashboard stats
# 4. Navigate to Subscriptions
# 5. Create a subscription
# 6. Verify it appears in the list
```

---

## 📚 API Endpoints Used

```
POST   /api/auth/login
GET    /api/schools
POST   /api/schools
DELETE /api/schools/:id
GET    /api/revenue
GET    /api/revenue/subscriptions
POST   /api/revenue/subscriptions
```

---

## ✅ Checklist

- [ ] Update api.js with new endpoints
- [ ] Create Revenue.jsx page
- [ ] Create Subscriptions.jsx page
- [ ] Update App.jsx routes
- [ ] Add navigation links
- [ ] Test all features
- [ ] Add error handling
- [ ] Add loading states

---

**Status:** Ready to implement
**Estimated Time:** 2-3 hours
