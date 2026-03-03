import { useState, useEffect, useCallback } from 'react';
import { teachersService } from '../services/dataStore';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    contact: '',
    email: '',
  });

  const fetchTeachers = useCallback(() => {
    const data = teachersService.getAll();
    setTeachers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    teachersService.add(formData);
    setFormData({ name: '', subject: '', contact: '', email: '' });
    setShowForm(false);
    fetchTeachers();
  }, [formData, fetchTeachers]);

  const handleDelete = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      teachersService.delete(id);
      fetchTeachers();
    }
  }, [fetchTeachers]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Teachers</h1>
          <p className="text-gray-600 mt-1">{teachers.length} teachers total</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showForm ? '❌ Cancel' : '➕ Add Teacher'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-lg font-bold mb-4">Add New Teacher</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Teacher Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="tel"
              placeholder="Contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              className="col-span-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
            >
              ✅ Add Teacher
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No teachers found. Click "Add Teacher" to get started!
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{teacher.name}</td>
                  <td className="px-6 py-4">{teacher.subject}</td>
                  <td className="px-6 py-4">{teacher.contact}</td>
                  <td className="px-6 py-4">{teacher.email}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(teacher.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Teachers;
