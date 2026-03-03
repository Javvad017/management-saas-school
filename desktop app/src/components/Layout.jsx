import { memo, useCallback } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavLink = memo(({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
  
  return (
    <Link
      to={to}
      className={`block px-6 py-3 transition-colors ${
        isActive
          ? 'bg-blue-50 text-primary border-r-4 border-primary'
          : 'text-gray-700 hover:bg-blue-50 hover:text-primary'
      }`}
    >
      {children}
    </Link>
  );
});

NavLink.displayName = 'NavLink';

function Layout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [navigate, logout]);

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 bg-primary text-white">
          <div className="text-3xl mb-2">🎓</div>
          <h1 className="text-xl font-bold">School Management</h1>
          <p className="text-sm opacity-90 mt-1">MongoDB Edition</p>
        </div>
        <nav className="mt-6 flex-1">
          <NavLink to="/">📊 Dashboard</NavLink>
          <NavLink to="/students">👨‍🎓 Students</NavLink>
          <NavLink to="/teachers">👨‍🏫 Teachers</NavLink>
          <NavLink to="/classes">📚 Classes</NavLink>
          <NavLink to="/attendance">✅ Attendance</NavLink>
          <NavLink to="/announcements">📢 Announcements</NavLink>
        </nav>
        <div className="p-6 border-t">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default memo(Layout);
