import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import api from '../../config/api'

const ParentAttendance = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [childData, setChildData] = useState(null)
  const [attendanceData, setAttendanceData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' },
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterData()
  }, [selectedMonth, selectedYear, attendanceData])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/students/${user.linkedStudentId}`)
      setChildData(response.data)
      setAttendanceData(response.data.attendance || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const filterData = () => {
    const filtered = attendanceData.filter(record => {
      const date = new Date(record.date)
      return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear
    })
    setFilteredData(filtered)
  }

  const getSummary = () => {
    const present = filteredData.filter(r => r.status === 'Present').length
    const absent = filteredData.filter(r => r.status === 'Absent').length
    const total = filteredData.length
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0
    return { present, absent, total, percentage }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    })
  }

  const getDayName = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { weekday: 'long' })
  }

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    )
  }

  const summary = getSummary()

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Child's Attendance 🗓️</h1>
          {childData && (
            <p className="text-gray-600 mt-2">
              {childData.name} - Class {childData.class}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-3"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-3"
              >
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Total Days</p>
            <p className="text-3xl font-bold text-blue-600">{summary.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Present</p>
            <p className="text-3xl font-bold text-green-600">{summary.present}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Absent</p>
            <p className="text-3xl font-bold text-red-600">{summary.absent}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-sm text-gray-600 mb-1">Percentage</p>
            <p className="text-3xl font-bold text-purple-600">{summary.percentage}%</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((record, index) => (
                    <tr key={index} className={record.status === 'Present' ? 'bg-green-50' : 'bg-red-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(record.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{getDayName(record.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                          record.status === 'Present' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              No attendance records found for the selected period
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default ParentAttendance
