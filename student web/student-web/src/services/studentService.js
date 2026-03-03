import api from '../config/api'

const studentService = {
  getStudentById: async (studentId) => {
    const response = await api.get(`/students/${studentId}`)
    return response.data
  },
}

export default studentService
