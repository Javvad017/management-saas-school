import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentAttendance from './pages/student/StudentAttendance'
import StudentAnnouncements from './pages/student/StudentAnnouncements'
import ParentDashboard from './pages/parent/ParentDashboard'
import ParentAttendance from './pages/parent/ParentAttendance'
import ParentAnnouncements from './pages/parent/ParentAnnouncements'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
      />
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute role="student">
            <StudentAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/announcements"
        element={
          <ProtectedRoute role="student">
            <StudentAnnouncements />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/parent/dashboard"
        element={
          <ProtectedRoute role="parent">
            <ParentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/attendance"
        element={
          <ProtectedRoute role="parent">
            <ParentAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/announcements"
        element={
          <ProtectedRoute role="parent">
            <ParentAnnouncements />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function DashboardRedirect() {
  const { user } = useAuth()
  
  if (user.role === 'student') {
    return <Navigate to="/student/dashboard" replace />
  } else if (user.role === 'parent') {
    return <Navigate to="/parent/dashboard" replace />
  }
  
  return <Navigate to="/login" replace />
}

export default App
