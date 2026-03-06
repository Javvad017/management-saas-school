import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.data || config.params);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me')
};

export const studentAPI = {
  getStudents: (params) => api.get('/students', { params })
};

export const attendanceAPI = {
  markAttendance: (data) => api.post('/attendance/mark', data),
  getAttendance: (params) => api.get('/attendance', { params })
};

export const examAPI = {
  getExams: (params) => api.get('/exams', { params }),
  addResult: (data) => api.post('/exams/results', data),
  getExamResults: (examId) => api.get(`/exams/${examId}/results`)
};

export default api;
