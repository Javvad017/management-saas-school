/**
 * Unified Auth Guard for Student + Teacher Portal
 * Handles role detection, routing, and page protection
 */

const AUTH_CONFIG = {
    loginPage: '/login.html',
    studentDashboard: '/dashboard.html',
    teacherDashboard: '/teacher/dashboard.html',
    studentPages: ['dashboard.html', 'attendance.html', 'fees.html', 'results.html', 'notifications.html', 'settings.html'],
    teacherPages: ['teacher/dashboard.html', 'teacher/attendance.html', 'teacher/homework.html', 'teacher/marks.html']
};

class AuthGuard {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = JSON.parse(localStorage.getItem('user') || '{}');
    }

    /** Get current user role */
    getRole() {
        return (this.user.role || '').toLowerCase();
    }

    /** Check if user is logged in */
    isAuthenticated() {
        return !!this.token && !!this.user.role;
    }

    /** Check if current user is a student */
    isStudent() {
        return this.getRole() === 'student';
    }

    /** Check if current user is a teacher */
    isTeacher() {
        return this.getRole() === 'teacher';
    }

    /** Redirect to the correct dashboard based on role */
    redirectToDashboard() {
        if (this.isStudent()) {
            window.location.href = this.resolveBasePath() + 'dashboard.html';
        } else if (this.isTeacher()) {
            window.location.href = this.resolveBasePath() + 'teacher/dashboard.html';
        } else {
            // For admin or unknown roles, stay on login
            this.logout();
        }
    }

    /** Resolve the base path (handles being in subdirectories) */
    resolveBasePath() {
        const path = window.location.pathname;
        if (path.includes('/teacher/')) {
            return '../';
        }
        return '';
    }

    /** Get the login page path */
    getLoginPath() {
        const path = window.location.pathname;
        if (path.includes('/teacher/')) {
            return '../login.html';
        }
        return 'login.html';
    }

    /** Protect a student-only page */
    requireStudent() {
        if (!this.isAuthenticated()) {
            window.location.href = this.getLoginPath();
            return false;
        }
        if (!this.isStudent()) {
            // Teacher trying to access student page
            this.redirectToDashboard();
            return false;
        }
        return true;
    }

    /** Protect a teacher-only page */
    requireTeacher() {
        if (!this.isAuthenticated()) {
            window.location.href = this.getLoginPath();
            return false;
        }
        if (!this.isTeacher()) {
            // Student trying to access teacher page
            this.redirectToDashboard();
            return false;
        }
        return true;
    }

    /** Protect any authenticated page (student or teacher) */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = this.getLoginPath();
            return false;
        }
        return true;
    }

    /** Login and redirect based on role */
    async login(email, password) {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        const role = (data.data.role || '').toLowerCase();

        // Only allow Student and Teacher roles
        if (role !== 'student' && role !== 'teacher') {
            throw new Error('Access denied. This portal is for Students and Teachers only.');
        }

        // Store auth data
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));

        this.token = data.data.token;
        this.user = data.data;

        return data.data;
    }

    /** Logout */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.token = null;
        this.user = {};
        window.location.href = this.getLoginPath();
    }

    /** Get user display info */
    getUserInfo() {
        return {
            name: this.user.name || 'User',
            email: this.user.email || '',
            role: this.user.role || 'Unknown',
            roleLabel: this.isTeacher() ? 'Teacher' : 'Student',
            schoolId: this.user.schoolId || '',
            id: this.user._id || '',
            initial: (this.user.name || 'U').charAt(0).toUpperCase()
        };
    }
}

// Export singleton
const auth = new AuthGuard();
