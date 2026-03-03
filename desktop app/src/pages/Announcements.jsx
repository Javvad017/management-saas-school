import { useState, useEffect, useCallback } from 'react';
import { announcementsService } from '../services/dataStore';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
  });

  const fetchAnnouncements = useCallback(() => {
    const data = announcementsService.getAll();
    setAnnouncements(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    announcementsService.add(formData);
    setFormData({ title: '', message: '' });
    setShowForm(false);
    fetchAnnouncements();
  }, [formData, fetchAnnouncements]);

  const handleDelete = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      announcementsService.delete(id);
      fetchAnnouncements();
    }
  }, [fetchAnnouncements]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Announcements</h1>
          <p className="text-gray-600 mt-1">{announcements.length} announcements</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showForm ? '❌ Cancel' : '📢 New Announcement'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h3 className="text-lg font-bold mb-4">Create Announcement</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Announcement Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              required
            />
            <textarea
              placeholder="Announcement Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg h-32 focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
            >
              📢 Post Announcement
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center text-gray-500">
            No announcements yet. Click "New Announcement" to create one!
          </div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-gray-800">{announcement.title}</h3>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </div>
              <p className="text-gray-600 mb-3 whitespace-pre-wrap">{announcement.message}</p>
              <p className="text-sm text-gray-400">
                📅 {formatDate(announcement.timestamp)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Announcements;
