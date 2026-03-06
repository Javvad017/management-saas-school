const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = sessionStorage.getItem('token');
let currentUser = JSON.parse(sessionStorage.getItem('user') || '{}');
let currentView = 'students'; // 'students' or 'teachers'

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

// Tab switching
const studentsTab = document.getElementById('students-tab');
const teachersTab = document.getElementById('teachers-tab');
const studentsSection = document.getElementById('students-section');
const teachersSection = document.getElementById('teachers-section');
const addUserBtn = document.getElementById('add-user-btn');
const addBtnText = document.getElementById('add-btn-text');

studentsTab.addEventListener('click', () => {
  currentView = 'students';
  studentsTab.classList.add('active');
  studentsTab.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-100');
  teachersTab.classList.remove('active');
  teachersTab.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-100');
  studentsSection.classList.remove('hidden');
  teachersSection.classList.add('hidden');
  addBtnText.textContent = 'Add Student';
  loadStudents();
});

teachersTab.addEventListener('click', () => {
  currentView = 'teachers';
  teachersTab.classList.add('active');
  teachersTab.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-100');
  studentsTab.classList.remove('active');
  studentsTab.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-100');
  teachersSection.classList.remove('hidden');
  studentsSection.classList.add('hidden');
  addBtnText.textContent = 'Add Teacher';
  loadTeachers();
});

// Add user button
addUserBtn.addEventListener('click', () => {
  if (currentView === 'students') {
    openStudentModal();
  } else {
    openTeacherModal();
  }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  window.location.href = '../index.html';
});

// Load Students
async function loadStudents() {
  const tbody = document.getElementById('students-tbody');

  try {
    console.log('Fetching students...');
    const { data } = await api.get('/students');
    const students = data.data;

    console.log(`Loaded ${students.length} students`);

    if (students.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-12 text-center">
            <div class="flex flex-col items-center justify-center">
              <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <p class="text-gray-500 font-medium mb-2">No students found</p>
              <p class="text-gray-400 text-sm">Click "Add Student" to add your first student</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = students.map(student => `
      <tr class="transition-all duration-200">
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
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          ${student.parentPhone || 'N/A'}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
          <button onclick="viewStudent('${student._id}')" class="text-indigo-600 hover:text-indigo-900 transition">
            <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </button>
          <button onclick="deleteStudent('${student._id}')" class="text-red-600 hover:text-red-900 transition">
            <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading students:', error);
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-12 text-center">
          <div class="flex flex-col items-center justify-center">
            <svg class="w-16 h-16 text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-red-600 font-medium mb-2">Error loading students</p>
            <p class="text-gray-500 text-sm mb-4">${error.response?.data?.error || error.message}</p>
            <button onclick="loadStudents()" class="btn-gradient px-4 py-2 rounded-lg text-white font-semibold">
              Retry
            </button>
          </div>
        </td>
      </tr>
    `;
  }
}

// Load Teachers
async function loadTeachers() {
  const tbody = document.getElementById('teachers-tbody');

  try {
    console.log('Fetching teachers...');
    const { data } = await api.get('/teachers');
    const teachers = data.data;

    console.log(`Loaded ${teachers.length} teachers`);

    if (teachers.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-12 text-center">
            <div class="flex flex-col items-center justify-center">
              <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <p class="text-gray-500 font-medium mb-2">No teachers found</p>
              <p class="text-gray-400 text-sm">Click "Add Teacher" to add your first teacher</p>
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = teachers.map(teacher => `
      <tr class="transition-all duration-200">
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
            ${teacher.employeeId}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-10 w-10">
              <div class="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                ${(teacher.userId?.name || 'N').charAt(0).toUpperCase()}
              </div>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">${teacher.userId?.name || 'N/A'}</div>
              <div class="text-sm text-gray-500">${teacher.userId?.email || ''}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
            ${teacher.subject}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          ${teacher.phone || 'N/A'}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="text-sm font-semibold text-green-600">₹${teacher.salary?.toLocaleString() || '0'}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
          <button onclick="viewTeacher('${teacher._id}')" class="text-indigo-600 hover:text-indigo-900 transition">
            <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </button>
          <button onclick="deleteTeacher('${teacher._id}')" class="text-red-600 hover:text-red-900 transition">
            <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading teachers:', error);
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-12 text-center">
          <div class="flex flex-col items-center justify-center">
            <svg class="w-16 h-16 text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-red-600 font-medium mb-2">Error loading teachers</p>
            <p class="text-gray-500 text-sm mb-4">${error.response?.data?.error || error.message}</p>
            <button onclick="loadTeachers()" class="btn-gradient px-4 py-2 rounded-lg text-white font-semibold">
              Retry
            </button>
          </div>
        </td>
      </tr>
    `;
  }
}

// Student Modal Functions
const studentModal = document.getElementById('student-modal');
const studentForm = document.getElementById('student-form');
const studentError = document.getElementById('student-error');

function openStudentModal() {
  studentModal.classList.remove('hidden');
  studentModal.classList.add('flex');
  studentForm.reset();
  studentError.classList.add('hidden');
}

function closeStudentModal() {
  studentModal.classList.add('hidden');
  studentModal.classList.remove('flex');
  studentForm.reset();
}

document.getElementById('close-student-modal').addEventListener('click', closeStudentModal);
document.getElementById('cancel-student-btn').addEventListener('click', closeStudentModal);

studentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById('submit-student-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Adding...';
  studentError.classList.add('hidden');

  const studentData = {
    name: document.getElementById('student-name').value.trim(),
    email: document.getElementById('student-email').value.trim(),
    password: document.getElementById('student-password').value,
    phone: document.getElementById('student-phone').value.trim() || undefined,
    rollNumber: document.getElementById('student-roll').value.trim(),
    class: document.getElementById('student-class').value.trim(),
    section: document.getElementById('student-section').value,
    dateOfBirth: document.getElementById('student-dob').value,
    parentName: document.getElementById('student-parent-name').value.trim(),
    parentPhone: document.getElementById('student-parent-phone').value.trim(),
    address: document.getElementById('student-address').value.trim()
  };

  if (!studentData.section) {
    studentError.textContent = 'Please select a section';
    studentError.classList.remove('hidden');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Student';
    return;
  }

  try {
    await api.post('/students', studentData);
    closeStudentModal();
    await loadStudents();
    showNotification('Student added successfully!', 'success');
  } catch (error) {
    console.error('Error adding student:', error);
    studentError.textContent = error.response?.data?.error || 'Failed to add student';
    studentError.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Student';
  }
});

// Teacher Modal Functions
const teacherModal = document.getElementById('teacher-modal');
const teacherForm = document.getElementById('teacher-form');
const teacherError = document.getElementById('teacher-error');

function openTeacherModal() {
  teacherModal.classList.remove('hidden');
  teacherModal.classList.add('flex');
  teacherForm.reset();
  teacherError.classList.add('hidden');
}

function closeTeacherModal() {
  teacherModal.classList.add('hidden');
  teacherModal.classList.remove('flex');
  teacherForm.reset();
}

document.getElementById('close-teacher-modal').addEventListener('click', closeTeacherModal);
document.getElementById('cancel-teacher-btn').addEventListener('click', closeTeacherModal);

teacherForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = document.getElementById('submit-teacher-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Adding...';
  teacherError.classList.add('hidden');

  const teacherData = {
    name: document.getElementById('teacher-name').value.trim(),
    email: document.getElementById('teacher-email').value.trim(),
    password: document.getElementById('teacher-password').value,
    phone: document.getElementById('teacher-phone').value.trim(),
    employeeId: document.getElementById('teacher-employee-id').value.trim(),
    subject: document.getElementById('teacher-subject').value.trim(),
    qualification: document.getElementById('teacher-qualification').value.trim(),
    salary: parseInt(document.getElementById('teacher-salary').value),
    address: document.getElementById('teacher-address').value.trim()
  };

  try {
    await api.post('/teachers', teacherData);
    closeTeacherModal();
    await loadTeachers();
    showNotification('Teacher added successfully!', 'success');
  } catch (error) {
    console.error('Error adding teacher:', error);
    teacherError.textContent = error.response?.data?.error || 'Failed to add teacher';
    teacherError.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Teacher';
  }
});

// Delete Functions
async function deleteStudent(id) {
  if (!confirm('Are you sure you want to delete this student?')) return;

  try {
    await api.delete(`/students/${id}`);
    await loadStudents();
    showNotification('Student deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting student:', error);
    showNotification(error.response?.data?.error || 'Failed to delete student', 'error');
  }
}

async function deleteTeacher(id) {
  if (!confirm('Are you sure you want to delete this teacher?')) return;

  try {
    await api.delete(`/teachers/${id}`);
    await loadTeachers();
    showNotification('Teacher deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting teacher:', error);
    showNotification(error.response?.data?.error || 'Failed to delete teacher', 'error');
  }
}

// View Functions (placeholder)
function viewStudent(id) {
  alert('View student details - Feature coming soon!');
}

function viewTeacher(id) {
  alert('View teacher details - Feature coming soon!');
}

// Notification Function
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

// Load sections for a class — dynamically populate the section dropdown
async function loadSectionsForClass(classValue) {
  const sectionSelect = document.getElementById('student-section');
  if (!sectionSelect) return;

  // Default options (fallback)
  const defaultOptions = '<option value="">Select Section</option>' +
    '<option value="A">A</option><option value="B">B</option><option value="C">C</option>';

  if (!classValue) {
    sectionSelect.innerHTML = defaultOptions;
    return;
  }

  try {
    console.log(`Loading sections for class "${classValue}"...`);
    const { data } = await api.get(`/sections?class=${classValue}`);
    const sections = data.data;

    console.log('Sections API Response:', sections);

    if (!sections || !Array.isArray(sections) || sections.length === 0) {
      console.log('No sections available for this class, using defaults');
      sectionSelect.innerHTML = defaultOptions;
      return;
    }

    sectionSelect.innerHTML = '<option value="">Select Section</option>' +
      sections.map(s => `<option value="${s.name}">${s.name}</option>`).join('');

  } catch (error) {
    console.error('Error loading sections:', error);
    // Fallback to defaults on error
    sectionSelect.innerHTML = defaultOptions;
  }
}

// Listen for class input changes to load sections
const classInput = document.getElementById('student-class');
if (classInput) {
  let sectionTimeout;
  classInput.addEventListener('input', (e) => {
    clearTimeout(sectionTimeout);
    sectionTimeout = setTimeout(() => {
      loadSectionsForClass(e.target.value.trim());
    }, 400); // Debounce
  });
}

// Make functions globally accessible
window.loadStudents = loadStudents;
window.loadTeachers = loadTeachers;
window.deleteStudent = deleteStudent;
window.deleteTeacher = deleteTeacher;
window.viewStudent = viewStudent;
window.viewTeacher = viewTeacher;
window.openStudentModal = openStudentModal;
window.closeStudentModal = closeStudentModal;
window.openTeacherModal = openTeacherModal;
window.closeTeacherModal = closeTeacherModal;
window.loadSectionsForClass = loadSectionsForClass;

// Initial load
loadStudents();

