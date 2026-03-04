# 🎨 Frontend Build Guide - Plain HTML/CSS/JS

## Overview

This guide provides complete frontend implementations using:
- **Plain HTML, CSS, JavaScript** for web portals
- **Electron** for Admin Desktop
- **Fetch API** for backend communication
- **JWT tokens** in localStorage

---

## 📁 Project Structure

```
school-management-saas/
├── backend/                    ✅ Existing (don't modify)
├── super-admin-panel/          ❌ Create new
├── admin-desktop/              ❌ Create new (Electron)
├── teacher-portal/             ❌ Create new
└── student-portal/             ❌ Create new
```

---

## 🚀 Quick Start

Each frontend is in a separate detailed guide:

1. **[SUPER_ADMIN_HTML_GUIDE.md](./SUPER_ADMIN_HTML_GUIDE.md)** - Super Admin Panel
2. **[ADMIN_DESKTOP_ELECTRON_GUIDE.md](./ADMIN_DESKTOP_ELECTRON_GUIDE.md)** - Admin Desktop
3. **[TEACHER_PORTAL_HTML_GUIDE.md](./TEACHER_PORTAL_HTML_GUIDE.md)** - Teacher Portal
4. **[STUDENT_PORTAL_HTML_GUIDE.md](./STUDENT_PORTAL_HTML_GUIDE.md)** - Student Portal

---

## 🔑 Shared API Helper

All frontends use this helper:

```javascript
// api.js
const API_URL = 'http://localhost:5000/api';

const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  get(endpoint) {
    return this.request(endpoint);
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
};
```

---

## 📚 Implementation Order

1. **Super Admin Panel** (2-3 hours)
2. **Student Portal** (2-3 hours)
3. **Admin Desktop** (4-5 hours)
4. **Teacher Portal** (2-3 hours)

Total: 10-14 hours

---

See individual guides for complete implementations.
