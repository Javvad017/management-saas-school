import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import studentAPI from '../services/studentAPI';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchAttendance();
  }, [dateRange]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);

      const [attendanceData, statsData] = await Promise.all([
        studentAPI.getMyAttendance(dateRange.startDate, dateRange.endDate),
        studentAPI.getAttendancePercentage(dateRange.startDate, dateRange.endDate)
      ]);

      setAttendance(attendanceData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err.response?.data?.error || 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Present: 'badge-success',
      Absent: 'badge-danger',
      Late: 'badge-warning',
      Excused: 'badge-warning'
    };
    return badges[status] || '';
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2 style={{ marginBottom: '20px' }}>My Attendance</h2>

        {/* Date Range Filter */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>Filter by Date Range</h3>
          <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Attendance Statistics */}
        {stats && (
          <div className="stats-grid" style={{ marginBottom: '20px' }}>
            <div className="stat-card">
              <h3>Total Days</h3>
              <div className="value">{stats.totalDays}</div>
            </div>
            <div className="stat-card">
              <h3>Present Days</h3>
              <div className="value" style={{ color: '#28a745' }}>{stats.presentDays}</div>
            </div>
            <div className="stat-card">
              <h3>Absent Days</h3>
              <div className="value" style={{ color: '#dc3545' }}>{stats.absentDays}</div>
            </div>
            <div className="stat-card">
              <h3>Attendance %</h3>
              <div className="value" style={{ color: stats.percentage >= 75 ? '#28a745' : '#dc3545' }}>
                {stats.percentage}%
              </div>
            </div>
          </div>
        )}
        
        {/* Attendance Records */}
        <div className="card">
          {loading ? (
            <p>Loading attendance records...</p>
          ) : error ? (
            <div style={{ 
              padding: '15px', 
              background: '#f8d7da', 
              color: '#721c24', 
              borderRadius: '4px' 
            }}>
              <p>{error}</p>
              <button onClick={fetchAttendance} className="btn btn-primary" style={{ marginTop: '10px' }}>
                Retry
              </button>
            </div>
          ) : attendance.length === 0 ? (
            <p>No attendance records found for the selected date range.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>{record.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Attendance;
