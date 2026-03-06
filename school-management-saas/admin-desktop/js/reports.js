/**
 * Reports Module for Admin Desktop (Electron)
 * Real-time report generation with CSV/PDF export, Chart.js analytics, and auto-refresh
 */

const API_BASE = 'http://localhost:5000/api';

// ============ STATE ============
let reportsToken = sessionStorage.getItem('token');
let reportsRefreshInterval = null;
let currentReportData = null;
let currentReportType = null;
let reportCharts = {};

// ============ API HELPER ============
async function reportsApiFetch(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${reportsToken}`
        }
    });
    if (response.status === 401) {
        sessionStorage.removeItem('token');
        window.location.href = '../index.html';
        return null;
    }
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
}

// ============ REPORT GENERATORS ============

async function generateStudentReport() {
    showReportLoading('Student Report');
    try {
        const data = await reportsApiFetch('/students');
        const students = data?.data || [];
        currentReportData = students;
        currentReportType = 'student';

        const columns = ['#', 'Name', 'Roll No', 'Class', 'Section', 'Parent Name', 'Parent Phone', 'Address'];
        const rows = students.map((s, i) => [
            i + 1,
            s.userId?.name || s.name || 'N/A',
            s.rollNumber || '—',
            s.class || '—',
            s.section || '—',
            s.parentName || '—',
            s.parentPhone || '—',
            s.address || '—'
        ]);

        renderReportModal('Student Report', `${students.length} students found`, columns, rows, 'blue');
        updateQuickStat('report-stat-students', students.length);
    } catch (err) {
        showReportError('Student Report', err.message);
    }
}

async function generateAttendanceReport() {
    showReportLoading('Attendance Report');
    try {
        const data = await reportsApiFetch('/attendance');
        const attendance = data?.data || [];
        currentReportData = attendance;
        currentReportType = 'attendance';

        const columns = ['#', 'Student Name', 'Class', 'Date', 'Status', 'Remarks'];
        const rows = attendance.map((a, i) => [
            i + 1,
            a.studentId?.userId?.name || a.studentName || 'N/A',
            a.studentId?.class ? `${a.studentId.class}-${a.studentId.section || ''}` : '—',
            new Date(a.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            a.status || '—',
            a.remarks || '—'
        ]);

        const present = attendance.filter(a => (a.status || '').toLowerCase() === 'present').length;
        const absent = attendance.length - present;
        const rate = attendance.length > 0 ? ((present / attendance.length) * 100).toFixed(1) : 0;

        renderReportModal(
            'Attendance Report',
            `${attendance.length} records | Present: ${present} | Absent: ${absent} | Rate: ${rate}%`,
            columns, rows, 'green'
        );
        updateQuickStat('report-stat-attendance', rate + '%');
    } catch (err) {
        showReportError('Attendance Report', err.message);
    }
}

async function generateFeeReport() {
    showReportLoading('Fee Collection Report');
    try {
        const data = await reportsApiFetch('/fees');
        const fees = data?.data || [];
        currentReportData = fees;
        currentReportType = 'fees';

        const columns = ['#', 'Student', 'Fee Type', 'Amount (₹)', 'Paid (₹)', 'Due (₹)', 'Status', 'Due Date'];
        const rows = fees.map((f, i) => {
            const due = f.amount - (f.paidAmount || 0);
            return [
                i + 1,
                f.studentId?.userId?.name || 'N/A',
                f.feeType || '—',
                (f.amount || 0).toLocaleString(),
                (f.paidAmount || 0).toLocaleString(),
                due.toLocaleString(),
                f.status || (due <= 0 ? 'Paid' : 'Pending'),
                f.dueDate ? new Date(f.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
            ];
        });

        const totalAmount = fees.reduce((s, f) => s + (f.amount || 0), 0);
        const totalPaid = fees.reduce((s, f) => s + (f.paidAmount || 0), 0);
        const totalDue = totalAmount - totalPaid;

        renderReportModal(
            'Fee Collection Report',
            `Total: ₹${totalAmount.toLocaleString()} | Collected: ₹${totalPaid.toLocaleString()} | Pending: ₹${totalDue.toLocaleString()}`,
            columns, rows, 'yellow'
        );
        updateQuickStat('report-stat-fees', '₹' + totalPaid.toLocaleString());
    } catch (err) {
        showReportError('Fee Collection Report', err.message);
    }
}

async function generateTeacherReport() {
    showReportLoading('Teacher Report');
    try {
        const data = await reportsApiFetch('/teachers');
        const teachers = data?.data || [];
        currentReportData = teachers;
        currentReportType = 'teacher';

        const columns = ['#', 'Name', 'Employee ID', 'Subject', 'Phone', 'Qualification', 'Salary (₹)'];
        const rows = teachers.map((t, i) => [
            i + 1,
            t.userId?.name || t.name || 'N/A',
            t.employeeId || '—',
            t.subject || '—',
            t.phone || '—',
            t.qualification || '—',
            (t.salary || 0).toLocaleString()
        ]);

        renderReportModal('Teacher Report', `${teachers.length} teachers found`, columns, rows, 'purple');
        updateQuickStat('report-stat-teachers', teachers.length);
    } catch (err) {
        showReportError('Teacher Report', err.message);
    }
}

async function generateExamResultsReport() {
    showReportLoading('Exam Results Report');
    try {
        const data = await reportsApiFetch('/exams');
        const exams = data?.data || [];
        currentReportData = exams;
        currentReportType = 'exam';

        const columns = ['#', 'Exam Name', 'Subject', 'Class', 'Date', 'Total Marks', 'Status'];
        const rows = exams.map((e, i) => [
            i + 1,
            e.name || '—',
            e.subject || '—',
            e.class ? `${e.class}-${e.section || ''}` : '—',
            e.date ? new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
            e.totalMarks || '—',
            e.status || 'Scheduled'
        ]);

        renderReportModal('Exam Results Report', `${exams.length} exams found`, columns, rows, 'red');
    } catch (err) {
        showReportError('Exam Results Report', err.message);
    }
}

async function generateClassPerformanceReport() {
    showReportLoading('Class Performance Report');
    try {
        // Combine student + attendance data for class-wise analysis
        const [studentData, attendanceData, feeData] = await Promise.all([
            reportsApiFetch('/students'),
            reportsApiFetch('/attendance'),
            reportsApiFetch('/fees')
        ]);

        const students = studentData?.data || [];
        const attendance = attendanceData?.data || [];
        const fees = feeData?.data || [];
        currentReportType = 'classPerformance';

        // Group by class
        const classMap = {};
        students.forEach(s => {
            const key = `${s.class}-${s.section || 'A'}`;
            if (!classMap[key]) classMap[key] = { class: s.class, section: s.section || 'A', students: 0, present: 0, totalAttendance: 0, feesTotal: 0, feesPaid: 0 };
            classMap[key].students++;
        });

        // Add attendance stats
        attendance.forEach(a => {
            const student = students.find(s => s._id === (a.studentId?._id || a.studentId));
            if (student) {
                const key = `${student.class}-${student.section || 'A'}`;
                if (classMap[key]) {
                    classMap[key].totalAttendance++;
                    if ((a.status || '').toLowerCase() === 'present') classMap[key].present++;
                }
            }
        });

        // Add fee stats
        fees.forEach(f => {
            const student = students.find(s => s._id === (f.studentId?._id || f.studentId));
            if (student) {
                const key = `${student.class}-${student.section || 'A'}`;
                if (classMap[key]) {
                    classMap[key].feesTotal += f.amount || 0;
                    classMap[key].feesPaid += f.paidAmount || 0;
                }
            }
        });

        const classEntries = Object.values(classMap);
        currentReportData = classEntries;

        const columns = ['#', 'Class', 'Section', 'Students', 'Attendance Rate', 'Fees Collected', 'Fees Pending'];
        const rows = classEntries.map((c, i) => {
            const rate = c.totalAttendance > 0 ? ((c.present / c.totalAttendance) * 100).toFixed(1) + '%' : 'N/A';
            return [
                i + 1,
                c.class,
                c.section,
                c.students,
                rate,
                '₹' + c.feesPaid.toLocaleString(),
                '₹' + (c.feesTotal - c.feesPaid).toLocaleString()
            ];
        });

        renderReportModal('Class Performance Report', `${classEntries.length} classes analyzed`, columns, rows, 'indigo');
    } catch (err) {
        showReportError('Class Performance Report', err.message);
    }
}

// ============ RENDER REPORT MODAL ============

function renderReportModal(title, subtitle, columns, rows, color) {
    const modal = document.getElementById('report-modal');
    const titleEl = document.getElementById('report-modal-title');
    const subtitleEl = document.getElementById('report-modal-subtitle');
    const tableHead = document.getElementById('report-table-head');
    const tableBody = document.getElementById('report-table-body');
    const countEl = document.getElementById('report-record-count');

    titleEl.textContent = title;
    subtitleEl.textContent = subtitle;
    countEl.textContent = `${rows.length} records`;

    // Render table header
    tableHead.innerHTML = `<tr>${columns.map(c => `<th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50">${c}</th>`).join('')}</tr>`;

    // Render table body
    if (rows.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="${columns.length}" class="px-4 py-12 text-center text-gray-500">No data available</td></tr>`;
    } else {
        tableBody.innerHTML = rows.map((row, ri) => {
            return `<tr class="hover:bg-gray-50 transition-colors ${ri % 2 === 0 ? '' : 'bg-gray-50/50'}">
        ${row.map((cell, ci) => {
                let cellClass = 'px-4 py-3 text-sm text-gray-700';
                // Style status columns
                if (typeof cell === 'string') {
                    if (cell.toLowerCase() === 'present' || cell.toLowerCase() === 'paid') {
                        return `<td class="${cellClass}"><span class="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">${cell}</span></td>`;
                    }
                    if (cell.toLowerCase() === 'absent' || cell.toLowerCase() === 'pending') {
                        return `<td class="${cellClass}"><span class="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">${cell}</span></td>`;
                    }
                }
                if (ci === 0) cellClass += ' font-medium text-gray-400';
                return `<td class="${cellClass}">${cell}</td>`;
            }).join('')}
      </tr>`;
        }).join('');
    }

    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Update timestamp
    document.getElementById('report-generated-time').textContent =
        `Generated: ${new Date().toLocaleString()}`;
}

function closeReportModal() {
    const modal = document.getElementById('report-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function showReportLoading(title) {
    const modal = document.getElementById('report-modal');
    document.getElementById('report-modal-title').textContent = title;
    document.getElementById('report-modal-subtitle').textContent = 'Loading data...';
    document.getElementById('report-table-head').innerHTML = '';
    document.getElementById('report-table-body').innerHTML = `
    <tr><td class="px-4 py-16 text-center">
      <div class="inline-flex items-center gap-2 text-gray-500">
        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
        Fetching live data from server...
      </div>
    </td></tr>`;
    document.getElementById('report-record-count').textContent = '...';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function showReportError(title, message) {
    const modal = document.getElementById('report-modal');
    document.getElementById('report-modal-title').textContent = title;
    document.getElementById('report-modal-subtitle').textContent = 'Error loading report';
    document.getElementById('report-table-head').innerHTML = '';
    document.getElementById('report-table-body').innerHTML = `
    <tr><td class="px-4 py-12 text-center text-red-500">
      <svg class="w-10 h-10 mx-auto mb-2 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <p class="font-medium">Failed to load data</p>
      <p class="text-sm text-red-400 mt-1">${message}</p>
    </td></tr>`;
    document.getElementById('report-record-count').textContent = 'Error';
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// ============ CSV EXPORT ============

function exportCSV() {
    if (!currentReportData || currentReportData.length === 0) {
        alert('No data to export');
        return;
    }

    let csvContent = '';
    const type = currentReportType;

    if (type === 'student') {
        csvContent = 'Name,Roll No,Class,Section,Parent Name,Parent Phone,Address\n';
        currentReportData.forEach(s => {
            csvContent += `"${s.userId?.name || s.name || ''}","${s.rollNumber || ''}","${s.class || ''}","${s.section || ''}","${s.parentName || ''}","${s.parentPhone || ''}","${s.address || ''}"\n`;
        });
    } else if (type === 'attendance') {
        csvContent = 'Student Name,Class,Date,Status,Remarks\n';
        currentReportData.forEach(a => {
            csvContent += `"${a.studentId?.userId?.name || ''}","${a.studentId?.class || ''}","${new Date(a.date).toLocaleDateString()}","${a.status || ''}","${a.remarks || ''}"\n`;
        });
    } else if (type === 'fees') {
        csvContent = 'Student,Fee Type,Amount,Paid,Due,Status,Due Date\n';
        currentReportData.forEach(f => {
            const due = (f.amount || 0) - (f.paidAmount || 0);
            csvContent += `"${f.studentId?.userId?.name || ''}","${f.feeType || ''}",${f.amount || 0},${f.paidAmount || 0},${due},"${f.status || ''}","${f.dueDate ? new Date(f.dueDate).toLocaleDateString() : ''}"\n`;
        });
    } else if (type === 'teacher') {
        csvContent = 'Name,Employee ID,Subject,Phone,Qualification,Salary\n';
        currentReportData.forEach(t => {
            csvContent += `"${t.userId?.name || t.name || ''}","${t.employeeId || ''}","${t.subject || ''}","${t.phone || ''}","${t.qualification || ''}",${t.salary || 0}\n`;
        });
    } else if (type === 'exam') {
        csvContent = 'Exam Name,Subject,Class,Date,Total Marks,Status\n';
        currentReportData.forEach(e => {
            csvContent += `"${e.name || ''}","${e.subject || ''}","${e.class || ''}","${e.date ? new Date(e.date).toLocaleDateString() : ''}",${e.totalMarks || 0},"${e.status || ''}"\n`;
        });
    } else if (type === 'classPerformance') {
        csvContent = 'Class,Section,Students,Attendance Rate,Fees Collected,Fees Pending\n';
        currentReportData.forEach(c => {
            const rate = c.totalAttendance > 0 ? ((c.present / c.totalAttendance) * 100).toFixed(1) : 0;
            csvContent += `"${c.class}","${c.section}",${c.students},${rate}%,${c.feesPaid},${c.feesTotal - c.feesPaid}\n`;
        });
    }

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

// ============ PDF EXPORT ============

function exportPDF() {
    if (!currentReportData || currentReportData.length === 0) {
        alert('No data to export');
        return;
    }

    // Use jsPDF from CDN (loaded in HTML)
    if (typeof window.jspdf === 'undefined' && typeof jsPDF === 'undefined') {
        alert('PDF library is loading. Please try again in a moment.');
        return;
    }

    const { jsPDF } = window.jspdf || { jsPDF: window.jsPDF };
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape for wider tables

    const title = document.getElementById('report-modal-title').textContent;
    const subtitle = document.getElementById('report-modal-subtitle').textContent;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text(title, 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(subtitle, 14, 28);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);

    // Table data from current report modal
    const tableHead = document.getElementById('report-table-head');
    const tableBody = document.getElementById('report-table-body');

    const headers = Array.from(tableHead.querySelectorAll('th')).map(th => th.textContent.trim());
    const bodyRows = Array.from(tableBody.querySelectorAll('tr')).map(tr =>
        Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim())
    ).filter(row => row.length > 0);

    // Auto-table
    if (typeof doc.autoTable === 'function') {
        doc.autoTable({
            head: [headers],
            body: bodyRows,
            startY: 40,
            styles: { fontSize: 8, cellPadding: 3 },
            headStyles: { fillColor: [44, 62, 80], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [248, 249, 250] },
            margin: { left: 14, right: 14 }
        });
    } else {
        // Fallback: simple text table
        let y = 44;
        doc.setFontSize(8);
        doc.setTextColor(0);

        // Header row
        doc.setFillColor(44, 62, 80);
        doc.setTextColor(255);
        doc.rect(14, y - 4, 269, 8, 'F');
        headers.forEach((h, i) => {
            doc.text(h, 16 + (i * (269 / headers.length)), y);
        });
        y += 10;

        // Data rows
        doc.setTextColor(50);
        bodyRows.forEach((row, ri) => {
            if (y > 190) {
                doc.addPage();
                y = 20;
            }
            if (ri % 2 === 1) {
                doc.setFillColor(248, 249, 250);
                doc.rect(14, y - 4, 269, 7, 'F');
            }
            row.forEach((cell, ci) => {
                const cellText = (cell || '').substring(0, 30);
                doc.text(cellText, 16 + (ci * (269 / headers.length)), y);
            });
            y += 7;
        });
    }

    doc.save(`${currentReportType}_report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ============ QUICK STATS DASHBOARD ============

async function loadReportsDashboard() {
    try {
        const [studentRes, teacherRes, attendanceRes, feeRes] = await Promise.allSettled([
            reportsApiFetch('/students'),
            reportsApiFetch('/teachers'),
            reportsApiFetch('/attendance'),
            reportsApiFetch('/fees')
        ]);

        // Students
        if (studentRes.status === 'fulfilled') {
            const count = studentRes.value?.data?.length || 0;
            updateQuickStat('report-stat-students', count);
        }

        // Teachers
        if (teacherRes.status === 'fulfilled') {
            const count = teacherRes.value?.data?.length || 0;
            updateQuickStat('report-stat-teachers', count);
        }

        // Attendance rate
        if (attendanceRes.status === 'fulfilled') {
            const records = attendanceRes.value?.data || [];
            const present = records.filter(a => (a.status || '').toLowerCase() === 'present').length;
            const rate = records.length > 0 ? ((present / records.length) * 100).toFixed(1) : '0';
            updateQuickStat('report-stat-attendance', rate + '%');

            // Build attendance chart
            buildAttendanceChart(records);
        }

        // Fees collected
        if (feeRes.status === 'fulfilled') {
            const fees = feeRes.value?.data || [];
            const totalPaid = fees.reduce((s, f) => s + (f.paidAmount || 0), 0);
            updateQuickStat('report-stat-fees', '₹' + totalPaid.toLocaleString());

            // Build fee chart
            buildFeesChart(fees);
        }

        // Update timestamp
        const timeEl = document.getElementById('reports-last-refresh');
        if (timeEl) timeEl.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;

    } catch (err) {
        console.error('Reports dashboard error:', err);
    }
}

function updateQuickStat(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ============ CHART.JS ANALYTICS ============

function buildAttendanceChart(records) {
    const ctx = document.getElementById('reports-attendance-chart');
    if (!ctx) return;

    if (reportCharts.attendance) reportCharts.attendance.destroy();

    // Group by date
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

    reportCharts.attendance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Present',
                    data: presentData,
                    backgroundColor: 'rgba(16, 185, 129, 0.7)',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    borderRadius: 6
                },
                {
                    label: 'Absent',
                    data: absentData,
                    backgroundColor: 'rgba(239, 68, 68, 0.7)',
                    borderColor: '#ef4444',
                    borderWidth: 1,
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { usePointStyle: true, padding: 16, font: { size: 11 } } },
                tooltip: { backgroundColor: '#1e293b', cornerRadius: 8, padding: 10 }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } }, border: { display: false } },
                y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#94a3b8', font: { size: 10 } }, border: { display: false } }
            },
            animation: { duration: 800, easing: 'easeOutQuart' }
        }
    });
}

function buildFeesChart(fees) {
    const ctx = document.getElementById('reports-fees-chart');
    if (!ctx) return;

    if (reportCharts.fees) reportCharts.fees.destroy();

    const totalAmount = fees.reduce((s, f) => s + (f.amount || 0), 0);
    const totalPaid = fees.reduce((s, f) => s + (f.paidAmount || 0), 0);
    const totalPending = totalAmount - totalPaid;

    if (totalAmount === 0 && totalPaid === 0) return;

    const paidPct = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

    reportCharts.fees = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Collected', 'Pending'],
            datasets: [{
                data: [totalPaid, totalPending],
                backgroundColor: ['#10b981', '#ef4444'],
                borderColor: '#fff',
                borderWidth: 3,
                spacing: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12, font: { size: 11 } } },
                tooltip: {
                    backgroundColor: '#1e293b', cornerRadius: 8,
                    callbacks: { label: (ctx) => ` ₹${ctx.raw.toLocaleString()}` }
                }
            },
            animation: { animateRotate: true, duration: 1000 }
        },
        plugins: [{
            id: 'centerText',
            beforeDraw(chart) {
                const { ctx: c, chartArea } = chart;
                if (!chartArea) return;
                const cx = (chartArea.left + chartArea.right) / 2;
                const cy = (chartArea.top + chartArea.bottom) / 2 - 4;
                c.save();
                c.textAlign = 'center';
                c.font = 'bold 22px Inter, sans-serif';
                c.fillStyle = '#1e293b';
                c.fillText(paidPct + '%', cx, cy);
                c.font = '500 10px Inter, sans-serif';
                c.fillStyle = '#94a3b8';
                c.fillText('COLLECTED', cx, cy + 16);
                c.restore();
            }
        }]
    });
}

function buildClassPerformanceChart(classData) {
    const ctx = document.getElementById('reports-class-chart');
    if (!ctx) return;

    if (reportCharts.classPerf) reportCharts.classPerf.destroy();

    const labels = classData.map(c => `${c.class}-${c.section}`);
    const rates = classData.map(c =>
        c.totalAttendance > 0 ? ((c.present / c.totalAttendance) * 100).toFixed(1) : 0
    );

    const colors = ['#6366f1', '#8b5cf6', '#0ea5e9', '#f59e0b', '#10b981', '#ec4899'];

    reportCharts.classPerf = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Attendance Rate (%)',
                data: rates,
                backgroundColor: colors.map(c => c + '33'),
                borderColor: colors,
                borderWidth: 2,
                borderRadius: 8,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { backgroundColor: '#1e293b', cornerRadius: 8, callbacks: { label: c => `Rate: ${c.raw}%` } }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } }, border: { display: false } },
                y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#94a3b8', callback: v => v + '%' }, border: { display: false } }
            }
        }
    });
}

// ============ AUTO REFRESH ============

function startReportsAutoRefresh() {
    if (reportsRefreshInterval) clearInterval(reportsRefreshInterval);
    reportsRefreshInterval = setInterval(loadReportsData, 10000);
}

function stopReportsAutoRefresh() {
    if (reportsRefreshInterval) {
        clearInterval(reportsRefreshInterval);
        reportsRefreshInterval = null;
    }
}

async function loadReportsData() {
    await loadReportsDashboard();
}

// ============ PRINT REPORT ============

function printReport() {
    const printContent = document.getElementById('report-table-container').innerHTML;
    const title = document.getElementById('report-modal-title').textContent;
    const win = window.open('', '_blank');
    win.document.write(`
    <html><head><title>${title}</title>
    <style>
      body { font-family: -apple-system, sans-serif; padding: 20px; }
      h1 { font-size: 20px; color: #333; margin-bottom: 8px; }
      table { width: 100%; border-collapse: collapse; margin-top: 16px; }
      th, td { padding: 8px 12px; border: 1px solid #ddd; font-size: 12px; text-align: left; }
      th { background: #f5f5f5; font-weight: 600; }
      tr:nth-child(even) { background: #f9f9f9; }
      @media print { body { padding: 0; } }
    </style></head><body>
    <h1>${title}</h1>
    <p style="color:#666; font-size:12px;">Generated: ${new Date().toLocaleString()}</p>
    ${printContent}
    <script>window.print(); window.close();<\/script>
    </body></html>
  `);
}

// ============ INIT ============

function initReports() {
    loadReportsDashboard();
    startReportsAutoRefresh();
}
