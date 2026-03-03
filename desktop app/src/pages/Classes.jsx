import { useState, useEffect, useCallback } from 'react';
import { classesService, teachersService } from '../services/dataStore';

function Classes() {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    className: '',
    teacherId: '',
  });

  const fetchData = useCallback(() => {
    const classesData = classesService.getAll();
    const teachersData = teachersService.getAll();
    
    // Enrich classes with teacher names
    const enrichedClasses = classesData.map(cls => {
      const teacher = teachersData.find(t => t.id === cls.teacherId);
      return {
        ...cls,
        teacherName: teacher ? teacher.name : 'N/A',
      };
    });
    
    setClasses(enrichedClasses);
    setTeachers(teachersData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    classesService.add(formData);
    setFormData({ className: '', teacherId: '' });
    setShowForm(false);
    fetchData();
  }, [formData, fetchData]);

  const handleDelete = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      classesService.delete(id);
      fetchData();
    }
  }, [fetchData]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Classes</h1>
          <p className="text-gray-600 mt-1">{classes.length} classes total</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showForm ? '❌ Cancel' : '➕ Create Class'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-lg font-bold mb-4">Create New Class</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Class Name (e.g., Grade 10-A)"
              value={formData.className}
              onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
            <select
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} - {teacher.subject}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
            >
              ✅ Create Class
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No classes found. Click "Create Class" to get started!</p>
          </div>
        ) : (
          classes.map((classItem) => (
            <div key={classItem.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl">📚</div>
                <button
                  onClick={() => handleDelete(classItem.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{classItem.className}</h3>
              <p className="text-gray-600">
                <span className="font-medium">Teacher:</span> {classItem.teacherName}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Classes;
