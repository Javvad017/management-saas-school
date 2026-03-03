# School Management System - Desktop Application

A desktop application built with Electron, React, Tailwind CSS, and Firebase for managing school operations.

## Features

- **Authentication**: Admin login with Firebase Auth
- **Dashboard**: Overview of students, teachers, and classes
- **Student Management**: Add, view, and delete students
- **Teacher Management**: Add, view, and delete teachers
- **Class Management**: Create classes and assign teachers
- **Attendance**: Mark and save student attendance
- **Announcements**: Post announcements for the school

## Tech Stack

- Electron (Desktop shell)
- React (UI framework)
- Tailwind CSS (Styling)
- Firebase (Backend - Firestore + Auth)
- Vite (Build tool)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firebase Authentication (Email/Password)
3. Create a Firestore Database
4. Copy your Firebase config
5. Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Create Admin User

In Firebase Console:
1. Go to Authentication
2. Add a new user with email and password
3. Use these credentials to login to the app

### 4. Run the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Firestore Collections Structure

### students
```json
{
  "name": "string",
  "class": "string",
  "parentName": "string",
  "contact": "string",
  "email": "string"
}
```

### teachers
```json
{
  "name": "string",
  "subject": "string",
  "contact": "string",
  "email": "string"
}
```

### classes
```json
{
  "className": "string",
  "teacherId": "string"
}
```

### attendance
```json
{
  "date": "string",
  "classId": "string",
  "attendance": {
    "studentId": "present|absent"
  },
  "timestamp": "timestamp"
}
```

### announcements
```json
{
  "title": "string",
  "message": "string",
  "timestamp": "timestamp"
}
```

## Project Structure

```
├── electron/           # Electron main process
│   └── main.js
├── src/
│   ├── components/     # React components
│   │   └── Layout.jsx
│   ├── pages/          # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Students.jsx
│   │   ├── Teachers.jsx
│   │   ├── Classes.jsx
│   │   ├── Attendance.jsx
│   │   └── Announcements.jsx
│   ├── App.jsx         # Main app component
│   ├── firebase.js     # Firebase configuration
│   ├── main.jsx        # React entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Usage

1. Login with your admin credentials
2. Navigate through the sidebar to access different features
3. Add students, teachers, and classes
4. Mark attendance for students
5. Post announcements that can be read by the Android app

## Notes

- The app uses Firebase SDK v9 (modular)
- All data is stored in Firestore
- The Android app can read announcements from the same Firebase project
- Make sure to set up proper Firestore security rules in production
