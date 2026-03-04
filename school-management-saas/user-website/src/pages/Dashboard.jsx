import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import studentAPI from '../services/studentAPI';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching dashboard data...');

      // Fetch profile and stats in parallel
      const [profileData, statsData] = await Promise.all([
        studentAPI.getMyProfile(),
        studentAPI.getDashboardStats()
      ]);

      console.log('Profile received:', profileData);
      console.log('Stats received:', statsData);

      setProfile(profileData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div style={{ 
            padding: '20px', 
            background: '#f8d7da', 
            color: '#721c24', 
            borderRadius: '4px' 
          }}>
            <p>{error}</p>
            <button onClick={fetchDashboardData} className="btn btn-primary" style={{ marginTop: '10px' }}>
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 style={{ marginBottom: '20px' }}>
          Welcome, {profile?.name || 'Student'}!
        </h2>

        {profile && (
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3>My Profile</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
              <div>
                <strong>Name:</strong> {profile.name}
              </div>
              <div>
                <strong>Email:</strong> {profile.email}
              </div>
              <div>
                <strong>Role:</strong> {profile.role}
              </div>
              <div>
                <strong>Status:</strong> {profile.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        )}
        
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Students</h3>
              <div className="value">{stats.totalStudents || 0}</div>
            </div>
            <div className="stat-card">
              <h3>Total Teachers</h3>
              <div className="value">{stats.totalTeachers || 0}</div>
            </div>
            <div className="stat-card">
              <h3>Present Today</h3>
              <div className="value" style={{ color: '#28a745' }}>{stats.presentToday || 0}</div>
            </div>
            <div className="stat-card">
              <h3>Absent Today</h3>
              <div className="value" style={{ color: '#dc3545' }}>{stats.absentToday || 0}</div>
            </div>
          </div>
        )}

        <div className="card">
          <h3>Quick Links</h3>
          <p>Use the navigation menu to view your attendance, fees, and exam results.</p>
          <button 
            onClick={fetchDashboardData} 
            className="btn btn-primary" 
            style={{ marginTop: '15px' }}
          >
            Refresh Data
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
