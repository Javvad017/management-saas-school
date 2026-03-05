/**
 * Dashboard Logic Module
 * Handles data loading, real-time refresh, notifications, and UI updates
 */

class DashboardManager {
    constructor() {
        this.notifications = [];
        this.lastRefresh = null;
        this.isLoading = false;
    }

    /** Initialize dashboard */
    async init() {
        if (!api.requireAuth()) return;
        this.setupUserInfo();
        this.setupLogout();
        this.setupNotificationToggle();
        await this.loadDashboardData();
        this.startAutoRefresh();
    }

    /** Set user info in navbar */
    setupUserInfo() {
        const info = api.getUserInfo();
        const nameEl = document.getElementById('user-display-name');
        const roleEl = document.getElementById('user-role');
        const avatarEl = document.getElementById('user-avatar');
        const welcomeEl = document.getElementById('welcome-name');

        if (nameEl) nameEl.textContent = info.name;
        if (roleEl) roleEl.textContent = `Class ${info.class || '-'} ${info.section || ''}`.trim();
        if (avatarEl) avatarEl.textContent = info.initial;
        if (welcomeEl) welcomeEl.textContent = info.name;
    }

    /** Setup logout handler */
    setupLogout() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                api.logout();
            });
        }
    }

    /** Toggle notification dropdown */
    setupNotificationToggle() {
        const bellBtn = document.getElementById('notification-bell');
        const dropdown = document.getElementById('notification-dropdown');
        if (!bellBtn || !dropdown) return;

        bellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !bellBtn.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        const markReadBtn = document.getElementById('mark-all-read');
        if (markReadBtn) {
            markReadBtn.addEventListener('click', () => {
                document.querySelectorAll('.notification-item.unread').forEach(el => {
                    el.classList.remove('unread');
                });
                const badge = bellBtn.querySelector('.badge');
                if (badge) badge.style.display = 'none';
            });
        }
    }

    /** Load all dashboard data */
    async loadDashboardData() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            // Fetch all data concurrently
            const [dashRes, attendRes, feesRes, resultsRes] = await Promise.allSettled([
                api.getDashboard(),
                api.getAttendance(),
                api.getFees(),
                api.getResults()
            ]);

            // Process dashboard data
            if (dashRes.status === 'fulfilled' && dashRes.value?.data) {
                this.updateDashboardCards(dashRes.value.data);
                this.updateActivityFeed(dashRes.value.data);
                this.updateNotifications(dashRes.value.data);
            }

            // Process attendance for chart
            if (attendRes.status === 'fulfilled' && attendRes.value?.data) {
                const attData = attendRes.value.data;
                dashboardCharts.updateAttendanceChart(attData.attendance || []);

                // Also update stats if dashboard didn't have them
                if (attData.stats) {
                    this.updateElement('attendance-percentage', attData.stats.percentage + '%');
                    this.updateElement('present-count', attData.stats.presentDays);
                }
            } else {
                dashboardCharts.createAttendanceChart('attendanceChart');
            }

            // Process results for performance chart
            if (resultsRes.status === 'fulfilled' && resultsRes.value?.data) {
                dashboardCharts.updatePerformanceChart(resultsRes.value.data);
            } else {
                dashboardCharts.createPerformanceChart('performanceChart');
            }

            // Process fees for doughnut chart
            if (feesRes.status === 'fulfilled' && feesRes.value?.data?.summary) {
                const feesSummary = feesRes.value.data.summary;
                dashboardCharts.updateFeesChart(feesSummary.paidAmount, feesSummary.pendingAmount);
                this.updateElement('fees-due-amount', '₹' + (feesSummary.pendingAmount || 0).toLocaleString());
            } else {
                dashboardCharts.createFeesChart('feesChart');
            }

            this.lastRefresh = new Date();
            this.updateRefreshTime();

        } catch (error) {
            console.error('Dashboard load error:', error);
            // Still init charts with sample data
            dashboardCharts.createAttendanceChart('attendanceChart');
            dashboardCharts.createPerformanceChart('performanceChart');
            dashboardCharts.createFeesChart('feesChart');
        } finally {
            this.isLoading = false;
        }
    }

    /** Update stat cards from dashboard API */
    updateDashboardCards(data) {
        // Attendance percentage
        if (data.recentAttendance) {
            const total = data.recentAttendance.length;
            const present = data.recentAttendance.filter(a => a.status === 'present').length;
            const rate = total > 0 ? Math.round((present / total) * 100) : 0;
            this.updateElement('attendance-percentage', rate + '%');
            this.updateElement('attendance-trend', rate >= 80 ? '↑ Good' : '↓ Low');
        }

        // Fees due
        if (data.pendingFees) {
            const totalPending = data.pendingFees.reduce((sum, f) => sum + (f.amount - (f.paidAmount || 0)), 0);
            this.updateElement('fees-due-amount', '₹' + totalPending.toLocaleString());
            this.updateElement('fees-trend', totalPending > 0 ? `${data.pendingFees.length} pending` : 'All clear');
        }

        // Subjects (from homework data)
        if (data.recentHomework) {
            const subjects = new Set(data.recentHomework.map(h => h.subject));
            this.updateElement('subjects-count', subjects.size || '5');
            this.updateElement('subjects-trend', 'This semester');
        }

        // Student info
        if (data.student) {
            this.updateElement('student-class-display', `Class ${data.student.class || ''} ${data.student.section || ''}`);
        }

        // Upcoming exams
        this.updateElement('exams-count', data.upcomingExams || '2');
        this.updateElement('exams-trend', 'This month');
    }

    /** Update recent activity feed */
    updateActivityFeed(data) {
        const container = document.getElementById('activity-feed');
        if (!container) return;

        const activities = [];

        // Add attendance activity
        if (data.recentAttendance && data.recentAttendance.length > 0) {
            const latest = data.recentAttendance[0];
            activities.push({
                icon: 'check-circle',
                iconBg: 'bg-emerald-50',
                iconColor: 'text-emerald-500',
                title: `Attendance marked: ${latest.status}`,
                desc: new Date(latest.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
                time: this.timeAgo(latest.date)
            });
        }

        // Add homework activity
        if (data.recentHomework && data.recentHomework.length > 0) {
            data.recentHomework.slice(0, 2).forEach(hw => {
                activities.push({
                    icon: 'book-open',
                    iconBg: 'bg-violet-50',
                    iconColor: 'text-violet-500',
                    title: `New homework: ${hw.subject || 'Subject'}`,
                    desc: hw.title || 'Assignment posted',
                    time: this.timeAgo(hw.createdAt)
                });
            });
        }

        // Add announcement activity
        if (data.recentAnnouncements && data.recentAnnouncements.length > 0) {
            data.recentAnnouncements.slice(0, 2).forEach(ann => {
                activities.push({
                    icon: 'megaphone',
                    iconBg: 'bg-sky-50',
                    iconColor: 'text-sky-500',
                    title: ann.title || 'Announcement',
                    desc: ann.message ? ann.message.substring(0, 60) + '...' : 'View details',
                    time: this.timeAgo(ann.createdAt)
                });
            });
        }

        // Add fee activity
        if (data.pendingFees && data.pendingFees.length > 0) {
            activities.push({
                icon: 'currency',
                iconBg: 'bg-amber-50',
                iconColor: 'text-amber-500',
                title: 'Fee reminder',
                desc: `₹${data.pendingFees[0].amount?.toLocaleString()} pending`,
                time: 'Due soon'
            });
        }

        // Default activities if none from API
        if (activities.length === 0) {
            activities.push(
                { icon: 'check-circle', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500', title: 'Attendance marked today', desc: 'Present for all classes', time: '2h ago' },
                { icon: 'book-open', iconBg: 'bg-violet-50', iconColor: 'text-violet-500', title: 'New exam result published', desc: 'Mathematics - Mid Term', time: '5h ago' },
                { icon: 'currency', iconBg: 'bg-amber-50', iconColor: 'text-amber-500', title: 'Fee payment reminder', desc: 'Tuition fee due on March 15', time: '1d ago' },
                { icon: 'megaphone', iconBg: 'bg-sky-50', iconColor: 'text-sky-500', title: 'Sports day announced', desc: 'Annual sports day on March 20', time: '2d ago' }
            );
        }

        container.innerHTML = activities.map(a => this.renderActivityItem(a)).join('');
    }

    /** Render a single activity item */
    renderActivityItem(activity) {
        return `
      <div class="activity-item">
        <div class="activity-icon ${activity.iconBg}">
          ${this.getActivitySvg(activity.icon, activity.iconColor)}
        </div>
        <div class="activity-info">
          <div class="activity-title">${activity.title}</div>
          <div class="activity-desc">${activity.desc}</div>
        </div>
        <span class="activity-time">${activity.time}</span>
      </div>
    `;
    }

    /** Get SVG icon for activity */
    getActivitySvg(type, colorClass) {
        const svgs = {
            'check-circle': `<svg class="w-5 h-5 ${colorClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
            'book-open': `<svg class="w-5 h-5 ${colorClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`,
            'currency': `<svg class="w-5 h-5 ${colorClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
            'megaphone': `<svg class="w-5 h-5 ${colorClass}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>`
        };
        return svgs[type] || svgs['check-circle'];
    }

    /** Update notification dropdown */
    updateNotifications(data) {
        const list = document.getElementById('notification-list');
        if (!list) return;

        const notifications = [];

        if (data.recentAnnouncements) {
            data.recentAnnouncements.slice(0, 3).forEach(ann => {
                notifications.push({
                    title: ann.title || 'New Announcement',
                    desc: ann.message ? ann.message.substring(0, 50) : 'View details',
                    time: this.timeAgo(ann.createdAt),
                    type: 'info',
                    unread: true
                });
            });
        }

        if (data.pendingFees && data.pendingFees.length > 0) {
            notifications.push({
                title: 'Fee Payment Due',
                desc: `₹${data.pendingFees[0].amount?.toLocaleString()} payment reminder`,
                time: 'Action needed',
                type: 'warning',
                unread: true
            });
        }

        if (data.recentAttendance && data.recentAttendance.length > 0) {
            const absent = data.recentAttendance.filter(a => a.status === 'absent');
            if (absent.length > 0) {
                notifications.push({
                    title: 'Attendance Alert',
                    desc: `${absent.length} absent day${absent.length > 1 ? 's' : ''} this period`,
                    time: this.timeAgo(absent[0].date),
                    type: 'danger',
                    unread: true
                });
            }
        }

        // Defaults
        if (notifications.length === 0) {
            notifications.push(
                { title: 'New result published', desc: 'Mathematics mid-term results are out', time: '2h ago', type: 'info', unread: true },
                { title: 'Attendance alert', desc: 'Your attendance is below 80%', time: '5h ago', type: 'danger', unread: true },
                { title: 'Fee reminder', desc: 'Tuition fee due on March 15', time: '1d ago', type: 'warning', unread: false }
            );
        }

        const notifColors = {
            info: { bg: 'background: #eff6ff;', color: 'color: #3b82f6;' },
            warning: { bg: 'background: #fffbeb;', color: 'color: #f59e0b;' },
            danger: { bg: 'background: #fef2f2;', color: 'color: #ef4444;' },
            success: { bg: 'background: #ecfdf5;', color: 'color: #10b981;' }
        };

        list.innerHTML = notifications.map(n => {
            const colors = notifColors[n.type] || notifColors.info;
            return `
        <div class="notification-item ${n.unread ? 'unread' : ''}">
          <div class="notif-icon" style="${colors.bg}">
            <svg style="${colors.color}" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </div>
          <div class="notif-content">
            <div class="notif-title">${n.title}</div>
            <div class="notif-desc">${n.desc}</div>
            <div class="notif-time">${n.time}</div>
          </div>
        </div>
      `;
        }).join('');

        // Update badge count
        const unreadCount = notifications.filter(n => n.unread).length;
        const badge = document.querySelector('#notification-bell .badge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    /** Start auto-refresh every 10 seconds */
    startAutoRefresh() {
        api.startAutoRefresh(() => {
            this.loadDashboardData();
        }, 10000);
    }

    /** Update refresh timestamp */
    updateRefreshTime() {
        const el = document.getElementById('last-refresh');
        if (el && this.lastRefresh) {
            el.textContent = `Updated ${this.lastRefresh.toLocaleTimeString()}`;
        }
    }

    /** Safe element text update */
    updateElement(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    /** Time ago helper */
    timeAgo(dateStr) {
        if (!dateStr) return 'Just now';
        const now = new Date();
        const date = new Date(dateStr);
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

// Export singleton
const dashboard = new DashboardManager();
