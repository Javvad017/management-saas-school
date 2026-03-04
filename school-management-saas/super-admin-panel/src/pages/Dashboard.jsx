import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { schoolAPI } from '../services/api';

function Dashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSchools: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await schoolAPI.getSchools();
      setStats({
        totalSchools: data.count || 0,
        activeSchools: data.count || 0,
        totalRevenue: 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>SuperAdmin Panel</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>{user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard">
        <aside className="sidebar">
          <Link to="/" className="sidebar-link active">Dashboard</Link>
          <Link to="/schools" className="sidebar-link">Schools</Link>
        </aside>

        <main className="content">
          <h2 style={{ marginBottom: '2rem' }}>Dashboard</h2>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Schools</h3>
              <div className="value">{stats.totalSchools}</div>
            </div>
            <div className="stat-card">
              <h3>Active Schools</h3>
              <div className="value" style={{ color: '#27ae60' }}>{stats.activeSchools}</div>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <div className="value">₹{stats.totalRevenue}</div>
            </div>
          </div>

          <div className="card">
            <h3>Quick Actions</h3>
            <p style={{ marginTop: '1rem', color: '#7f8c8d' }}>
              Manage schools, view statistics, and monitor the platform from the sidebar.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
