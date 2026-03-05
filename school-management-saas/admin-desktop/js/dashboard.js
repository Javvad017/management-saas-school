const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user') || '{}');

// API Helper
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Check authentication
if (!token) {
  window.location.href = '../index.html';
}

// Display user info
if (currentUser.name) {
  document.getElementById('user-name').textContent = currentUser.name;
  document.getElementById('user-display-name').textContent = currentUser.name;
  document.getElementById('user-role').textContent = currentUser.role || 'Admin';
}

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '../index.html';
});

// Load Dashboard Data
async function loadDashboard() {
  try {
    // Load stats
    const { data: statsData } = await api.get('/dashboard/stats');
    const stats = statsData.data;

    // Update stat cards
    document.getElementById('total-students').textContent = stats.totalStudents || 0;
    document.getElementById('total-teachers').textContent = stats.totalTeachers || 0;
    
    // Calculate attendance rate
    const total = stats.presentToday + stats.absentToday;
    const rate = total > 0 ? Math.round((stats.presentToday / total) * 100) : 0;
    document.getElementById('attendance-rate').textContent = rate + '%';
    document.getElementById('present-today').textContent = stats.presentToday || 0;
    
    // Update pending fees
    document.getElementById('pending-fees').textContent = (stats.pendingFees || 0).toLocaleString();
    document.getElementById('pending-count').textContent = stats.pendingFeesCount || 0;

    // Load charts
    loadAttendanceChart();
    loadFeeChart();
    
    // Load recent activity
    loadRecentActivity();
  } catch (error) {
    console.error('Error loading dashboard:', error);
    showError('Failed to load dashboard data');
  }
}

// Load Attendance Chart
async function loadAttendanceChart() {
  const ctx = document.getElementById('attendanceChart').getContext('2d');
  
  // Sample data - replace with actual API call
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      label: 'Present',
      data: [85, 90, 88, 92, 87, 45],
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      borderColor: 'rgba(34, 197, 94, 1)',
      borderWidth: 2,
      tension: 0.4
    }, {
      label: 'Absent',
      data: [15, 10, 12, 8, 13, 5],
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      borderColor: 'rgba(239, 68, 68, 1)',
      borderWidth: 2,
      tension: 0.4
    }]
  };

  new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// Load Fee Chart
async function loadFeeChart() {
  const ctx = document.getElementById('feeChart').getContext('2d');
  
  // Sample data - replace with actual API call
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Collected',
      data: [45000, 52000, 48000, 55000, 51000, 58000],
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 1
    }, {
      label: 'Pending',
      data: [5000, 3000, 7000, 4000, 6000, 3500],
      backgroundColor: 'rgba(251, 191, 36, 0.8)',
      borderColor: 'rgba(251, 191, 36, 1)',
      borderWidth: 1
    }]
  };

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '₹' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

// Load Recent Activity
async function loadRecentActivity() {
  const container = document.getElementById('recent-activity');
  
  try {
    // Get recent students
    const { data: studentsData } = await api.get('/students?limit=5');
    const students = studentsData.data;

    if (students.length === 0) {
      container.innerHTML = '<p class="text-gray-500 text-center py-4">No recent activity</p>';
      return;
    }

    container.innerHTML = students.slice(0, 5).map(student => `
      <div class="flex items-center justify-between py-3 border-b">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">${student.userId?.name || 'Student'}</p>
            <p class="text-xs text-gray-600">Class ${student.class} - ${student.section}</p>
          </div>
        </div>
        <span class="text-xs text-gray-500">Recently added</span>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading recent activity:', error);
    container.innerHTML = '<p class="text-red-500 text-center py-4">Failed to load activity</p>';
  }
}

// Show error notification
function showError(message) {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Initialize dashboard
loadDashboard();
