/**
 * Chart.js Analytics Module for Student Dashboard
 * Creates and manages all dashboard charts with smooth animations
 */

class DashboardCharts {
    constructor() {
        this.charts = {};
        this.defaultColors = {
            primary: '#6366f1',
            primaryLight: '#818cf8',
            primaryFaded: 'rgba(99,102,241,0.1)',
            accent: '#8b5cf6',
            success: '#10b981',
            successLight: '#34d399',
            successFaded: 'rgba(16,185,129,0.1)',
            warning: '#f59e0b',
            warningFaded: 'rgba(245,158,11,0.1)',
            danger: '#ef4444',
            dangerFaded: 'rgba(239,68,68,0.1)',
            info: '#0ea5e9',
            infoFaded: 'rgba(14,165,233,0.1)',
            gray: '#94a3b8',
            grayLight: '#e2e8f0'
        };
    }

    /** Create attendance line chart */
    createAttendanceChart(canvasId, data = null) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.charts.attendance) this.charts.attendance.destroy();

        // Generate sample or real data
        const labels = data?.labels || this.getLastNDays(14);
        const values = data?.values || this.generateAttendanceSample(14);

        this.charts.attendance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Attendance',
                    data: values,
                    borderColor: this.defaultColors.primary,
                    backgroundColor: (context) => {
                        const chart = context.chart;
                        const { ctx: c, chartArea } = chart;
                        if (!chartArea) return this.defaultColors.primaryFaded;
                        const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                        gradient.addColorStop(0, 'rgba(99,102,241,0.25)');
                        gradient.addColorStop(1, 'rgba(99,102,241,0.02)');
                        return gradient;
                    },
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: this.defaultColors.primary,
                    pointHoverBorderWidth: 3,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f8fafc',
                        bodyColor: '#e2e8f0',
                        padding: 12,
                        cornerRadius: 10,
                        displayColors: false,
                        titleFont: { weight: '600', size: 13 },
                        bodyFont: { size: 12 },
                        callbacks: {
                            label: (ctx) => `Status: ${ctx.raw === 1 ? 'Present ✓' : 'Absent ✗'}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 11, weight: '500' },
                            maxTicksLimit: 7
                        },
                        border: { display: false }
                    },
                    y: {
                        min: -0.1,
                        max: 1.3,
                        grid: {
                            color: 'rgba(0,0,0,0.04)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 11 },
                            stepSize: 1,
                            callback: (v) => v === 1 ? 'Present' : v === 0 ? 'Absent' : ''
                        },
                        border: { display: false }
                    }
                },
                animation: {
                    duration: 1200,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    /** Create subject performance bar chart */
    createPerformanceChart(canvasId, data = null) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.charts.performance) this.charts.performance.destroy();

        const labels = data?.labels || ['Mathematics', 'Science', 'English', 'History', 'Computer Sc.'];
        const values = data?.values || [85, 72, 90, 68, 78];

        const barColors = [
            this.defaultColors.primary,
            this.defaultColors.accent,
            this.defaultColors.success,
            this.defaultColors.warning,
            this.defaultColors.info
        ];

        this.charts.performance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Marks (%)',
                    data: values,
                    backgroundColor: barColors.map(c => c + '22'),
                    borderColor: barColors,
                    borderWidth: 2,
                    borderRadius: 10,
                    borderSkipped: false,
                    barPercentage: 0.6,
                    categoryPercentage: 0.7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f8fafc',
                        bodyColor: '#e2e8f0',
                        padding: 12,
                        cornerRadius: 10,
                        displayColors: false,
                        titleFont: { weight: '600', size: 13 },
                        callbacks: {
                            label: (ctx) => `Score: ${ctx.raw}%`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 11, weight: '500' }
                        },
                        border: { display: false }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        grid: {
                            color: 'rgba(0,0,0,0.04)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 11 },
                            stepSize: 25,
                            callback: (v) => v + '%'
                        },
                        border: { display: false }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    /** Create fees doughnut chart */
    createFeesChart(canvasId, paid = 0, pending = 0) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        if (this.charts.fees) this.charts.fees.destroy();

        // Use sample data if both are 0
        if (paid === 0 && pending === 0) {
            paid = 35000;
            pending = 15000;
        }

        const total = paid + pending;
        const paidPercent = total > 0 ? Math.round((paid / total) * 100) : 0;

        this.charts.fees = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Paid', 'Pending'],
                datasets: [{
                    data: [paid, pending],
                    backgroundColor: [this.defaultColors.success, this.defaultColors.danger],
                    borderColor: ['#fff', '#fff'],
                    borderWidth: 4,
                    hoverOffset: 6,
                    spacing: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'rectRounded',
                            font: { size: 12, weight: '500' },
                            color: '#64748b'
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1e293b',
                        titleColor: '#f8fafc',
                        bodyColor: '#e2e8f0',
                        padding: 12,
                        cornerRadius: 10,
                        displayColors: true,
                        callbacks: {
                            label: (ctx) => ` ₹${ctx.raw.toLocaleString()}`
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1200,
                    easing: 'easeOutQuart'
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw(chart) {
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return;
                    const centerX = (chartArea.left + chartArea.right) / 2;
                    const centerY = (chartArea.top + chartArea.bottom) / 2 - 6;

                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    ctx.font = '800 28px Inter, sans-serif';
                    ctx.fillStyle = '#0f172a';
                    ctx.fillText(`${paidPercent}%`, centerX, centerY);

                    ctx.font = '500 11px Inter, sans-serif';
                    ctx.fillStyle = '#94a3b8';
                    ctx.fillText('PAID', centerX, centerY + 20);

                    ctx.restore();
                }
            }]
        });
    }

    /** Update attendance chart with real data */
    updateAttendanceChart(attendanceRecords) {
        if (!attendanceRecords || attendanceRecords.length === 0) {
            this.createAttendanceChart('attendanceChart');
            return;
        }

        const sorted = [...attendanceRecords].sort((a, b) => new Date(a.date) - new Date(b.date));
        const last14 = sorted.slice(-14);

        const labels = last14.map(r =>
            new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        );
        const values = last14.map(r => r.status === 'present' ? 1 : 0);

        this.createAttendanceChart('attendanceChart', { labels, values });
    }

    /** Update performance chart with real results */
    updatePerformanceChart(results) {
        if (!results || results.length === 0) {
            this.createPerformanceChart('performanceChart');
            return;
        }

        // Group by subject and average marks
        const subjectMap = {};
        results.forEach(r => {
            const subject = r.examId?.subject || r.subject || 'Unknown';
            if (!subjectMap[subject]) subjectMap[subject] = { total: 0, count: 0 };
            const percent = r.totalMarks > 0 ? (r.marksObtained / r.totalMarks) * 100 : 0;
            subjectMap[subject].total += percent;
            subjectMap[subject].count++;
        });

        const labels = Object.keys(subjectMap).slice(0, 6);
        const values = labels.map(s => Math.round(subjectMap[s].total / subjectMap[s].count));

        this.createPerformanceChart('performanceChart', { labels, values });
    }

    /** Update fees doughnut with real data */
    updateFeesChart(paidAmount, pendingAmount) {
        this.createFeesChart('feesChart', paidAmount, pendingAmount);
    }

    /** Helper: get last N days as labels */
    getLastNDays(n) {
        const days = [];
        for (let i = n - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            days.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        return days;
    }

    /** Helper: generate sample attendance data */
    generateAttendanceSample(n) {
        return Array.from({ length: n }, () => Math.random() > 0.15 ? 1 : 0);
    }

    /** Destroy all charts */
    destroyAll() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
}

// Export singleton instance
const dashboardCharts = new DashboardCharts();
