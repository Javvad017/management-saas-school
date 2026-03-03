import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { user } = useAuth()
  
  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/student/attendance', label: 'Attendance', icon: '📅' },
    { to: '/student/announcements', label: 'Announcements', icon: '📢' },
  ]
  
  const parentLinks = [
    { to: '/parent/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/parent/attendance', label: 'Child Attendance', icon: '📅' },
    { to: '/parent/announcements', label: 'Announcements', icon: '📢' },
  ]
  
  const links = user?.role === 'student' ? studentLinks : parentLinks

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive ? 'nav-link-active' : 'nav-link'
              }
            >
              <span className="mr-3 text-xl">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
