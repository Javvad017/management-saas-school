import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import api from '../../config/api'

const ParentAnnouncements = () => {
  const [loading, setLoading] = useState(true)
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const response = await api.get('/announcements')
      setAnnouncements(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching announcements:', error)
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">School Announcements 📢</h1>

        {announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((announcement) => (
              <div key={announcement._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{announcement.title}</h3>
                <p className="text-gray-700 mb-3">{announcement.message}</p>
                <p className="text-sm text-gray-500">{formatDate(announcement.createdAt)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Announcements</h3>
            <p className="text-gray-600">No announcements yet</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ParentAnnouncements
