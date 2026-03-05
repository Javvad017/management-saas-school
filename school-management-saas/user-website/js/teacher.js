/**
 * Teacher Module — Handles teacher-specific dashboard logic
 * Mark Attendance, Upload Homework, Enter Marks
 */

class TeacherDashboard {
    constructor() {
        this.students = [];
        this.exams = [];
        this.attendanceState = [];
    }

    // ==================== DASHBOARD STATS ====================

    async loadDashboardStats() {
        try {
            const [studentsRes, attendanceRes, homeworkRes, examsRes] = await Promise.allSettled([
                api.getStudents(),
                api.getAttendanceRecords(),
                api.getAllHomework(),
                api.getExams()
            ]);

            const students = this.extractArray(studentsRes.status === 'fulfilled' ? studentsRes.value : null);
            const attendance = this.extractArray(attendanceRes.status === 'fulfilled' ? attendanceRes.value : null);
            const homework = this.extractArray(homeworkRes.status === 'fulfilled' ? homeworkRes.value : null);
            const exams = this.extractArray(examsRes.status === 'fulfilled' ? examsRes.value : null);

            // Total students
            this.updateStat('stat-students', students.length);

            // Today's attendance rate
            const today = new Date().toISOString().split('T')[0];
            const todayRecords = attendance.filter(a => a.date && a.date.startsWith(today));
            const presentToday = todayRecords.filter(a => (a.status || '').toLowerCase() === 'present').length;
            const attendanceRate = todayRecords.length > 0 ? Math.round((presentToday / todayRecords.length) * 100) : 0;
            this.updateStat('stat-attendance', attendanceRate + '%');

            // Active homework
            const activeHomework = homework.filter(h => {
                if (!h.dueDate) return true;
                return new Date(h.dueDate) >= new Date();
            });
            this.updateStat('stat-homework', activeHomework.length);

            // Total exams
            this.updateStat('stat-exams', exams.length);

            // Update charts
            this.buildAttendanceChart(attendance);
            this.buildSubjectChart(students);

            // Update timestamp
            const timeEl = document.getElementById('last-refresh');
            if (timeEl) timeEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;

        } catch (err) {
            console.error('Dashboard load error:', err);
        }
    }

    updateStat(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    /**
     * Safely extract an array from any API response shape.
     * Handles: { data: [...] }, { data: { data: [...] } }, [...], or non-array.
     */
    extractArray(res) {
        if (!res) return [];
        // Already an array (raw response)
        if (Array.isArray(res)) return res;
        // Standard shape: { data: [...] }
        if (res.data !== undefined) {
            if (Array.isArray(res.data)) return res.data;
            // Nested: { data: { data: [...] } }
            if (res.data && Array.isArray(res.data.data)) return res.data.data;
        }
        return [];
    }

    // ==================== CHARTS ====================

    buildAttendanceChart(records) {
        const ctx = document.getElementById('attendance-trend-chart');
        if (!ctx) return;

        if (this._attendanceChart) this._attendanceChart.destroy();

        const dateMap = {};
        records.forEach(r => {
            const d = new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (!dateMap[d]) dateMap[d] = { present: 0, absent: 0 };
            if ((r.status || '').toLowerCase() === 'present') dateMap[d].present++;
            else dateMap[d].absent++;
        });

        const labels = Object.keys(dateMap).slice(-10);
        const presentData = labels.map(l => dateMap[l]?.present || 0);
        const absentData = labels.map(l => dateMap[l]?.absent || 0);

        this._attendanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Present',
                        data: presentData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: '#10b981'
                    },
                    {
                        label: 'Absent',
                        data: absentData,
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 4,
                        pointBackgroundColor: '#ef4444'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top', labels: { usePointStyle: true, padding: 16, font: { size: 11, family: 'Inter' } } },
                    tooltip: { backgroundColor: '#1e293b', cornerRadius: 8, padding: 10 }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } }, border: { display: false } },
                    y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#94a3b8', font: { size: 10 } }, border: { display: false } }
                }
            }
        });
    }

    buildSubjectChart(students) {
        const ctx = document.getElementById('class-distribution-chart');
        if (!ctx) return;

        if (this._classChart) this._classChart.destroy();

        const classMap = {};
        students.forEach(s => {
            const key = `${s.class || 'Unknown'}`;
            classMap[key] = (classMap[key] || 0) + 1;
        });

        const labels = Object.keys(classMap);
        const data = Object.values(classMap);
        const colors = ['#6366f1', '#8b5cf6', '#0ea5e9', '#f59e0b', '#10b981', '#ec4899', '#14b8a6', '#f97316'];

        this._classChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderColor: '#fff',
                    borderWidth: 3,
                    spacing: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 11, family: 'Inter' } } },
                    tooltip: { backgroundColor: '#1e293b', cornerRadius: 8 }
                }
            },
            plugins: [{
                id: 'centerTotal',
                beforeDraw(chart) {
                    const { ctx: c, chartArea } = chart;
                    if (!chartArea) return;
                    const total = data.reduce((a, b) => a + b, 0);
                    const cx = (chartArea.left + chartArea.right) / 2;
                    const cy = (chartArea.top + chartArea.bottom) / 2 - 4;
                    c.save();
                    c.textAlign = 'center';
                    c.font = 'bold 24px Inter, sans-serif';
                    c.fillStyle = '#1e293b';
                    c.fillText(total, cx, cy);
                    c.font = '500 10px Inter, sans-serif';
                    c.fillStyle = '#94a3b8';
                    c.fillText('STUDENTS', cx, cy + 16);
                    c.restore();
                }
            }]
        });
    }

    // ==================== MARK ATTENDANCE ====================

    async loadStudentsForAttendance() {
        const container = document.getElementById('attendance-student-list');
        try {
            console.log('Fetching students for attendance...');
            const res = await api.getStudents();

            // Debug: log raw API response
            console.log('Students API Response:', res);

            // Safely extract students array from any response shape
            const students = this.extractArray(res);

            if (!Array.isArray(students)) {
                throw new Error('Students data is not an array');
            }

            this.students = students;
            console.log(`Loaded ${this.students.length} students for attendance`);

            this.renderAttendanceList(this.students);
        } catch (err) {
            console.error('Error loading students:', err);
            if (container) container.innerHTML = `<p class="text-red-500 text-center py-8">Failed to load students: ${err.message}</p>`;
        }
    }

    renderAttendanceList(students) {
        const container = document.getElementById('attendance-student-list');
        if (!container) return;

        // Guard: ensure students is always an array
        if (!Array.isArray(students)) {
            console.error('renderAttendanceList received non-array:', students);
            container.innerHTML = '<p class="text-red-500 text-center py-8">Error: Invalid student data format</p>';
            return;
        }

        if (students.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No students found</p>';
            return;
        }

        container.innerHTML = students.map((s, i) => `
            <div class="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition" data-student-id="${s._id}">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        ${(s.userId?.name || s.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p class="font-semibold text-gray-800 text-sm">${s.userId?.name || s.name || 'N/A'}</p>
                        <p class="text-xs text-gray-500">Roll #${s.rollNumber || '—'} • Class ${s.class || '—'}-${s.section || ''}</p>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="teacherApp.setAttendance(${i}, 'Present')" id="present-btn-${i}"
                        class="px-4 py-2 rounded-lg text-xs font-semibold transition attendance-btn bg-green-100 text-green-700 hover:bg-green-200 border border-green-200 present-active">
                        ✓ Present
                    </button>
                    <button onclick="teacherApp.setAttendance(${i}, 'Absent')" id="absent-btn-${i}"
                        class="px-4 py-2 rounded-lg text-xs font-semibold transition attendance-btn bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-700 border border-gray-200">
                        ✗ Absent
                    </button>
                </div>
            </div>
        `).join('');

        // Initialize all as Present
        this.attendanceState = students.map(() => 'Present');
    }

    setAttendance(index, status) {
        if (!this.attendanceState) this.attendanceState = [];
        this.attendanceState[index] = status;
        const presentBtn = document.getElementById(`present-btn-${index}`);
        const absentBtn = document.getElementById(`absent-btn-${index}`);

        if (status === 'Present') {
            presentBtn.className = 'px-4 py-2 rounded-lg text-xs font-semibold transition attendance-btn bg-green-100 text-green-700 hover:bg-green-200 border border-green-200 present-active';
            absentBtn.className = 'px-4 py-2 rounded-lg text-xs font-semibold transition attendance-btn bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-700 border border-gray-200';
        } else {
            presentBtn.className = 'px-4 py-2 rounded-lg text-xs font-semibold transition attendance-btn bg-gray-100 text-gray-500 hover:bg-green-100 hover:text-green-700 border border-gray-200';
            absentBtn.className = 'px-4 py-2 rounded-lg text-xs font-semibold transition attendance-btn bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 absent-active';
        }
    }

    async submitAttendance() {
        const date = document.getElementById('attendance-date')?.value;
        if (!date) {
            this.showToast('Please select a date', 'error');
            return;
        }

        // Guard: ensure students is a valid array before mapping
        if (!Array.isArray(this.students) || this.students.length === 0) {
            this.showToast('No students loaded. Please refresh the page.', 'error');
            return;
        }

        const submitBtn = document.getElementById('submit-attendance-btn');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }

        try {
            // Build bulk attendance records
            const attendanceRecords = this.students.map((s, i) => ({
                studentId: s._id,
                status: this.attendanceState[i] || 'Present'
            }));

            console.log('Submitting attendance:', { date, records: attendanceRecords.length });

            // Send bulk request — POST /api/attendance/mark
            // Body: { date, students: [{ studentId, status }] }
            await api.post('/attendance/mark', {
                date: date,
                students: attendanceRecords
            });

            this.showToast(`Attendance marked for ${attendanceRecords.length} students!`, 'success');

            // Reload recent records
            if (typeof this.loadRecentAttendance === 'function') {
                await this.loadRecentAttendance();
            }
        } catch (err) {
            console.error('Attendance submission error:', err);
            this.showToast('Failed to submit: ' + err.message, 'error');
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Attendance'; }
        }
    }

    async loadRecentAttendance() {
        try {
            const res = await api.getAttendanceRecords();
            const records = this.extractArray(res).slice(0, 20);
            const tbody = document.getElementById('recent-attendance-tbody');
            if (!tbody) return;

            if (records.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center py-6 text-gray-400">No records yet</td></tr>';
                return;
            }

            tbody.innerHTML = records.map(r => `
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-4 py-3 text-sm font-medium text-gray-800">${r.studentId?.userId?.name || 'N/A'}</td>
                    <td class="px-4 py-3 text-sm text-gray-600">${new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td class="px-4 py-3"><span class="px-2.5 py-1 rounded-full text-xs font-semibold ${(r.status || '').toLowerCase() === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${r.status}</span></td>
                    <td class="px-4 py-3 text-sm text-gray-500">${r.remarks || '—'}</td>
                </tr>
            `).join('');
        } catch (err) {
            console.error('Error loading recent attendance:', err);
        }
    }

    // ==================== HOMEWORK ====================

    async submitHomework() {
        const title = document.getElementById('hw-title')?.value?.trim();
        const description = document.getElementById('hw-description')?.value?.trim();
        const subject = document.getElementById('hw-subject')?.value?.trim();
        const className = document.getElementById('hw-class')?.value?.trim();
        const dueDate = document.getElementById('hw-due-date')?.value;

        if (!title || !subject || !className) {
            this.showToast('Please fill in Title, Subject, and Class', 'error');
            return;
        }

        const submitBtn = document.getElementById('submit-homework-btn');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }

        try {
            await api.createHomework({
                title,
                description,
                subject,
                class: className,
                dueDate: dueDate || undefined
            });

            this.showToast('Homework assigned successfully!', 'success');

            // Clear form
            document.getElementById('hw-title').value = '';
            document.getElementById('hw-description').value = '';
            document.getElementById('hw-subject').value = '';
            document.getElementById('hw-class').value = '';
            if (document.getElementById('hw-due-date')) document.getElementById('hw-due-date').value = '';

            // Reload list
            await this.loadHomeworkList();
        } catch (err) {
            this.showToast('Failed: ' + err.message, 'error');
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Assign Homework'; }
        }
    }

    async loadHomeworkList() {
        try {
            const res = await api.getAllHomework();
            const homework = this.extractArray(res);
            const container = document.getElementById('homework-list');
            if (!container) return;

            if (homework.length === 0) {
                container.innerHTML = '<p class="text-gray-400 text-center py-8">No homework assigned yet</p>';
                return;
            }

            container.innerHTML = homework.map(h => `
                <div class="p-4 rounded-xl border border-gray-100 hover:border-indigo-200 transition">
                    <div class="flex items-start justify-between">
                        <div>
                            <h4 class="font-semibold text-gray-800">${h.title}</h4>
                            <p class="text-xs text-gray-500 mt-1">${h.subject || ''} • Class ${h.class || '—'}</p>
                            ${h.description ? `<p class="text-sm text-gray-600 mt-2">${h.description}</p>` : ''}
                        </div>
                        ${h.dueDate ? `<span class="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 flex-shrink-0">Due: ${new Date(h.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>` : ''}
                    </div>
                </div>
            `).join('');
        } catch (err) {
            console.error('Error loading homework:', err);
        }
    }

    // ==================== MARKS / RESULTS ====================

    async loadExamsForMarks() {
        try {
            const res = await api.getExams();
            this.exams = this.extractArray(res);

            const select = document.getElementById('marks-exam-select');
            if (!select) return;

            select.innerHTML = '<option value="">Select Exam</option>' +
                this.exams.map(e => `<option value="${e._id}">${e.name} — ${e.subject || ''} (Class ${e.class || '—'})</option>`).join('');
        } catch (err) {
            console.error('Error loading exams:', err);
        }
    }

    async loadStudentsForMarks() {
        try {
            const res = await api.getStudents();
            this.students = this.extractArray(res);

            const select = document.getElementById('marks-student-select');
            if (!select) return;

            select.innerHTML = '<option value="">Select Student</option>' +
                this.students.map(s => `<option value="${s._id}">${s.userId?.name || s.name || 'N/A'} — Roll #${s.rollNumber || '—'} (Class ${s.class || '—'})</option>`).join('');
        } catch (err) {
            console.error('Error loading students for marks:', err);
        }
    }

    async submitMarks() {
        const examId = document.getElementById('marks-exam-select')?.value;
        const studentId = document.getElementById('marks-student-select')?.value;
        const marksObtained = document.getElementById('marks-obtained')?.value;

        if (!examId || !studentId || !marksObtained) {
            this.showToast('Please select exam, student, and enter marks', 'error');
            return;
        }

        const submitBtn = document.getElementById('submit-marks-btn');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }

        try {
            await api.addResult({
                examId,
                studentId,
                marksObtained: parseInt(marksObtained)
            });

            this.showToast('Marks submitted successfully!', 'success');
            document.getElementById('marks-obtained').value = '';

        } catch (err) {
            this.showToast('Failed: ' + err.message, 'error');
        } finally {
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Marks'; }
        }
    }

    // ==================== TOAST ====================

    showToast(message, type = 'info') {
        // Remove existing toast
        const existing = document.getElementById('toast-notification');
        if (existing) existing.remove();

        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-indigo-500'
        };
        const icons = {
            success: '✓',
            error: '✗',
            info: 'ℹ'
        };

        const toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = `fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl text-white shadow-2xl ${colors[type] || colors.info} animate-slide-in`;
        toast.innerHTML = `
            <span class="text-lg font-bold">${icons[type] || icons.info}</span>
            <span class="text-sm font-medium">${message}</span>
        `;

        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100px)'; setTimeout(() => toast.remove(), 400); }, 3500);
    }
}

// Export global instance
const teacherApp = new TeacherDashboard();
