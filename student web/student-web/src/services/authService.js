import api from '../config/api'

const authService = {
  login: async (email, password, role) => {
    const response = await api.post('/auth/login', { email, password, role })
    return response.data
  },
  
  logout: () => {
    localStorage.removeItem('user')
  },
}

export default authService
