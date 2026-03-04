# System Architecture

## Overview

School Management SaaS is a multi-tenant system with three main components:

1. Backend API (Node.js + Express + MongoDB)
2. User Website (React + Vite)
3. Admin Desktop (Electron.js)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
├──────────────────────────┬──────────────────────────────────┤
│   User Website (React)   │   Admin Desktop (Electron)       │
│   - Student Portal       │   - School Management            │
│   - View Attendance      │   - CRUD Operations              │
│   - View Fees            │   - Dashboard                    │
│   Port: 3000             │   Desktop Application            │
└──────────────┬───────────┴──────────────┬───────────────────┘
               │                          │
               │    HTTP/REST API         │
               │    (JWT Auth)            │
               │                          │
┌──────────────▼──────────────────────────▼───────────────────┐
│                     BACKEND API LAYER                        │
│                   (Node.js + Express)                        │
├──────────────────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Auth     │  │  Schools   │  │  Students  │            │
│  │ Controller │  │ Controller │  │ Controller │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Teachers  │  │ Attendance │  │    Fees    │            │
│  │ Controller │  │ Controller │  │ Controller │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│                                                              │
│  ┌──────────────────────────────────────────────┐          │
│  │           Middleware Layer                    │          │
│  │  - JWT Authentication                         │          │
│  │  - Role-based Authorization                   │          │
│  │  - Error Handler                              │          │
│  │  - CORS                                       │          │
│  └──────────────────────────────────────────────┘          │
│                                                              │
│  Port: 5000                                                  │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           │ Mongoose ODM
                           │
┌──────────────────────────▼───────────────────────────────────┐
│                    DATABASE LAYER                            │
│                      (MongoDB)                               │
├──────────────────────────────────────────────────────────────┤
│  Collections:                                                │
│  - users         (Authentication & User Management)          │
│  - schools       (School Information)                        │
│  - students      (Student Profiles)                          │
│  - teachers      (Teacher Profiles)                          │
│  - attendance    (Attendance Records)                        │
│  - fees          (Fee Records)                               │
│                                                              │
│  Port: 27017                                                 │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow

```
1. User enters credentials
   ↓
2. Frontend sends POST /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Backend generates JWT token
   ↓
5. Frontend stores token in localStorage
   ↓
6. Frontend includes token in Authorization header for all requests
   ↓
7. Backend middleware validates token
   ↓
8. Request proceeds to controller
```

### Multi-Tenant Architecture

```
SuperAdmin
  ├── School 1 (schoolId: xxx)
  │   ├── SchoolAdmin
  │   ├── Teachers
  │   └── Students
  │
  ├── School 2 (schoolId: yyy)
  │   ├── SchoolAdmin
  │   ├── Teachers
  │   └── Students
  │
  └── School N (schoolId: zzz)
      ├── SchoolAdmin
      ├── Teachers
      └── Students
```

Every entity (except SuperAdmin) has a `schoolId` field that ensures data isolation.

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['SuperAdmin', 'SchoolAdmin', 'Teacher', 'Student'],
  schoolId: ObjectId (ref: School),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### School Model
```javascript
{
  _id: ObjectId,
  name: String,
  address: String,
  phone: String,
  email: String (unique),
  adminId: ObjectId (ref: User),
  isActive: Boolean,
  subscriptionStatus: Enum ['trial', 'active', 'suspended', 'cancelled'],
  createdAt: Date,
  updatedAt: Date
}
```

### Student Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  schoolId: ObjectId (ref: School),
  rollNumber: String,
  class: String,
  section: String,
  dateOfBirth: Date,
  parentName: String,
  parentPhone: String,
  address: String,
  admissionDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Teacher Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  schoolId: ObjectId (ref: School),
  employeeId: String,
  subject: String,
  qualification: String,
  phone: String,
  address: String,
  joiningDate: Date,
  salary: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Model
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: Student),
  schoolId: ObjectId (ref: School),
  date: Date,
  status: Enum ['Present', 'Absent', 'Late', 'Excused'],
  markedBy: ObjectId (ref: User),
  remarks: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Fee Model
```javascript
{
  _id: ObjectId,
  studentId: ObjectId (ref: Student),
  schoolId: ObjectId (ref: School),
  amount: Number,
  dueDate: Date,
  paidAmount: Number,
  status: Enum ['Paid', 'Pending', 'Overdue'],
  paymentDate: Date,
  feeType: Enum ['Tuition', 'Transport', 'Library', 'Lab', 'Other'],
  month: String,
  year: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Architecture

### Authentication
- JWT (JSON Web Tokens) for stateless authentication
- Tokens stored in localStorage (frontend)
- Token expiry: 7 days (configurable)
- Password hashing with bcrypt (10 salt rounds)

### Authorization
- Role-based access control (RBAC)
- Middleware checks user role before allowing access
- School-level data isolation via schoolId

### API Security
- CORS enabled for specific origins
- Input validation on all endpoints
- Error messages don't expose sensitive information
- MongoDB injection prevention via Mongoose

## Scalability Considerations

### Current Architecture
- Single MongoDB instance
- Single Node.js server
- Suitable for: 1-50 schools, <10,000 users

### Future Scaling Options

1. **Database Scaling**
   - MongoDB Replica Sets for high availability
   - Sharding by schoolId for horizontal scaling
   - Read replicas for read-heavy operations

2. **Application Scaling**
   - Load balancer (Nginx/HAProxy)
   - Multiple Node.js instances
   - PM2 cluster mode
   - Redis for session management

3. **Caching Layer**
   - Redis for frequently accessed data
   - Cache dashboard statistics
   - Cache user sessions

4. **Microservices (Future)**
   ```
   - Auth Service
   - School Management Service
   - Student Management Service
   - Attendance Service
   - Fee Management Service
   - Notification Service
   ```

## Technology Choices

### Why Node.js + Express?
- JavaScript full-stack (same language frontend/backend)
- Large ecosystem (npm packages)
- Good for I/O-heavy operations
- Easy to learn and maintain

### Why MongoDB?
- Flexible schema (easy to add new fields)
- JSON-like documents (natural fit with JavaScript)
- Good for rapid development
- Horizontal scaling capabilities

### Why React?
- Component-based architecture
- Large community and ecosystem
- Virtual DOM for performance
- Easy state management

### Why Electron?
- Cross-platform desktop apps
- Web technologies (HTML/CSS/JS)
- Native OS integration
- Single codebase for Windows/Mac/Linux

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer                        │
│                      (Nginx)                            │
│                   SSL Termination                       │
└────────────┬────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼───┐
│ Node 1 │      │ Node 2 │  (PM2 Cluster)
└───┬────┘      └────┬───┘
    │                │
    └────────┬───────┘
             │
    ┌────────▼────────┐
    │  MongoDB Cluster│
    │  (Replica Set)  │
    └─────────────────┘
```

## API Design Principles

1. **RESTful**: Standard HTTP methods (GET, POST, PUT, DELETE)
2. **Consistent**: All responses follow same structure
3. **Versioned**: Ready for /api/v1, /api/v2
4. **Documented**: Clear endpoint documentation
5. **Error Handling**: Centralized error responses

## Future Enhancements

1. Real-time notifications (Socket.io)
2. File uploads (student photos, documents)
3. Email notifications (Nodemailer)
4. SMS notifications (Twilio)
5. Payment gateway integration
6. Report generation (PDF)
7. Mobile apps (React Native)
8. Analytics dashboard
9. Backup and restore functionality
10. Audit logs
