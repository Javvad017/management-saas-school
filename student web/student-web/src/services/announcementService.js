import api from '../config/api'

const announcementService = {
  getAllAnnouncements: async () => {
    const response = await api.get('/announcements')
    return response.data
  },
  
  getRecentAnnouncements: async (limit = 3) => {
    const response = await api.get(`/announcements?limit=${limit}`)
    return response.data
  },
}

export default announcementService
