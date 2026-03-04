import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { schoolAPI } from '../services/api';

function Schools({ user, setUser }) {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    adminName: '',
    adminEmail: '',
    adminPassword: ''
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const { data } = await schoolAPI.getSchools();
      setSchools(data.data || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      await schoolAPI.createSchool(formData);
      setShowModal(false);
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        adminName: '',
        adminEmail: '',
        adminPassword: ''
      });
      loadSchools();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to create school');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this school?')) return;

    try {
      await schoolAPI.deleteSchool(id);
      loadSchools();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete school');
    }
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
          <Link to="/" className="sidebar-link">Dashboard</Link>
          <Link to="/schools" className="sidebar-link active">Schools</Link>
        </aside>

        <main className="content">
          <div className="card">
            <div className="card-header">
              <h2>Schools Management</h2>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Add School
              </button>
            </div>

            {error && <div className="error">{error}</div>}

            {loading ? (
              <div className="loading">Loading schools...</div>
            ) : schools.length === 0 ? (
              <div className="empty-state">
                <p>No schools found. Click "Add School" to create one.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>School Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Admin</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school) => (
                    <tr key={school._id}>
                      <td>{school.name}</td>
                      <td>{school.email}</td>
                      <td>{school.phone}</td>
                      <td>{school.address}</td>
                      <td>{school.adminId?.name || 'N/A'}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(school._id)}
                        >
                          Delete
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
              <h2>Add New School</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            {formError && <div className="error">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>School Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>School Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label>Admin Name *</label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Admin Email *</label>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Admin Password *</label>
                <input
                  type="password"
                  name="adminPassword"
                  value={formData.adminPassword}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create School'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Schools;
