# Real-Time Data Consistency Architecture

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    SINGLE SOURCE OF TRUTH                    │
│                      MongoDB Database                        │
│                                                              │
│  Collections: users, schools, students, teachers,           │
│               attendance, fees, exams, results              │
└──────────────────┬───────────────────────────────────────────┘
                   │
                   │ Mongoose ODM
                   │
┌──────────────────▼───────────────────────────────────────────┐
│                    Backend API (Node.js + Express)           │
│                    Port: 5000                                │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  REST API Endpoints                                 │    │
│  │  - JWT Authentication                               │    │
│  │  - Role-based Authorization                         │    │
│  │  - Multi-tenant Filtering (schoolId)                │    │
│  │  - CRUD Operations                                  │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────┬───────────────────┬───────────────────────┘
                   │                   │
                   │                   │
        ┌──────────▼────────┐   ┌─────▼──────────┐
        │  Admin Desktop    │   │  User Website  │
        │  (Electron)       │   │  (React)       │
        │                   │   │  Port: 5173    │
        │  - Axios calls    │   │                │
        │  - JWT token      │   │  - Axios calls │
        │  - CRUD UI        │   │  - JWT token   │
        │  - Real-time      │   │  - Read-only   │
        │    updates        │   │  - Auto-refresh│
        └───────────────────┘   └────────────────┘
```

## 🔄 Data Flow

### Admin Creates Student
```
1. Admin Desktop → POST /api/students → Backend API
2. Backend validates JWT token
3. Backend checks role (SchoolAdmin)
4. Backend creates User + Student in MongoDB
5. Backend returns created student
6. Admin Desktop updates UI
7. User Website fetches fresh data on next load
```

### Student Views Attendance
```
1. User Website → GET /api/attendance?studentId=xxx → Backend API
2. Backend validates JWT token
3. Backend filters by schoolId automatically
4. Backend queries MongoDB
5. Backend returns attendance records
6. User Website displays data
```

---

## ✅ Implementation Principles

### 1. Single Source of Truth
- ❌ NO local storage of business data
- ❌ NO mock/hardcoded data
- ✅ ALL data from MongoDB via API
- ✅ Real-time queries on every request

### 2. Multi-Tenant Isolation
- ✅ Every query filtered by schoolId
- ✅ Users can only access their school's data
- ✅ Automatic filtering in middleware

### 3. Authentication Flow
- ✅ JWT token in localStorage
- ✅ Token sent in Authorization header
- ✅ Token includes userId, role, schoolId
- ✅ Backend validates on every request

### 4. Data Freshness
- ✅ Fetch data on component mount
- ✅ Refetch after mutations
- ✅ No stale data caching
- ✅ Loading states during fetch

---

## 📋 API Contract

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "_id": "65f123...",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "Student",
    "schoolId": "65f456...",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Student Endpoints

#### Get All Students (Admin)
```http
GET /api/students
Authorization: Bearer TOKEN

Response:
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "65f123...",
      "userId": {
        "name": "John Doe",
        "email": "john@student.com"
      },
      "rollNumber": "2024001",
      "class": "10",
      "section": "A",
      "parentName": "Mr. Doe",
      "parentPhone": "9876543210"
    }
  ]
}
```

#### Get Single Student (Student/Admin)
```http
GET /api/students/:id
Authorization: Bearer TOKEN

Response:
{
  "success": true,
  "data": {
    "_id": "65f123...",
    "userId": {
      "name": "John Doe",
      "email": "john@student.com"
    },
    "rollNumber": "2024001",
    "class": "10",
    "section": "A",
    "dateOfBirth": "2010-05-15",
    "parentName": "Mr. Doe",
    "parentPhone": "9876543210",
    "address": "123 Street"
  }
}
```

### Attendance Endpoints

#### Get Student Attendance (Student)
```http
GET /api/attendance?studentId=65f123...&startDate=2024-03-01&endDate=2024-03-31
Authorization: Bearer TOKEN

Response:
{
  "success": true,
  "count": 20,
  "data": [
    {
      "_id": "65fabc...",
      "date": "2024-03-04",
      "status": "Present",
      "remarks": "On time"
    }
  ]
}
```

#### Get Attendance Percentage (Student)
```http
GET /api/attendance/percentage/:studentId?startDate=2024-03-01&endDate=2024-03-31
Authorization: Bearer TOKEN

Response:
{
  "success": true,
  "data": {
    "totalDays": 20,
    "presentDays": 18,
    "absentDays": 2,
    "percentage": 90.00
  }
}
```

### Fee Endpoints

#### Get Student Fees (Student)
```http
GET /api/fees?studentId=65f123...
Authorization: Bearer TOKEN

Response:
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "65fdef...",
      "amount": 5000,
      "paidAmount": 2000,
      "status": "Pending",
      "feeType": "Tuition",
      "month": "March",
      "year": 2024,
      "dueDate": "2024-04-01"
    }
  ]
}
```

#### Get Fee Summary (Student)
```http
GET /api/fees/summary/:studentId
Authorization: Bearer TOKEN

Response:
{
  "success": true,
  "data": {
    "totalAmount": 15000,
    "totalPaid": 10000,
    "totalDue": 5000,
    "paidCount": 2,
    "pendingCount": 1,
    "overdueCount": 0
  }
}
```

### Exam & Results Endpoints

#### Get Student Results (Student)
```http
GET /api/exams/results/student/:studentId
Authorization: Bearer TOKEN

Response:
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "65fjkl...",
      "examId": {
        "examName": "Mid Term Exam",
        "examDate": "2024-04-15",
        "class": "10"
      },
      "marks": [
        {
          "subject": "Mathematics",
          "marksObtained": 85,
          "totalMarks": 100
        }
      ],
      "totalMarksObtained": 253,
      "totalMarks": 300,
      "percentage": 84.33,
      "grade": "A"
    }
  ]
}
```

---

## 🔐 Authentication Implementation

### Backend: JWT Middleware
```javascript
// middlewares/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'User not found or inactive'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};
```

### Frontend: Axios Configuration
```javascript
// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 📊 Data Fetching Patterns

### Pattern 1: Fetch on Mount
```javascript
// React Component
import { useState, useEffect } from 'react';
import api from '../services/api';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      const { data } = await api.get(`/students/${user._id}`);
      setStudent(data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Welcome, {student.userId.name}</h1>
      {/* Display student data */}
    </div>
  );
};
```

### Pattern 2: Fetch with Filters
```javascript
const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '2024-03-01',
    endDate: '2024-03-31'
  });

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  const fetchAttendance = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const { data } = await api.get('/attendance', {
        params: {
          studentId: user._id,
          startDate: filters.startDate,
          endDate: filters.endDate
        }
      });
      setAttendance(data.data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  return (
    <div>
      {/* Date filters */}
      {/* Attendance list */}
    </div>
  );
};
```

### Pattern 3: Refetch After Mutation (Admin)
```javascript
const StudentManagement = () => {
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    const { data } = await api.get('/students');
    setStudents(data.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreateStudent = async (studentData) => {
    try {
      await api.post('/students', studentData);
      // Refetch to get fresh data
      await fetchStudents();
      alert('Student created successfully');
    } catch (err) {
      alert('Error creating student');
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      // Refetch to get fresh data
      await fetchStudents();
      alert('Student deleted successfully');
    } catch (err) {
      alert('Error deleting student');
    }
  };

  return (
    <div>
      {/* Student list and CRUD UI */}
    </div>
  );
};
```

---

## 🚫 Anti-Patterns to Avoid

### ❌ DON'T: Store Business Data in localStorage
```javascript
// BAD
localStorage.setItem('students', JSON.stringify(students));
const students = JSON.parse(localStorage.getItem('students'));
```

### ✅ DO: Fetch from API
```javascript
// GOOD
const { data } = await api.get('/students');
setStudents(data.data);
```

### ❌ DON'T: Use Mock Data
```javascript
// BAD
const mockStudents = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
];
```

### ✅ DO: Fetch Real Data
```javascript
// GOOD
const fetchStudents = async () => {
  const { data } = await api.get('/students');
  return data.data;
};
```

### ❌ DON'T: Cache Data Indefinitely
```javascript
// BAD
if (students.length > 0) {
  return; // Don't fetch if we have data
}
```

### ✅ DO: Fetch Fresh Data
```javascript
// GOOD
useEffect(() => {
  fetchStudents(); // Always fetch on mount
}, []);
```

---

## 🔄 Real-Time Updates Strategy

### Option 1: Polling (Simple)
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    fetchData();
  }, 30000); // Refresh every 30 seconds

  return () => clearInterval(interval);
}, []);
```

### Option 2: Refetch on Focus
```javascript
useEffect(() => {
  const handleFocus = () => {
    fetchData();
  };

  window.addEventListener('focus', handleFocus);
  return () => window.removeEventListener('focus', handleFocus);
}, []);
```

### Option 3: Manual Refresh Button
```javascript
const handleRefresh = async () => {
  setRefreshing(true);
  await fetchData();
  setRefreshing(false);
};

return (
  <button onClick={handleRefresh} disabled={refreshing}>
    {refreshing ? 'Refreshing...' : 'Refresh'}
  </button>
);
```

---

## 📝 Complete Example: Student Dashboard

### Backend Route
```javascript
// routes/studentRoutes.js
router.get('/me', protect, async (req, res) => {
  try {
    const student = await Student.findOne({
      userId: req.user.id,
      schoolId: req.user.schoolId
    }).populate('userId', 'name email');

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student profile not found'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});
```

### Frontend Component
```javascript
// pages/StudentDashboard.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [fees, setFees] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));

      // Fetch all data in parallel
      const [profileRes, attendanceRes, feesRes, resultsRes] = await Promise.all([
        api.get('/students/me'),
        api.get(`/attendance/percentage/${user._id}?startDate=2024-01-01&endDate=2024-12-31`),
        api.get(`/fees/summary/${user._id}`),
        api.get(`/exams/results/student/${user._id}`)
      ]);

      setProfile(profileRes.data.data);
      setAttendance(attendanceRes.data.data);
      setFees(feesRes.data.data);
      setResults(resultsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {profile.userId.name}</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Attendance</h3>
          <p>{attendance.percentage}%</p>
        </div>
        
        <div className="stat-card">
          <h3>Pending Fees</h3>
          <p>₹{fees.totalDue}</p>
        </div>
        
        <div className="stat-card">
          <h3>Exams Taken</h3>
          <p>{results.length}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
```

---

## ✅ Checklist

### Backend
- [x] All routes protected with JWT
- [x] All queries filter by schoolId
- [x] No hardcoded data
- [x] Proper error handling
- [x] Role-based authorization

### Frontend (Admin)
- [x] Axios configured with interceptors
- [x] Token stored in localStorage
- [x] Fetch data on mount
- [x] Refetch after mutations
- [x] No mock data

### Frontend (User)
- [x] Axios configured with interceptors
- [x] Token stored in localStorage
- [x] Fetch data on mount
- [x] Auto-refresh on focus
- [x] No local data storage

---

**Real-time data consistency achieved! 🎉**
