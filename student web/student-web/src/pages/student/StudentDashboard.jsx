import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import api from '../../config/api'

const StudentDashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [studentData, setStudentData] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [stats, setStats] = useState({ present: 0, absent: 0, percentage: 0 })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      const [studentRes, announcementsRes] = await Promise.all([
        api.get(`/students/${user.linkedStudentId}`),
        api.get('/announcements')
      ])
      
      setStudentData(studentRes.data)
      setAnnouncements(announcementsRes.data.slice(0, 3))
      
      if (studentRes.data.attendance) {
        const present = studentRes.data.attendance.filter(a => a.status === 'Present').length
        const absent = studentRes.data.attendance.filter(a => a.status === 'Absent').length
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
          <h1 className="text-3xl font-bold mb-2">Welcome back, {studentData?.name || user.name}! 👋</h1>
          <p className="text-blue-100">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Present</p>
                <p className="text-3xl font-bold text-green-600">✅ {stats.present}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Absent</p>
                <p className="text-3xl font-bold text-red-600">❌ {stats.absent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Attendance %</p>
                <p className="text-3xl font-bold text-blue-600">📊 {stats.percentage}%</p>
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

export default StudentDashboard
