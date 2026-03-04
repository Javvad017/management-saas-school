import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { studentAPI, examAPI } from '../services/api';

function Marks({ user, setUser }) {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedExam, setSelectedExam] = useState('');
  const [marks, setMarks] = useState([{ subject: '', marksObtained: '', totalMarks: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsRes, examsRes] = await Promise.all([
        studentAPI.getStudents(),
        examAPI.getExams()
      ]);
      setStudents(studentsRes.data.data || []);
      setExams(examsRes.data.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  const openModal = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
    setFormError('');
    setMarks([{ subject: '', marksObtained: '', totalMarks: '' }]);
  };

  const addMarkRow = () => {
    setMarks([...marks, { subject: '', marksObtained: '', totalMarks: '' }]);
  };

  const updateMark = (index, field, value) => {
    const newMarks = [...marks];
    newMarks[index][field] = value;
    setMarks(newMarks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const resultData = {
        studentId: selectedStudent._id,
        examId: selectedExam,
        marks: marks.map(m => ({
          subject: m.subject,
          marksObtained: parseInt(m.marksObtained),
          totalMarks: parseInt(m.totalMarks)
        }))
      };

      await examAPI.addResult(resultData);
      setShowModal(false);
      alert('Marks added successfully!');
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to add marks');
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
          <Link to="/attendance" className="sidebar-link">Mark Attendance</Link>
          <Link to="/marks" className="sidebar-link active">Enter Marks</Link>
        </aside>

        <main className="content">
          <div className="card">
            <div className="card-header">
              <h2>Enter Exam Marks</h2>
            </div>

            {error && <div className="error">{error}</div>}

            {loading ? (
              <div className="loading">Loading students...</div>
            ) : students.length === 0 ? (
              <div className="empty-state">
                <p>No students found.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.rollNumber}</td>
                      <td>{student.userId?.name || 'N/A'}</td>
                      <td>{student.class} - {student.section}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => openModal(student)}
                        >
                          Add Marks
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Marks - {selectedStudent?.userId?.name}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            {formError && <div className="error">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Select Exam *</label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  required
                >
                  <option value="">-- Select Exam --</option>
                  {exams.map((exam) => (
                    <option key={exam._id} value={exam._id}>
                      {exam.examName} - {exam.class}
                    </option>
                  ))}
                </select>
              </div>

              <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Subject Marks</h4>

              {marks.map((mark, index) => (
                <div key={index} style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
                  <div className="form-group">
                    <label>Subject *</label>
                    <input
                      type="text"
                      value={mark.subject}
                      onChange={(e) => updateMark(index, 'subject', e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Marks Obtained *</label>
                      <input
                        type="number"
                        value={mark.marksObtained}
                        onChange={(e) => updateMark(index, 'marksObtained', e.target.value)}
                        required
                        min="0"
                      />
                    </div>
                    <div className="form-group">
                      <label>Total Marks *</label>
                      <input
                        type="number"
                        value={mark.totalMarks}
                        onChange={(e) => updateMark(index, 'totalMarks', e.target.value)}
                        required
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={addMarkRow}
                style={{ marginBottom: '1rem' }}
              >
                + Add Subject
              </button>

              <button type="submit" className="btn btn-success" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Marks'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marks;
