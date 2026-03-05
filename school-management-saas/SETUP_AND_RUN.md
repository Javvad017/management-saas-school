# 🚀 Setup & Run Guide

Complete guide to set up and run the School Management SaaS platform locally.

---

## Prerequisites

| Tool       | Version  | Download |
|------------|----------|----------|
| Node.js    | v18+     | https://nodejs.org |
| MongoDB    | v6+      | https://www.mongodb.com/try/download/community |
| Git        | Latest   | https://git-scm.com |

> Make sure MongoDB is running locally on `mongodb://localhost:27017` before starting.

---

## 📁 Project Structure

```
school-management-saas/
├── backend/             → Node.js + Express REST API
├── admin-desktop/       → Electron desktop app (School Admin)
├── user-website/        → Student portal (HTML + JS)
├── super-admin-panel/   → Super Admin web panel
├── teacher-portal/      → Teacher portal
└── shared/              → Shared utilities
```

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/Javvad017/management-saas-school.git
cd management-saas-school
```

---

## Step 2 — Backend Setup

### 2.1 Install dependencies

```bash
cd backend
npm install
```

### 2.2 Create environment file

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/school-management
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d
```

### 2.3 Start the backend server

```bash
# Development mode (auto-restart on changes)
npm run dev

# OR production mode
npm start
```

**Expected output:**
```
Server running in development mode on port 5000
MongoDB Connected: localhost
✅ Auto-created Super Admin account
   Email: superadmin@example.com
   Password: admin123
```

### 2.4 Verify server is running

Open browser or run:
```
http://localhost:5000/api/health
```
Expected: `{ "success": true, "message": "Server is running" }`

---

## Step 3 — Admin Desktop App (Electron)

```bash
cd admin-desktop
npm install
npm run dev
```

This opens the Electron admin desktop application.

**Login credentials:**

| Role         | Email                     | Password  |
|--------------|---------------------------|-----------|
| Super Admin  | superadmin@example.com    | admin123  |

> After login, create a School first, then create a SchoolAdmin user for that school.

---

## Step 4 — Student Portal (User Website)

The student portal is a static HTML site. You can open it directly or serve it:

**Option A — Open directly:**
```
Open user-website/login.html in your browser
```

**Option B — Use a local server:**
```bash
cd user-website
npx serve .
```

**Login:** Use student credentials created through the Admin panel.

---

## Step 5 — Super Admin Panel

```bash
cd super-admin-panel
```
Open `index.html` in your browser or use a local server.

**Login:** `superadmin@example.com` / `admin123`

---

## 🔑 Default Accounts

The backend auto-creates a Super Admin on first run:

| Role        | Email                    | Password  |
|-------------|--------------------------|-----------|
| Super Admin | superadmin@example.com   | admin123  |

**To create more users via CLI:**

```bash
cd backend

# Create a School Admin
npm run create-school-admin

# List all users
npm run list-users

# Reset a password
npm run reset-password
```

---

## 🗃️ API Endpoints Quick Reference

**Base URL:** `http://localhost:5000/api`

| Category      | Endpoint                | Method | Auth Required |
|---------------|------------------------|--------|---------------|
| Health        | `/health`              | GET    | No            |
| Auth          | `/auth/login`          | POST   | No            |
| Auth          | `/auth/register`       | POST   | No            |
| Students      | `/students`            | GET    | Yes           |
| Students      | `/students`            | POST   | Yes (Admin)   |
| Teachers      | `/teachers`            | GET    | Yes           |
| Teachers      | `/teachers`            | POST   | Yes (Admin)   |
| Attendance    | `/attendance`          | GET    | Yes           |
| Attendance    | `/attendance/mark`     | POST   | Yes (Admin/Teacher) |
| Fees          | `/fees`                | GET    | Yes           |
| Fees          | `/fees/:id/pay`        | PUT    | Yes (Admin)   |
| Exams         | `/exams`               | GET    | Yes           |
| Dashboard     | `/dashboard/stats`     | GET    | Yes           |
| Announcements | `/announcements`       | GET    | Yes           |
| Homework      | `/homework`            | GET    | Yes           |
| Student Portal| `/student-portal/*`    | GET    | Yes (Student) |

**Auth header format:**
```
Authorization: Bearer <token>
```

---

## 🛑 Common Issues

### MongoDB not connecting
- Ensure MongoDB is running: `mongosh` or check Windows Services for "MongoDB"
- Verify your `.env` file has the correct `MONGODB_URI`

### Port 5000 already in use
- Change `PORT` in `.env` to another port (e.g., `5001`)
- Update API URLs in frontend files accordingly

### Electron app won't start
- Make sure you ran `npm install` in the `admin-desktop/` folder
- Ensure the backend is running first on port 5000

### CORS errors in browser
- The backend allows all origins in development mode
- Make sure you're hitting `http://localhost:5000` not `127.0.0.1`

### Login fails
- Verify the backend is running
- Check the console for auto-created Super Admin credentials
- Try: `npm run list-users` in the backend folder to see existing users

---

## 🔄 Development Workflow

1. Start MongoDB
2. Start backend: `cd backend && npm run dev`
3. Start your desired frontend:
   - **Admin Desktop:** `cd admin-desktop && npm run dev`
   - **Student Portal:** Open `user-website/login.html`
   - **Super Admin:** Open `super-admin-panel/index.html`

> **Tip:** The backend must always be running first before opening any frontend.
