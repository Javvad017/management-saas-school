import { useState, useEffect } from 'react';
import { studentsAPI, teachersAPI, classesAPI } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [students, teachers, classes] = await Promise.all([
        studentsAPI.getAll(),
        teachersAPI.getAll(),
        classesAPI.getAll(),
      ]);

      setStats({
        students: students.length,
        teachers: teachers.length,
        classes: classes.length,
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Students', value: stats.students, color: 'text-blue-600', icon: '👨‍🎓', bg: 'bg-blue-50' },
    { label: 'Total Teachers', value: stats.teachers, color: 'text-green-600', icon: '👨‍🏫', bg: 'bg-green-50' },
    { label: 'Total Classes', value: stats.classes, color: 'text-purple-600', icon: '📚', bg: 'bg-purple-50' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to School Management System</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`text-4xl ${stat.bg} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
            <div className={`text-4xl font-bold ${stat.color} mt-2`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start">
          <div className="text-2xl mr-3">🗄️</div>
          <div>
            <h3 className="font-bold text-green-800 mb-1">MongoDB Database</h3>
            <p className="text-green-700 text-sm">
              All data is stored in your local MongoDB database. Fast and reliable!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
