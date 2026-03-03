import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import api from '../../config/api'

const ParentDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [childData, setChildData] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [stats, setStats] = useState({ present: 0, absent: 0, percentage: 0 })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const [childRes, announcementsRes] = await Promise.all([
        api.get(`/students/${user.linkedStudentId}`),
        api.get('/announcements')
      ])
      
      setChildData(childRes.data)
      setAnnouncements(announcementsRes.data.slice(0, 3))
      
      if (childRes.data.attendance) {
        const present = childRes.data.attendance.filter(a => a.status === 'Present').length
        const absent = childRes.data.attendance.filter(a => a.status === 'Absent').length
        const total = present + absent
        const percentage = total > 0 ? Math.round((present / total) * 100) : 0
        setStats({ present, absent, percentage })
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}! 👋</h1>
          <p className="text-blue-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Child Information 👶</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-lg font-medium">{childData?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="text-lg font-medium">{childData?.class || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Roll Number</p>
                <p className="text-lg font-medium">{childData?.rollNumber || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary 📊</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Present</span>
                <span className="text-2xl font-bold text-green-600">{stats.present}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Absent</span>
                <span className="text-2xl font-bold text-red-600">{stats.absent}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-gray-600">Percentage</span>
                <span className="text-2xl font-bold text-blue-600">{stats.percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Announcements 📢</h2>
          {announcements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <div key={announcement._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{announcement.title}</h3>
                  <p className="text-gray-700 mb-3">{announcement.message}</p>
                  <p className="text-sm text-gray-500">{formatDate(announcement.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
              No announcements available
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default ParentDashboard
