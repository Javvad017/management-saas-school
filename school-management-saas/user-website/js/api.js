/**
 * Unified API Service for Student + Teacher Portal
 * Handles all backend communication with auth, error handling, and auto-refresh
 */

const API_BASE = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
        this.refreshInterval = null;
    }

    /** Get auth headers */
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    /** Check if user is authenticated */
    isAuthenticated() {
        return !!this.token;
    }

    /** Get login page path (handles subdirectories) */
    getLoginPath() {
        return window.location.pathname.includes('/teacher/') ? '../login.html' : 'login.html';
    }

    /** Redirect to login if not authenticated */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = this.getLoginPath();
            return false;
        }
        return true;
    }

    /** Generic fetch wrapper with error handling */
    async request(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                headers: this.getHeaders(),
                ...options
            });

            if (response.status === 401) {
                this.logout();
                return null;
            }

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `Request failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error.message);
            throw error;
        }
    }

    /** POST request */
    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    /** PUT request */
    async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    // ==================== STUDENT ENDPOINTS ====================

    async getDashboard() {
        return this.request('/student-portal/dashboard');
    }

    async getAttendance() {
        return this.request('/student-portal/attendance');
    }

    async getFees() {
        return this.request('/student-portal/fees');
    }

    async getResults() {
        return this.request('/student-portal/results');
    }

    async getProfile() {
        return this.request('/student-portal/profile');
    }

    async getHomework() {
        return this.request('/student-portal/homework');
    }

    async getAnnouncements() {
        return this.request('/student-portal/announcements');
    }

    // ==================== TEACHER ENDPOINTS ====================

    /** GET all students (for attendance marking) */
    async getStudents(filters = {}) {
        const params = new URLSearchParams();
        if (filters.class) params.set('class', filters.class);
        if (filters.section) params.set('section', filters.section);
        const qs = params.toString();
        return this.request(`/students${qs ? '?' + qs : ''}`);
    }

    /** POST mark attendance */
    async markAttendance(attendanceRecords) {
        return this.post('/attendance/mark', { attendance: attendanceRecords });
    }

    /** GET attendance records */
    async getAttendanceRecords() {
        return this.request('/attendance');
    }

    /** GET all homework */
    async getAllHomework() {
        return this.request('/homework');
    }

    /** POST create homework */
    async createHomework(homeworkData) {
        return this.post('/homework', homeworkData);
    }

    /** GET all exams */
    async getExams() {
        return this.request('/exams');
    }

    /** POST add result/marks */
    async addResult(resultData) {
        return this.post('/exams/results', resultData);
    }

    /** GET exam results */
    async getExamResults(examId) {
        return this.request(`/exams/${examId}/results`);
    }

    /** GET sections (optionally by class) */
    async getSections(classFilter) {
        const qs = classFilter ? `?class=${classFilter}` : '';
        return this.request(`/sections${qs}`);
    }

    /** POST create section */
    async createSection(sectionData) {
        return this.post('/sections', sectionData);
    }

    // ==================== SHARED ====================

    /** Logout and clear storage */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        window.location.href = this.getLoginPath();
    }

    /** Start auto-refresh for real-time data */
    startAutoRefresh(callback, intervalMs = 10000) {
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        this.refreshInterval = setInterval(callback, intervalMs);
        return this.refreshInterval;
    }

    /** Stop auto-refresh */
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    /** Get user display info */
    getUserInfo() {
        const role = (this.user.role || 'User');
        return {
            name: this.user.name || 'User',
            email: this.user.email || '',
            role: role,
            roleLabel: role.charAt(0).toUpperCase() + role.slice(1),
            class: this.user.class || '',
            section: this.user.section || '',
            initial: (this.user.name || 'U').charAt(0).toUpperCase()
        };
    }
}

// Export singleton instance
const api = new ApiService();
