const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user') || '{}');
let allSections = [];
let allStudents = [];

// API Helper
const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
    if (token) config.headers.Authorization = `Bearer ${token}`;
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

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
});

// ==================== LOAD SECTIONS ====================

async function loadSections(classFilter = '') {
    const tbody = document.getElementById('sections-tbody');

    try {
        const qs = classFilter ? `?class=${classFilter}` : '';
        console.log(`Loading sections${qs}...`);

        const [sectionsRes, studentsRes] = await Promise.all([
            api.get(`/sections${qs}`),
            api.get('/students')
        ]);

        allSections = sectionsRes.data?.data || [];
        allStudents = studentsRes.data?.data || [];

        console.log(`Loaded ${allSections.length} sections, ${allStudents.length} students`);

        // Update stats
        updateStats();

        if (!Array.isArray(allSections) || allSections.length === 0) {
            tbody.innerHTML = `
        <tr>
          <td colspan="5" class="px-6 py-12 text-center">
            <div class="flex flex-col items-center justify-center">
              <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <p class="text-gray-500 font-medium mb-2">No sections found</p>
              <p class="text-gray-400 text-sm">Click "Add Section" or "Seed" to create sections</p>
            </div>
          </td>
        </tr>
      `;
            return;
        }

        tbody.innerHTML = allSections.map(section => {
            const studentCount = countStudentsInSection(section.class, section.name);
            const isDefault = section.isDefault || section.fromStudents;
            const createdDate = section.createdAt
                ? new Date(section.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '—';

            return `
        <tr class="transition-all duration-200">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                ${section.name}
              </div>
              <div>
                <div class="text-sm font-semibold text-gray-900">Section ${section.name}</div>
                ${isDefault ? '<span class="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Default</span>' : ''}
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
              Class ${section.class}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span class="text-sm font-medium text-gray-700">${studentCount}</span>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${createdDate}</td>
          <td class="px-6 py-4 whitespace-nowrap text-center">
            ${section._id && !isDefault ? `
              <div class="flex items-center justify-center space-x-2">
                <button onclick="editSection('${section._id}', '${section.name}', '${section.class}')" class="text-indigo-600 hover:text-indigo-900 transition p-2 rounded-lg hover:bg-indigo-50" title="Edit">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button onclick="deleteSection('${section._id}', '${section.name}', '${section.class}')" class="text-red-600 hover:text-red-900 transition p-2 rounded-lg hover:bg-red-50" title="Delete">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            ` : '<span class="text-xs text-gray-400">—</span>'}
          </td>
        </tr>
      `;
        }).join('');

    } catch (error) {
        console.error('Error loading sections:', error);
        tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-12 text-center">
          <div class="flex flex-col items-center justify-center">
            <svg class="w-16 h-16 text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-red-600 font-medium mb-2">Error loading sections</p>
            <p class="text-gray-500 text-sm mb-4">${error.response?.data?.error || error.message}</p>
            <button onclick="loadSections()" class="btn-gradient px-4 py-2 rounded-lg text-white font-semibold">Retry</button>
          </div>
        </td>
      </tr>
    `;
    }
}

function countStudentsInSection(className, sectionName) {
    if (!Array.isArray(allStudents)) return 0;
    return allStudents.filter(s =>
        String(s.class) === String(className) &&
        String(s.section || '').toUpperCase() === String(sectionName || '').toUpperCase()
    ).length;
}

function updateStats() {
    const totalEl = document.getElementById('stat-total');
    const classesEl = document.getElementById('stat-classes');

    if (totalEl) totalEl.textContent = allSections.length;

    if (classesEl) {
        const uniqueClasses = new Set(allSections.map(s => String(s.class)));
        classesEl.textContent = uniqueClasses.size;
    }
}

// ==================== MODAL — ADD / EDIT ====================

const sectionModal = document.getElementById('section-modal');
const sectionForm = document.getElementById('section-form');
const sectionError = document.getElementById('section-error');

function openSectionModal(editId, editName, editClass) {
    sectionModal.classList.remove('hidden');
    sectionModal.classList.add('flex');
    sectionForm.reset();
    sectionError.classList.add('hidden');

    if (editId) {
        document.getElementById('modal-title').textContent = 'Edit Section';
        document.getElementById('submit-section-btn').textContent = 'Save Changes';
        document.getElementById('section-id').value = editId;
        document.getElementById('section-name').value = editName;
        document.getElementById('section-class').value = editClass;
    } else {
        document.getElementById('modal-title').textContent = 'Add New Section';
        document.getElementById('submit-section-btn').textContent = 'Add Section';
        document.getElementById('section-id').value = '';
    }
}

function closeSectionModal() {
    sectionModal.classList.add('hidden');
    sectionModal.classList.remove('flex');
    sectionForm.reset();
}

document.getElementById('close-section-modal').addEventListener('click', closeSectionModal);
document.getElementById('cancel-section-btn').addEventListener('click', closeSectionModal);
document.getElementById('add-section-btn').addEventListener('click', () => openSectionModal());

sectionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-section-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    sectionError.classList.add('hidden');

    const sectionId = document.getElementById('section-id').value;
    const payload = {
        name: document.getElementById('section-name').value.trim(),
        class: document.getElementById('section-class').value
    };

    if (!payload.name || !payload.class) {
        sectionError.textContent = 'Please fill in both fields';
        sectionError.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = sectionId ? 'Save Changes' : 'Add Section';
        return;
    }

    try {
        if (sectionId) {
            await api.put(`/sections/${sectionId}`, payload);
            showNotification('Section updated successfully!', 'success');
        } else {
            await api.post('/sections', payload);
            showNotification('Section created successfully!', 'success');
        }
        closeSectionModal();
        await loadSections(document.getElementById('class-filter').value);
    } catch (error) {
        console.error('Error saving section:', error);
        sectionError.textContent = error.response?.data?.error || 'Failed to save section';
        sectionError.classList.remove('hidden');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = sectionId ? 'Save Changes' : 'Add Section';
    }
});

// ==================== EDIT / DELETE ====================

function editSection(id, name, className) {
    openSectionModal(id, name, className);
}

async function deleteSection(id, name, className) {
    if (!confirm(`Are you sure you want to delete Section "${name}" from Class ${className}?`)) return;

    try {
        await api.delete(`/sections/${id}`);
        showNotification(`Section "${name}" deleted!`, 'success');
        await loadSections(document.getElementById('class-filter').value);
    } catch (error) {
        console.error('Error deleting section:', error);
        showNotification(error.response?.data?.error || 'Failed to delete section', 'error');
    }
}

// ==================== SEED SECTIONS ====================

function openSeedModal() {
    document.getElementById('seed-modal').classList.remove('hidden');
    document.getElementById('seed-modal').classList.add('flex');
    document.getElementById('seed-class').value = '';
}

function closeSeedModal() {
    document.getElementById('seed-modal').classList.add('hidden');
    document.getElementById('seed-modal').classList.remove('flex');
}

async function seedSections() {
    const classValue = document.getElementById('seed-class').value;
    if (!classValue) {
        alert('Please select a class');
        return;
    }

    const seedBtn = document.getElementById('seed-btn');
    seedBtn.disabled = true;
    seedBtn.textContent = 'Seeding...';

    try {
        const { data } = await api.post('/sections/seed', {
            class: classValue,
            sections: ['A', 'B', 'C']
        });

        showNotification(data.message || 'Sections seeded!', 'success');
        closeSeedModal();
        await loadSections(document.getElementById('class-filter').value);
    } catch (error) {
        console.error('Error seeding sections:', error);
        showNotification(error.response?.data?.error || 'Failed to seed sections', 'error');
    } finally {
        seedBtn.disabled = false;
        seedBtn.textContent = 'Seed A, B, C';
    }
}

// ==================== FILTER ====================

document.getElementById('class-filter').addEventListener('change', (e) => {
    loadSections(e.target.value);
});

// ==================== NOTIFICATIONS ====================

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

// ==================== GLOBAL FUNCTIONS ====================

window.loadSections = loadSections;
window.editSection = editSection;
window.deleteSection = deleteSection;
window.openSeedModal = openSeedModal;
window.closeSeedModal = closeSeedModal;
window.seedSections = seedSections;

// Initial load
loadSections();
