import { Link, useNavigate } from 'react-router-dom';

function Dashboard({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>Teacher Portal</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>{user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard">
        <aside className="sidebar">
          <Link to="/" className="sidebar-link active">Dashboard</Link>
          <Link to="/attendance" className="sidebar-link">Mark Attendance</Link>
          <Link to="/marks" className="sidebar-link">Enter Marks</Link>
        </aside>

        <main className="content">
          <h2 style={{ marginBottom: '2rem' }}>Welcome, {user.name}</h2>

          <div className="card">
            <h3>Quick Actions</h3>
            <p style={{ marginTop: '1rem', color: '#7f8c8d' }}>
              Use the sidebar to mark attendance or enter exam marks for students.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
