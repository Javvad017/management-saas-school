const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user') || '{}');
let studentsData = [];

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
  document.getElementById('user-role').textContent = currentUser.role || 'Admin';
}

// Set today's date
document.getElementById('attendance-date').valueAsDate = new Date();

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '../index.html';
});

// Load Students
async function loadStudents(classFilter = '', sectionFilter = '') {
  const tbody = document.getElementById('students-tbody');

  try {
    console.log('Fetching students...');
    let endpoint = '/students';
    const queryParams = [];
    if (classFilter) queryParams.push(`class=${classFilter}`);
    if (sectionFilter) queryParams.push(`section=${sectionFilter}`);

    if (queryParams.length > 0) {
      endpoint += `?${queryParams.join('&')}`;
    }

    const { data } = await api.get(endpoint);
    studentsData = data.data;

    console.log(`Loaded ${studentsData.length} students`);

    if (studentsData.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="px-6 py-12 text-center">
            <div class="flex flex-col items-center justify-center">
              <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <p class="text-gray-500 font-medium mb-2">No students found</p>
              <p class="text-gray-400 text-sm">Add students to mark attendance</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = studentsData.map((student, index) => `
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            ${student.rollNumber}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
              <div class="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                ${(student.userId?.name || 'N').charAt(0).toUpperCase()}
              </div>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${student.userId?.name || 'N/A'}</div>
              <div class="text-sm text-gray-500">${student.userId?.email || ''}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="text-sm font-medium text-gray-900">${student.class}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            ${student.section}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-center">
          <div class="flex items-center justify-center space-x-4">
            <label class="inline-flex items-center cursor-pointer">
              <input type="radio" name="attendance-${index}" value="Present" data-student-id="${student._id}" checked class="w-4 h-4 text-green-600 focus:ring-green-500">
              <span class="ml-2 text-sm font-medium text-green-700">Present</span>
            </label>
            <label class="inline-flex items-center cursor-pointer">
              <input type="radio" name="attendance-${index}" value="Absent" data-student-id="${student._id}" class="w-4 h-4 text-red-600 focus:ring-red-500">
              <span class="ml-2 text-sm font-medium text-red-700">Absent</span>
            </label>
          </div>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading students:', error);
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-12 text-center">
          <div class="flex flex-col items-center justify-center">
            <svg class="w-16 h-16 text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-red-600 font-medium mb-2">Error loading students</p>
            <p class="text-gray-500 text-sm mb-4">${error.response?.data?.error || error.message}</p>
            <button onclick="loadStudents()" class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold">
              Retry
            </button>
          </div>
        </td>
      </tr>
    `;
  }
}

// Load Sections dynamically
async function loadSectionsForClass(classValue) {
  const sectionSelect = document.getElementById('section-filter');
  if (!sectionSelect) return;

  const defaultOption = '<option value="">All Sections</option>';

  if (!classValue) {
    sectionSelect.innerHTML = defaultOption;
    return;
  }

  try {
    const { data } = await api.get(`/sections?class=${classValue}`);
    const sections = data.data;

    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      sectionSelect.innerHTML = defaultOption;
      return;
    }

    sectionSelect.innerHTML = defaultOption +
      sections.map(s => `<option value="${s.name}">${s.name}</option>`).join('');

  } catch (error) {
    console.error('Error loading sections:', error);
    sectionSelect.innerHTML = defaultOption;
  }
}

// Class filter change
document.getElementById('class-filter').addEventListener('change', async (e) => {
  const classValue = e.target.value;
  document.getElementById('section-filter').value = '';
  await loadSectionsForClass(classValue);
  loadStudents(classValue, '');
});

// Section filter change
const sectionFilterEl = document.getElementById('section-filter');
if (sectionFilterEl) {
  sectionFilterEl.addEventListener('change', (e) => {
    const classValue = document.getElementById('class-filter').value;
    loadStudents(classValue, e.target.value);
  });
}

// Mark Attendance
document.getElementById('mark-attendance-btn').addEventListener('click', async () => {
  const date = document.getElementById('attendance-date').value;

  if (!date) {
    showNotification('Please select a date', 'error');
    return;
  }

  if (studentsData.length === 0) {
    showNotification('No students to mark attendance', 'error');
    return;
  }

  const attendanceRecords = [];

  // Collect attendance data
  studentsData.forEach((student, index) => {
    const radios = document.getElementsByName(`attendance-${index}`);
    let status = 'Present'; // Default

    for (const radio of radios) {
      if (radio.checked) {
        status = radio.value;
        break;
      }
    }

    // IMPORTANT: Ensure studentId is always included
    if (!student._id) {
      console.error('Student missing _id:', student);
      return;
    }

    attendanceRecords.push({
      studentId: student._id, // This is the critical field
      date: date,
      status: status
    });
  });

  // Validate all records have studentId
  const invalidRecords = attendanceRecords.filter(record => !record.studentId);
  if (invalidRecords.length > 0) {
    console.error('Invalid records found:', invalidRecords);
    showNotification('Error: Some students are missing IDs', 'error');
    return;
  }

  console.log('Submitting attendance records:', attendanceRecords);

  const markBtn = document.getElementById('mark-attendance-btn');
  markBtn.disabled = true;
  markBtn.innerHTML = '<svg class="w-5 h-5 inline mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>Marking...';

  try {
    // Submit all attendance records in one bulk request
    const response = await api.post('/attendance/mark', {
      attendance: attendanceRecords
    });

    const result = response.data;
    const successCount = result.data?.length || attendanceRecords.length;
    const errorCount = result.errors?.length || 0;

    if (errorCount > 0) {
      showNotification(`${successCount} records saved, ${errorCount} failed`, 'warning');
      console.warn('Attendance errors:', result.errors);
    } else {
      showNotification(`Attendance marked for ${successCount} students!`, 'success');
    }

    // Reload students to reset form
    await loadStudents(document.getElementById('class-filter').value);
  } catch (error) {
    console.error('Error marking attendance:', error);
    console.error('Error response:', error.response?.data);

    const errorMessage = error.response?.data?.error || error.message || 'Failed to mark attendance';
    showNotification(errorMessage, 'error');
  } finally {
    markBtn.disabled = false;
    markBtn.innerHTML = '<svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>Mark Attendance';
  }
});

// Show notification
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg text-white font-semibold z-50 transform transition-all duration-300 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Make functions globally accessible
window.loadStudents = loadStudents;

// Initial load
loadStudents();
