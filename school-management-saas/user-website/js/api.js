/**
 * Centralized API Service for Student Portal
 * Handles all backend communication with auth, error handling, and retry logic
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

    /** Redirect to login if not authenticated */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
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

    /** GET student dashboard data */
    async getDashboard() {
        return this.request('/student-portal/dashboard');
    }

    /** GET student attendance records */
    async getAttendance() {
        return this.request('/student-portal/attendance');
    }

    /** GET student fee records */
    async getFees() {
        return this.request('/student-portal/fees');
    }

    /** GET student exam results */
    async getResults() {
        return this.request('/student-portal/results');
    }

    /** GET student profile */
    async getProfile() {
        return this.request('/student-portal/profile');
    }

    /** GET student homework */
    async getHomework() {
        return this.request('/student-portal/homework');
    }

    /** GET student announcements */
    async getAnnouncements() {
        return this.request('/student-portal/announcements');
    }

    /** Logout and clear storage */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (this.refreshInterval) clearInterval(this.refreshInterval);
        window.location.href = 'login.html';
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
        return {
            name: this.user.name || 'Student',
            email: this.user.email || '',
            role: this.user.role || 'Student',
            class: this.user.class || '',
            section: this.user.section || '',
            initial: (this.user.name || 'S').charAt(0).toUpperCase()
        };
    }
}

// Export singleton instance
const api = new ApiService();
