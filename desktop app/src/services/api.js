import axios from 'axios';

// Use 127.0.0.1 instead of localhost for better Windows compatibility
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

console.log('API Configuration:');
console.log('Base URL:', API_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.message);
    
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('❌ Cannot connect to backend server!');
      console.error('Make sure backend is running on:', API_URL);
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log('Token invalid, redirecting to login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

// Students API
export const studentsAPI = {
  getAll: async () => {
    const response = await api.get('/students');
    return response.data;
  },
  add: async (student) => {
    const response = await api.post('/students', student);
    return response.data;
  },
  update: async (id, student) => {
    const response = await api.put(`/students/${id}`, student);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
};

// Teachers API
export const teachersAPI = {
  getAll: async () => {
    const response = await api.get('/teachers');
    return response.data;
  },
  add: async (teacher) => {
    const response = await api.post('/teachers', teacher);
    return response.data;
  },
  update: async (id, teacher) => {
    const response = await api.put(`/teachers/${id}`, teacher);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  },
};

// Classes API
export const classesAPI = {
  getAll: async () => {
    const response = await api.get('/classes');
    return response.data;
  },
  add: async (classData) => {
    const response = await api.post('/classes', classData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/classes/${id}`);
    return response.data;
  },
};

// Attendance API
export const attendanceAPI = {
  get: async (classId, date) => {
    const response = await api.get(`/attendance/${classId}/${date}`);
    return response.data;
  },
  save: async (attendanceData) => {
    const response = await api.post('/attendance', attendanceData);
    return response.data;
  },
};

// Announcements API
export const announcementsAPI = {
  getAll: async () => {
    const response = await api.get('/announcements');
    return response.data;
  },
  add: async (announcement) => {
    const response = await api.post('/announcements', announcement);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },
};

export default api;
