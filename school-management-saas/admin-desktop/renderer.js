const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = null;
let currentUser = null;

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

// Login Handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const { data } = await api.post('/auth/login', { email, password });
    token = data.data.token;
    currentUser = data.data;
    
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard-page').style.display = 'flex';
    loadDashboard();
  } catch (error) {
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = error.response?.data?.error || 'Login failed';
    errorEl.classList.add('show');
  }
});

// Logout Handler
document.getElementById('logout-btn').addEventListener('click', () => {
  token = null;
  currentUser = null;
  document.getElementById('login-page').style.display = 'block';
  document.getElementById('dashboard-page').style.display = 'none';
  document.getElementById('login-form').reset();
});

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const page = e.target.dataset.page;
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    e.target.classList.add('active');
    
    document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');
    document.getElementById(`${page}-content`).style.display = 'block';
    
    switch(page) {
      case 'dashboard': loadDashboard(); break;
      case 'students': loadStudents(); break;
      case 'teachers': loadTeachers(); break;
      case 'attendance': loadAttendance(); break;
      case 'fees': loadFees(); break;
    }
  });
});

// Load Dashboard
async function loadDashboard() {
  try {
    const { data } = await api.get('/dashboard/stats');
    const stats = data.data;
    
    document.getElementById('stats-grid').innerHTML = `
      <div class="stat-card">
        <h3>Total Students</h3>
        <div class="value">${stats.totalStudents}</div>
      </div>
      <div class="stat-card">
        <h3>Total Teachers</h3>
        <div class="value">${stats.totalTeachers}</div>
      </div>
      <div class="stat-card">
        <h3>Present Today</h3>
        <div class="value" style="color: #28a745">${stats.presentToday}</div>
      </div>
      <div class="stat-card">
        <h3>Absent Today</h3>
        <div class="value" style="color: #dc3545">${stats.absentToday}</div>
      </div>
      <div class="stat-card">
        <h3>Pending Fees</h3>
        <div class="value">${stats.pendingFees}</div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

// Load Students
async function loadStudents() {
  try {
    console.log('Fetching students from API...');
    const { data } = await api.get('/students');
    console.log('Students API response:', data);
    
    const students = data.data;
    console.log(`Loaded ${students.length} students`);
    
    if (students.length === 0) {
      document.getElementById('students-list').innerHTML = '<p style="padding: 20px;">No students found. Click "Add Student" to add one.</p>';
      return;
    }
    
    let html = '<table><thead><tr><th>Roll No</th><th>Name</th><th>Class</th><th>Section</th><th>Parent Phone</th><th>Actions</th></tr></thead><tbody>';
    
    students.forEach(student => {
      html += `
        <tr>
          <td>${student.rollNumber}</td>
          <td>${student.userId?.name || 'N/A'}</td>
          <td>${student.class}</td>
          <td>${student.section}</td>
          <td>${student.parentPhone}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="editStudent('${student._id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student._id}')">Delete</button>
          </td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    document.getElementById('students-list').innerHTML = html;
  } catch (error) {
    console.error('Error loading students:', error);
    console.error('Error details:', error.response?.data);
    
    const errorMessage = error.response?.data?.error || error.message || 'Failed to load students';
    document.getElementById('students-list').innerHTML = `
      <div style="padding: 20px; background: #f8d7da; color: #721c24; border-radius: 4px;">
        <p><strong>Error loading students:</strong> ${errorMessage}</p>
        <button onclick="loadStudents()" class="btn btn-primary" style="margin-top: 10px;">Retry</button>
      </div>
    `;
  }
}

// Load Teachers
async function loadTeachers() {
  try {
    console.log('Fetching teachers from API...');
    const { data } = await api.get('/teachers');
    console.log('Teachers API response:', data);
    
    const teachers = data.data;
    console.log(`Loaded ${teachers.length} teachers`);
    
    if (teachers.length === 0) {
      document.getElementById('teachers-list').innerHTML = '<p style="padding: 20px;">No teachers found. Click "Add Teacher" to add one.</p>';
      return;
    }
    
    let html = '<table><thead><tr><th>Employee ID</th><th>Name</th><th>Subject</th><th>Phone</th><th>Salary</th><th>Actions</th></tr></thead><tbody>';
    
    teachers.forEach(teacher => {
      html += `
        <tr>
          <td>${teacher.employeeId}</td>
          <td>${teacher.userId?.name || 'N/A'}</td>
          <td>${teacher.subject}</td>
          <td>${teacher.phone}</td>
          <td>₹${teacher.salary}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="editTeacher('${teacher._id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteTeacher('${teacher._id}')">Delete</button>
          </td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    document.getElementById('teachers-list').innerHTML = html;
  } catch (error) {
    console.error('Error loading teachers:', error);
    console.error('Error details:', error.response?.data);
    
    const errorMessage = error.response?.data?.error || error.message || 'Failed to load teachers';
    document.getElementById('teachers-list').innerHTML = `
      <div style="padding: 20px; background: #f8d7da; color: #721c24; border-radius: 4px;">
        <p><strong>Error loading teachers:</strong> ${errorMessage}</p>
        <button onclick="loadTeachers()" class="btn btn-primary" style="margin-top: 10px;">Retry</button>
      </div>
    `;
  }
}

// Load Attendance
async function loadAttendance() {
  try {
    console.log('Fetching attendance from API...');
    const { data } = await api.get('/attendance');
    console.log('Attendance API response:', data);
    
    const attendance = data.data;
    console.log(`Loaded ${attendance.length} attendance records`);
    
    if (attendance.length === 0) {
      document.getElementById('attendance-list').innerHTML = '<p style="padding: 20px;">No attendance records found. Click "Mark Attendance" to add records.</p>';
      return;
    }
    
    let html = '<table><thead><tr><th>Student</th><th>Date</th><th>Status</th><th>Remarks</th></tr></thead><tbody>';
    
    attendance.forEach(record => {
      const statusClass = record.status === 'Present' ? 'badge-success' : 'badge-danger';
      html += `
        <tr>
          <td>${record.studentId?.userId?.name || 'N/A'}</td>
          <td>${new Date(record.date).toLocaleDateString()}</td>
          <td><span class="badge ${statusClass}">${record.status}</span></td>
          <td>${record.remarks || '-'}</td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    document.getElementById('attendance-list').innerHTML = html;
  } catch (error) {
    console.error('Error loading attendance:', error);
    console.error('Error details:', error.response?.data);
    
    const errorMessage = error.response?.data?.error || error.message || 'Failed to load attendance';
    document.getElementById('attendance-list').innerHTML = `
      <div style="padding: 20px; background: #f8d7da; color: #721c24; border-radius: 4px;">
        <p><strong>Error loading attendance:</strong> ${errorMessage}</p>
        <button onclick="loadAttendance()" class="btn btn-primary" style="margin-top: 10px;">Retry</button>
      </div>
    `;
  }
}

// Mark Attendance Modal Functions
let attendanceStudents = [];

async function openMarkAttendanceModal() {
  console.log('Opening Mark Attendance modal');
  document.getElementById('mark-attendance-modal').style.display = 'flex';
  document.getElementById('mark-attendance-error').textContent = '';
  document.getElementById('mark-attendance-error').classList.remove('show');
  
  // Set today's date
  document.getElementById('attendance-date').value = new Date().toISOString().split('T')[0];
  
  // Load students
  try {
    console.log('Fetching students for attendance...');
    const { data } = await api.get('/students');
    attendanceStudents = data.data;
    console.log(`Loaded ${attendanceStudents.length} students for attendance`);
    
    if (attendanceStudents.length === 0) {
      document.getElementById('students-attendance-list').innerHTML = '<p style="padding: 20px;">No students found. Please add students first.</p>';
      return;
    }
    
    // Generate attendance list
    let html = '<table style="width: 100%;"><thead><tr><th>Roll No</th><th>Name</th><th>Class</th><th>Status</th></tr></thead><tbody>';
    
    attendanceStudents.forEach((student, index) => {
      html += `
        <tr>
          <td>${student.rollNumber}</td>
          <td>${student.userId?.name || 'N/A'}</td>
          <td>${student.class} - ${student.section}</td>
          <td>
            <label style="margin-right: 15px;">
              <input type="radio" name="attendance-${index}" value="Present" checked> Present
            </label>
            <label>
              <input type="radio" name="attendance-${index}" value="Absent"> Absent
            </label>
          </td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    document.getElementById('students-attendance-list').innerHTML = html;
  } catch (error) {
    console.error('Error loading students for attendance:', error);
    document.getElementById('students-attendance-list').innerHTML = `
      <p style="color: #dc3545;">Error loading students: ${error.response?.data?.error || error.message}</p>
    `;
  }
}

function closeMarkAttendanceModal() {
  console.log('Closing Mark Attendance modal');
  document.getElementById('mark-attendance-modal').style.display = 'none';
  attendanceStudents = [];
}

async function submitAttendance() {
  console.log('Submitting attendance...');
  
  const submitBtn = document.getElementById('submit-attendance-btn');
  const errorEl = document.getElementById('mark-attendance-error');
  const date = document.getElementById('attendance-date').value;
  
  if (!date) {
    errorEl.textContent = 'Please select a date';
    errorEl.classList.add('show');
    return;
  }
  
  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  errorEl.textContent = '';
  errorEl.classList.remove('show');
  
  try {
    // Collect attendance data
    const attendanceRecords = [];
    
    attendanceStudents.forEach((student, index) => {
      const statusRadios = document.getElementsByName(`attendance-${index}`);
      let status = 'Present';
      
      for (const radio of statusRadios) {
        if (radio.checked) {
          status = radio.value;
          break;
        }
      }
      
      attendanceRecords.push({
        studentId: student._id,
        date: date,
        status: status
      });
    });
    
    console.log('Attendance records to submit:', attendanceRecords);
    
    // Submit attendance (bulk)
    const response = await api.post('/attendance/mark', { 
      attendance: attendanceRecords 
    });
    
    console.log('Attendance submitted successfully:', response.data);
    
    // Close modal and refresh list
    closeMarkAttendanceModal();
    await loadAttendance();
    
    // Show success message
    alert('Attendance marked successfully!');
  } catch (error) {
    console.error('Error submitting attendance:', error);
    console.error('Error response:', error.response?.data);
    
    const errorMessage = error.response?.data?.error || error.message || 'Failed to submit attendance';
    errorEl.textContent = errorMessage;
    errorEl.classList.add('show');
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Attendance';
  }
}

// Mark Attendance Button Event Listener
document.getElementById('mark-attendance-btn').addEventListener('click', () => {
  console.log('Mark Attendance button clicked');
  openMarkAttendanceModal();
});

// Load Fees
async function loadFees() {
  try {
    console.log('Fetching fees from API...');
    const { data } = await api.get('/fees');
    console.log('Fees API response:', data);
    
    const fees = data.data;
    console.log(`Loaded ${fees.length} fee records`);
    
    if (fees.length === 0) {
      document.getElementById('fees-list').innerHTML = '<p style="padding: 20px;">No fee records found.</p>';
      return;
    }
    
    let html = '<table><thead><tr><th>Student</th><th>Fee Type</th><th>Amount</th><th>Paid</th><th>Due</th><th>Status</th><th>Due Date</th><th>Actions</th></tr></thead><tbody>';
    
    fees.forEach(fee => {
      const statusClass = fee.status === 'Paid' ? 'badge-success' : 'badge-warning';
      const dueAmount = fee.amount - fee.paidAmount;
      
      html += `
        <tr>
          <td>${fee.studentId?.userId?.name || 'N/A'}</td>
          <td>${fee.feeType}</td>
          <td>₹${fee.amount}</td>
          <td>₹${fee.paidAmount}</td>
          <td style="color: ${dueAmount > 0 ? '#dc3545' : '#28a745'}">₹${dueAmount}</td>
          <td><span class="badge ${statusClass}">${fee.status}</span></td>
          <td>${new Date(fee.dueDate).toLocaleDateString()}</td>
          <td>
            ${fee.status !== 'Paid' ? `<button class="btn btn-sm btn-primary" onclick="markFeePaid('${fee._id}', ${fee.amount})">Mark Paid</button>` : '-'}
          </td>
        </tr>
      `;
    });
    
    html += '</tbody></table>';
    document.getElementById('fees-list').innerHTML = html;
  } catch (error) {
    console.error('Error loading fees:', error);
    console.error('Error details:', error.response?.data);
    
    const errorMessage = error.response?.data?.error || error.message || 'Failed to load fees';
    document.getElementById('fees-list').innerHTML = `
      <div style="padding: 20px; background: #f8d7da; color: #721c24; border-radius: 4px;">
        <p><strong>Error loading fees:</strong> ${errorMessage}</p>
        <button onclick="loadFees()" class="btn btn-primary" style="margin-top: 10px;">Retry</button>
      </div>
    `;
  }
}

// Mark Fee as Paid
async function markFeePaid(feeId, amount) {
  if (!confirm(`Mark this fee as paid (₹${amount})?`)) {
    return;
  }
  
  try {
    console.log('Marking fee as paid:', feeId);
    const response = await api.put(`/fees/${feeId}/pay`, {
      paidAmount: amount
    });
    console.log('Fee marked as paid:', response.data);
    
    // Refresh fees list
    await loadFees();
    
    alert('Fee marked as paid successfully!');
  } catch (error) {
    console.error('Error marking fee as paid:', error);
    console.error('Error response:', error.response?.data);
    
    const errorMessage = error.response?.data?.error || error.message || 'Failed to mark fee as paid';
    alert('Error: ' + errorMessage);
  }
}

// Placeholder functions for CRUD operations
function editStudent(id) {
  alert('Edit student functionality - implement modal form');
}

function deleteStudent(id) {
  if (confirm('Are you sure you want to delete this student?')) {
    api.delete(`/students/${id}`)
      .then(() => {
        console.log('Student deleted successfully');
        loadStudents();
      })
      .catch(err => {
        console.error('Error deleting student:', err);
        alert('Error deleting student: ' + (err.response?.data?.error || err.message));
      });
  }
}

function editTeacher(id) {
  alert('Edit teacher functionality - implement modal form');
}

function deleteTeacher(id) {
  if (confirm('Are you sure you want to delete this teacher?')) {
    api.delete(`/teachers/${id}`)
      .then(() => {
        console.log('Teacher deleted successfully');
        loadTeachers();
      })
      .catch(err => {
        console.error('Error deleting teacher:', err);
        alert('Error deleting teacher: ' + (err.response?.data?.error || err.message));
      });
  }
}

// Add Student Modal Functions
function openAddStudentModal() {
  console.log('Opening Add Student modal');
  document.getElementById('add-student-modal').style.display = 'flex';
  document.getElementById('add-student-form').reset();
  document.getElementById('add-student-error').textContent = '';
  document.getElementById('add-student-error').classList.remove('show');
}

function closeAddStudentModal() {
  console.log('Closing Add Student modal');
  document.getElementById('add-student-modal').style.display = 'none';
  document.getElementById('add-student-form').reset();
}

// Add Student Button Event Listener
document.getElementById('add-student-btn').addEventListener('click', () => {
  console.log('Add Student button clicked');
  openAddStudentModal();
});

// Add Student Form Submission
document.getElementById('add-student-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Add Student form submitted');
  
  const submitBtn = document.getElementById('submit-student-btn');
  const errorEl = document.getElementById('add-student-error');
  
  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Adding...';
  errorEl.textContent = '';
  errorEl.classList.remove('show');
  
  // Collect form data
  const studentData = {
    name: document.getElementById('student-name').value.trim(),
    email: document.getElementById('student-email').value.trim(),
    password: document.getElementById('student-password').value,
    phone: document.getElementById('student-phone').value.trim() || undefined,
    rollNumber: document.getElementById('student-roll').value.trim(),
    class: document.getElementById('student-class').value.trim(),
    section: document.getElementById('student-section').value.trim(),
    dateOfBirth: document.getElementById('student-dob').value,
    parentName: document.getElementById('student-parent-name').value.trim(),
    parentPhone: document.getElementById('student-parent-phone').value.trim(),
    address: document.getElementById('student-address').value.trim()
  };
  
  console.log('Student data to submit:', { ...studentData, password: '***' });
  
  try {
    console.log('Sending POST request to /students');
    const response = await api.post('/students', studentData);
    console.log('Student created successfully:', response.data);
    
    // Close modal and refresh list
    closeAddStudentModal();
    await loadStudents();
    
    // Show success message
    alert('Student added successfully!');
  } catch (error) {
    console.error('Error adding student:', error);
    console.error('Error response:', error.response?.data);
    
    const errorMessage = error.response?.data?.error || error.message || 'Failed to add student';
    errorEl.textContent = errorMessage;
    errorEl.classList.add('show');
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Student';
  }
});

// Add Teacher Modal Functions
function openAddTeacherModal() {
  console.log('Opening Add Teacher modal');
  document.getElementById('add-teacher-modal').style.display = 'flex';
  document.getElementById('add-teacher-form').reset();
  document.getElementById('add-teacher-error').textContent = '';
  document.getElementById('add-teacher-error').classList.remove('show');
}

function closeAddTeacherModal() {
  console.log('Closing Add Teacher modal');
  document.getElementById('add-teacher-modal').style.display = 'none';
  document.getElementById('add-teacher-form').reset();
}

// Add Teacher Button Event Listener
document.getElementById('add-teacher-btn').addEventListener('click', () => {
  console.log('Add Teacher button clicked');
  openAddTeacherModal();
});

// Add Teacher Form Submission
document.getElementById('add-teacher-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Add Teacher form submitted');
  
  const submitBtn = document.getElementById('submit-teacher-btn');
  const errorEl = document.getElementById('add-teacher-error');
  
  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.textContent = 'Adding...';
  errorEl.textContent = '';
  errorEl.classList.remove('show');
  
  // Collect form data
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
  
  console.log('Teacher data to submit:', { ...teacherData, password: '***' });
  
  try {
    console.log('Sending POST request to /teachers');
    const response = await api.post('/teachers', teacherData);
    console.log('Teacher created successfully:', response.data);
    
    // Close modal and refresh list
    closeAddTeacherModal();
    await loadTeachers();
    
    // Show success message
    alert('Teacher added successfully!');
  } catch (error) {
    console.error('Error adding teacher:', error);
    console.error('Error response:', error.response?.data);
    
    const errorMessage = error.response?.data?.error || error.message || 'Failed to add teacher';
    errorEl.textContent = errorMessage;
    errorEl.classList.add('show');
  } finally {
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Add Teacher';
  }
});

// Make functions globally accessible
window.openAddStudentModal = openAddStudentModal;
window.closeAddStudentModal = closeAddStudentModal;
window.openAddTeacherModal = openAddTeacherModal;
window.closeAddTeacherModal = closeAddTeacherModal;
window.openMarkAttendanceModal = openMarkAttendanceModal;
window.closeMarkAttendanceModal = closeMarkAttendanceModal;
window.submitAttendance = submitAttendance;
window.markFeePaid = markFeePaid;
window.loadStudents = loadStudents;
window.loadTeachers = loadTeachers;
window.loadAttendance = loadAttendance;
window.loadFees = loadFees;
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;
window.editTeacher = editTeacher;
window.deleteTeacher = deleteTeacher;

