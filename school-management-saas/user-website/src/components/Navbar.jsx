import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h1>Student Portal</h1>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
          Dashboard
        </Link>
        <Link to="/attendance" style={{ color: 'white', textDecoration: 'none' }}>
          Attendance
        </Link>
        <Link to="/fees" style={{ color: 'white', textDecoration: 'none' }}>
          Fees
        </Link>
        <Link to="/results" style={{ color: 'white', textDecoration: 'none' }}>
          Results
        </Link>
        <span>{user.name}</span>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
