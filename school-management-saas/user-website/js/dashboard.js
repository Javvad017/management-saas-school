/**
 * Dashboard Logic Module
 * Handles data loading, real-time refresh, notifications, and UI updates
 */

class DashboardManager {
    constructor() {
        this.notifications = [];
        this.lastRefresh = null;
        this.isLoading = false;
        this.socket = null;
        this.refreshInterval = null;
    }

    /** Initialize dashboard */
    async init() {
        if (!api.requireAuth()) return;
        this.setupUserInfo();
        this.setupLogout();
        this.setupNotificationToggle();
        await this.loadDashboardData();
        this.startAutoRefresh();
        this.initSocketIO();
    }

    /** Initialize Socket.IO for real-time updates */
    initSocketIO() {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        try {
            // Load Socket.IO from CDN if not already loaded
            if (typeof io === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdn.socket.io/4.5.4/socket.io.min.js';
                script.onload = () => this.connectSocket(token);
                document.head.appendChild(script);
            } else {
                this.connectSocket(token);
            }
        } catch (error) {
            console.error('Socket.IO initialization error:', error);
        }
    }

    /** Connect to Socket.IO server */
    connectSocket(token) {
        try {
            this.socket = io('http://localhost:5000', {
                auth: { token }
            });

            this.socket.on('connect', () => {
                console.log('✅ Socket.IO connected');
                this.showToast('Connected to real-time updates', 'success');
            });

            this.socket.on('disconnect', () => {
                console.log('❌ Socket.IO disconnected');
            });

            // Listen for real-time events
            this.socket.on('attendanceUpdated', (data) => {
                console.log('📊 Attendance updated:', data);
                this.showToast('Attendance record updated', 'info');
                this.loadDashboardData();
            });

            this.socket.on('newHomework', (data) => {
                console.log('📚 New homework:', data);
                this.showToast(`New homework: ${data.subject}`, 'info');
                this.loadDashboardData();
            });

            this.socket.on('examResultsPublished', (data) => {
                console.log('📝 Exam results published:', data);
                this.showToast('New exam results available!', 'success');
                this.loadDashboardData();
            });

            this.socket.on('feeUpdated', (data) => {
                console.log('💰 Fee updated:', data);
                this.showToast('Fee status updated', 'info');
                this.loadDashboardData();
            });

            this.socket.on('newAnnouncement', (data) => {
                console.log('📢 New announcement:', data);
                this.showToast(`New announcement: ${data.title}`, 'info');
                this.loadDashboardData();
            });

        } catch (error) {
            console.error('Socket connection error:', error);
        }
    }

    /** Show toast notification */
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-amber-500',
            info: 'bg-blue-500'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${colors[type] || colors.info}`;
        toast.style.cssText = 'padding: 12px 20px; margin-bottom: 10px; border-radius: 8px; color: white; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease;';
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /** Set user info in navbar */
    async setupUserInfo() {
        try {
            const profileRes = await api.getProfile();
            if (profileRes?.success && profileRes.data) {
                const student = profileRes.data;
                const user = api.getUserInfo();
                
                const nameEl = document.getElementById('user-display-name');
                const roleEl = document.getElementById('user-role');
                const avatarEl = document.getElementById('user-avatar');
                const welcomeEl = document.getElementById('welcome-name');

                const displayName = user.name || 'Student';
                const classInfo = `Class ${student.class || ''} ${student.section || ''}`.trim();

                if (nameEl) nameEl.textContent = displayName;
                if (roleEl) roleEl.textContent = classInfo;
                if (avatarEl) avatarEl.textContent = displayName.charAt(0).toUpperCase();
                if (welcomeEl) welcomeEl.textContent = displayName;
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            // Fallback to stored user info
            const info = api.getUserInfo();
            const nameEl = document.getElementById('user-display-name');
            const roleEl = document.getElementById('user-role');
            const avatarEl = document.getElementById('user-avatar');
            const welcomeEl = document.getElementById('welcome-name');

            if (nameEl) nameEl.textContent = info.name;
            if (roleEl) roleEl.textContent = 'Student';
            if (avatarEl) avatarEl.textContent = info.initial;
            if (welcomeEl) welcomeEl.textContent = info.name;
        }
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
            const [dashRes, attendRes, feesRes, resultsRes, homeworkRes] = await Promise.allSettled([
                api.getDashboard(),
                api.getAttendance(),
                api.getFees(),
                api.getResults(),
                api.getHomework()
            ]);

            // Process dashboard data
            if (dashRes.status === 'fulfilled' && dashRes.value?.success) {
                const dashData = dashRes.value.data;
                this.updateDashboardCards(dashData);
                this.updateActivityFeed(dashData);
                this.updateNotifications(dashData);
            }

            // Process attendance for chart and stats
            if (attendRes.status === 'fulfilled' && attendRes.value?.success) {
                const attData = attendRes.value.data;
                
                // Update attendance percentage
                if (attData.stats) {
                    this.updateElement('attendance-percentage', Math.round(attData.stats.percentage) + '%');
                    const trend = attData.stats.percentage >= 80 ? '↑ Good' : attData.stats.percentage >= 60 ? '→ Fair' : '↓ Low';
                    this.updateElement('attendance-trend-badge', trend);
                    
                    const trendEl = document.getElementById('attendance-trend-badge');
                    if (trendEl) {
                        trendEl.className = 'stat-trend ' + (attData.stats.percentage >= 80 ? 'up' : attData.stats.percentage >= 60 ? 'neutral' : 'down');
                    }
                }

                // Update attendance chart
                if (attData.attendance && attData.attendance.length > 0) {
                    dashboardCharts.updateAttendanceChart(attData.attendance);
                } else {
                    dashboardCharts.createAttendanceChart('attendanceChart');
                }
            } else {
                dashboardCharts.createAttendanceChart('attendanceChart');
            }

            // Process fees for chart and stats
            if (feesRes.status === 'fulfilled' && feesRes.value?.success) {
                const feesData = feesRes.value.data;
                
                if (feesData.summary) {
                    const pending = feesData.summary.pendingAmount || 0;
                    const paid = feesData.summary.paidAmount || 0;
                    
                    this.updateElement('fees-due-amount', '₹' + pending.toLocaleString());
                    
                    const pendingCount = feesData.fees?.filter(f => f.status !== 'Paid').length || 0;
                    this.updateElement('fees-trend-badge', pendingCount > 0 ? `${pendingCount} pending` : 'All clear');
                    
                    // Update fees chart
                    dashboardCharts.updateFeesChart(paid, pending);
                } else {
                    dashboardCharts.createFeesChart('feesChart');
                }
            } else {
                dashboardCharts.createFeesChart('feesChart');
            }

            // Process results for performance chart
            if (resultsRes.status === 'fulfilled' && resultsRes.value?.success) {
                const results = resultsRes.value.data || [];
                if (results.length > 0) {
                    dashboardCharts.updatePerformanceChart(results);
                } else {
                    dashboardCharts.createPerformanceChart('performanceChart');
                }
            } else {
                dashboardCharts.createPerformanceChart('performanceChart');
            }

            // Process homework for subjects count
            if (homeworkRes.status === 'fulfilled' && homeworkRes.value?.success) {
                const homework = homeworkRes.value.data || [];
                const subjects = new Set(homework.map(h => h.subject));
                this.updateElement('subjects-count', subjects.size || '0');
                this.updateElement('subjects-trend-badge', 'This semester');
            }

            this.lastRefresh = new Date();
            this.updateRefreshTime();

        } catch (error) {
            console.error('Dashboard load error:', error);
            // Initialize charts with sample data on error
            dashboardCharts.createAttendanceChart('attendanceChart');
            dashboardCharts.createPerformanceChart('performanceChart');
            dashboardCharts.createFeesChart('feesChart');
        } finally {
            this.isLoading = false;
        }
    }

    /** Update stat cards from dashboard API */
    updateDashboardCards(data) {
        // Attendance percentage from recent attendance
        if (data.recentAttendance && data.recentAttendance.length > 0) {
            const total = data.recentAttendance.length;
            const present = data.recentAttendance.filter(a => {
                const status = (a.status || '').toLowerCase();
                return status === 'present';
            }).length;
            const rate = total > 0 ? Math.round((present / total) * 100) : 0;
            this.updateElement('attendance-percentage', rate + '%');
            
            const trend = rate >= 80 ? '↑ Good' : rate >= 60 ? '→ Fair' : '↓ Low';
            this.updateElement('attendance-trend-badge', trend);
            
            const trendEl = document.getElementById('attendance-trend-badge');
            if (trendEl) {
                trendEl.className = 'stat-trend ' + (rate >= 80 ? 'up' : rate >= 60 ? 'neutral' : 'down');
            }
        }

        // Fees due from pending fees
        if (data.pendingFees) {
            const totalPending = data.pendingFees.reduce((sum, f) => {
                const amount = f.amount || 0;
                const paid = f.paidAmount || 0;
                return sum + (amount - paid);
            }, 0);
            
            this.updateElement('fees-due-amount', '₹' + totalPending.toLocaleString());
            this.updateElement('fees-trend-badge', data.pendingFees.length > 0 ? `${data.pendingFees.length} pending` : 'All clear');
            
            const trendEl = document.getElementById('fees-trend-badge');
            if (trendEl) {
                trendEl.className = 'stat-trend ' + (data.pendingFees.length > 0 ? 'down' : 'up');
            }
        }

        // Subjects from homework data
        if (data.recentHomework && data.recentHomework.length > 0) {
            const subjects = new Set(data.recentHomework.map(h => h.subject).filter(Boolean));
            this.updateElement('subjects-count', subjects.size || '0');
            this.updateElement('subjects-trend-badge', 'This semester');
        }

        // Upcoming exams - calculate from current date
        // For now, show placeholder until we have exam data
        this.updateElement('exams-count', '0');
        this.updateElement('exams-trend-badge', 'This month');
    }

    /** Update recent activity feed */
    updateActivityFeed(data) {
        const container = document.getElementById('activity-feed');
        if (!container) return;

        const activities = [];

        // Add attendance activity
        if (data.recentAttendance && data.recentAttendance.length > 0) {
            const latest = data.recentAttendance[0];
            const status = (latest.status || 'Present').toLowerCase();
            const statusCapitalized = status.charAt(0).toUpperCase() + status.slice(1);
            
            activities.push({
                icon: 'check-circle',
                iconBg: status === 'present' ? 'bg-emerald-50' : 'bg-red-50',
                iconColor: status === 'present' ? 'text-emerald-500' : 'text-red-500',
                title: `Attendance marked: ${statusCapitalized}`,
                desc: new Date(latest.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
                time: this.timeAgo(latest.date)
            });
        }

        // Add homework activity
        if (data.recentHomework && data.recentHomework.length > 0) {
            data.recentHomework.slice(0, 2).forEach(hw => {
                const teacherName = hw.teacherId?.name || 'Teacher';
                activities.push({
                    icon: 'book-open',
                    iconBg: 'bg-violet-50',
                    iconColor: 'text-violet-500',
                    title: `New homework: ${hw.subject || 'Subject'}`,
                    desc: (hw.title || 'Assignment posted').substring(0, 60) + (hw.title?.length > 60 ? '...' : ''),
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
                    desc: ann.message ? ann.message.substring(0, 60) + (ann.message.length > 60 ? '...' : '') : 'View details',
                    time: this.timeAgo(ann.createdAt)
                });
            });
        }

        // Add fee activity
        if (data.pendingFees && data.pendingFees.length > 0) {
            const firstFee = data.pendingFees[0];
            const dueDate = new Date(firstFee.dueDate);
            const isOverdue = dueDate < new Date();
            
            activities.push({
                icon: 'currency',
                iconBg: isOverdue ? 'bg-red-50' : 'bg-amber-50',
                iconColor: isOverdue ? 'text-red-500' : 'text-amber-500',
                title: isOverdue ? 'Fee overdue!' : 'Fee payment reminder',
                desc: `₹${(firstFee.amount - (firstFee.paidAmount || 0)).toLocaleString()} - ${firstFee.feeType || 'Fee'}`,
                time: isOverdue ? 'Overdue' : `Due ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            });
        }

        // Show default message if no activities
        if (activities.length === 0) {
            container.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon bg-gray-50">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div class="activity-info">
                        <div class="activity-title">No recent activity</div>
                        <div class="activity-desc">Your activity will appear here</div>
                    </div>
                    <span class="activity-time">-</span>
                </div>
            `;
            return;
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

        // Add announcements as notifications
        if (data.recentAnnouncements && data.recentAnnouncements.length > 0) {
            data.recentAnnouncements.slice(0, 3).forEach(ann => {
                notifications.push({
                    title: ann.title || 'New Announcement',
                    desc: ann.message ? ann.message.substring(0, 50) + (ann.message.length > 50 ? '...' : '') : 'View details',
                    time: this.timeAgo(ann.createdAt),
                    type: 'info',
                    unread: true
                });
            });
        }

        // Add fee notifications
        if (data.pendingFees && data.pendingFees.length > 0) {
            const overdueFees = data.pendingFees.filter(f => new Date(f.dueDate) < new Date());
            const upcomingFees = data.pendingFees.filter(f => new Date(f.dueDate) >= new Date());
            
            if (overdueFees.length > 0) {
                notifications.push({
                    title: 'Fee Payment Overdue',
                    desc: `${overdueFees.length} overdue payment${overdueFees.length > 1 ? 's' : ''}`,
                    time: 'Action required',
                    type: 'danger',
                    unread: true
                });
            }
            
            if (upcomingFees.length > 0) {
                const nextFee = upcomingFees[0];
                notifications.push({
                    title: 'Fee Payment Due',
                    desc: `₹${(nextFee.amount - (nextFee.paidAmount || 0)).toLocaleString()} - ${nextFee.feeType || 'Fee'}`,
                    time: `Due ${new Date(nextFee.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
                    type: 'warning',
                    unread: true
                });
            }
        }

        // Add attendance alert if low
        if (data.recentAttendance && data.recentAttendance.length > 0) {
            const total = data.recentAttendance.length;
            const present = data.recentAttendance.filter(a => (a.status || '').toLowerCase() === 'present').length;
            const percentage = total > 0 ? (present / total) * 100 : 0;
            
            if (percentage < 75) {
                notifications.push({
                    title: 'Attendance Alert',
                    desc: `Your attendance is ${Math.round(percentage)}% (below 75%)`,
                    time: 'This month',
                    type: 'danger',
                    unread: true
                });
            }
        }

        // Add homework notifications
        if (data.recentHomework && data.recentHomework.length > 0) {
            const recentHw = data.recentHomework[0];
            const hwDate = new Date(recentHw.createdAt);
            const isRecent = (new Date() - hwDate) < 86400000; // Less than 24 hours
            
            if (isRecent) {
                notifications.push({
                    title: 'New Homework Assigned',
                    desc: `${recentHw.subject || 'Subject'} - ${recentHw.title || 'Assignment'}`,
                    time: this.timeAgo(recentHw.createdAt),
                    type: 'info',
                    unread: true
                });
            }
        }

        // Show default message if no notifications
        if (notifications.length === 0) {
            list.innerHTML = `
                <div class="notification-item">
                    <div class="notif-icon" style="background: #f3f4f6;">
                        <svg style="color: #9ca3af;" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div class="notif-content">
                        <div class="notif-title">No new notifications</div>
                        <div class="notif-desc">You're all caught up!</div>
                        <div class="notif-time">-</div>
                    </div>
                </div>
            `;
            
            // Update badge
            const badge = document.querySelector('#notification-bell .badge');
            if (badge) badge.style.display = 'none';
            
            return;
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
        const navBadge = document.getElementById('nav-notif-badge');
        const notifBadgeCount = document.getElementById('notif-badge-count');
        
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
        if (navBadge) {
            navBadge.textContent = unreadCount;
            navBadge.style.display = unreadCount > 0 ? 'inline-block' : 'none';
        }
        if (notifBadgeCount) {
            notifBadgeCount.textContent = unreadCount;
        }
    }

    /** Start auto-refresh every 30 seconds */
    startAutoRefresh() {
        // Clear any existing interval
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        // Refresh every 30 seconds
        this.refreshInterval = setInterval(() => {
            console.log('🔄 Auto-refreshing dashboard data...');
            this.loadDashboardData();
        }, 30000);

        console.log('✅ Auto-refresh enabled (30s interval)');
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

    /** Cleanup on page unload */
    cleanup() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}

// Export singleton
const dashboard = new DashboardManager();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    dashboard.cleanup();
});
