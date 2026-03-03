import api from '../config/api'

const attendanceService = {
  getAttendanceByClass: async (classId, date) => {
    const response = await api.get(`/attendance/${classId}/${date}`)
    return response.data
  },
}

export default attendanceService
