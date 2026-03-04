async function loadSchools() {
    try {
        const response = await api.get('/schools');
        const schools = response.data;

        const tbody = document.getElementById('schoolsTableBody');
        tbody.innerHTML = schools.map(school => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${school.name}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${school.email}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">${school.phone}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${school.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${school.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="deleteSchool('${school._id}')" class="text-red-600 hover:text-red-900">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading schools:', error);
        notify.error('Failed to load schools');
    }
}

function showCreateModal() {
    document.getElementById('createModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('createModal').classList.add('hidden');
}

document.getElementById('createSchoolForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('schoolName').value,
        email: document.getElementById('schoolEmail').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        adminName: document.getElementById('adminName').value,
        adminEmail: document.getElementById('adminEmail').value,
        adminPassword: document.getElementById('adminPassword').value
    };

    try {
        await api.post('/schools', formData);
        closeModal();
        loadSchools();
        e.target.reset();
        notify.success('School created successfully!');
    } catch (error) {
        notify.error('Error creating school: ' + error.message);
    }
});

async function deleteSchool(id) {
    if (!confirm('Are you sure you want to delete this school?')) return;

    try {
        await api.delete(`/schools/${id}`);
        loadSchools();
        notify.success('School deleted successfully!');
    } catch (error) {
        notify.error('Error deleting school: ' + error.message);
    }
}

loadSchools();
