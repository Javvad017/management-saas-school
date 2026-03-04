import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { studentAPI, attendanceAPI } from '../services/api';

function Attendance({ user, setUser }) {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const { data } = await studentAPI.getStudents();
      const studentsList = data.data || [];
      setStudents(studentsList);
      
      const initialAttendance = {};
      studentsList.forEach(student => {
        initialAttendance[student._id] = 'Present';
      });
      setAttendance(initialAttendance);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance({ ...attendance, [studentId]: status });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const attendanceRecords = students.map(student => ({
        studentId: student._id,
        date: date,
        status: attendance[student._id]
      }));

      await attendanceAPI.markAttendance({ attendance: attendanceRecords });
      alert('Attendance marked successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark attendance');
    } finally {
      setSubmitting(false);
    }
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
          <Link to="/" className="sidebar-link">Dashboard</Link>
          <Link to="/attendance" className="sidebar-link active">Mark Attendance</Link>
          <Link to="/marks" className="sidebar-link">Enter Marks</Link>
        </aside>

        <main className="content">
          <div className="card">
            <div className="card-header">
              <h2>Mark Attendance</h2>
            </div>

            {error && <div className="error">{error}</div>}

            {loading ? (
              <div className="loading">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="empty-state">
                <p>No students found.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td>{student.rollNumber}</td>
                        <td>{student.userId?.name || 'N/A'}</td>
                        <td>{student.class} - {student.section}</td>
                        <td>
                          <div className="attendance-row">
                            <label>
                              <input
                                type="radio"
                                name={`attendance-${student._id}`}
                                value="Present"
                                checked={attendance[student._id] === 'Present'}
                                onChange={() => handleStatusChange(student._id, 'Present')}
                              />
                              Present
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={`attendance-${student._id}`}
                                value="Absent"
                                checked={attendance[student._id] === 'Absent'}
                                onChange={() => handleStatusChange(student._id, 'Absent')}
                              />
                              Absent
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={submitting}
                  style={{ marginTop: '1rem' }}
                >
                  {submitting ? 'Submitting...' : 'Submit Attendance'}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Attendance;
