# Super Admin Panel

Modern SaaS dashboard for School Management System administrators.

## 🚀 Quick Start

### 1. Start Backend
```bash
cd ../backend
node server.js
```

### 2. Open Login Page
Double-click: `login.html`

Or use a web server:
```bash
python -m http.server 8080
# Open: http://localhost:8080/login.html
```

### 3. Login
- **Email**: `admin@test.com`
- **Password**: `admin123`

## 📁 Files

```
super-admin-panel/
├── login.html              # Login page
├── dashboard.html          # Main dashboard
├── schools.html            # School management
├── revenue.html            # Revenue analytics
├── index.html              # Redirect to login
│
├── js/
│   ├── api.js             # API service class
│   ├── auth.js            # Authentication helper
│   ├── notifications.js   # Toast notifications
│   ├── charts.js          # Chart.js setup
│   │
│   └── pages/
│       ├── login.js       # Login page logic
│       ├── dashboard.js   # Dashboard logic
│       ├── schools.js     # Schools page logic
│       └── revenue.js     # Revenue page logic
```

## 🎨 Features

### Login Page
- Modern gradient design
- Form validation
- Error messages
- JWT authentication
- Role verification (SuperAdmin only)

### Dashboard
- Statistics cards:
  - Total schools
  - Active subscriptions
  - Monthly revenue
  - Active users
- Revenue trend chart (Chart.js)
- Recent schools list
- Quick actions

### Schools Management
- List all schools
- Create new school
- Edit school details
- Delete school
- Activate/deactivate school
- Search and filter
- Modal dialogs for CRUD

### Revenue Analytics
- Monthly revenue chart
- Revenue by school
- Subscription statistics
- Payment history
- Export data

## 🔐 Authentication

All API requests include JWT token:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

Token is stored in `localStorage` after login.

## 🎯 API Endpoints Used

### Auth
- `POST /api/auth/login` - Login

### Schools
- `GET /api/schools` - List schools
- `POST /api/schools` - Create school
- `PUT /api/schools/:id` - Update school
- `DELETE /api/schools/:id` - Delete school

### Dashboard
- `GET /api/dashboard/stats` - Get statistics

### Revenue
- `GET /api/revenue` - Get revenue data
- `GET /api/revenue/monthly` - Monthly revenue

## 🎨 Design

- **Framework**: TailwindCSS (CDN)
- **Charts**: Chart.js
- **Icons**: Heroicons (inline SVG)
- **Colors**: 
  - Primary: Indigo (600, 700)
  - Success: Green (500, 600)
  - Danger: Red (500, 600)
  - Warning: Yellow (500, 600)

## 🔧 Configuration

API base URL is set in `js/api.js`:
```javascript
const API_BASE = 'http://localhost:5000/api';
```

Change this for production:
```javascript
const API_BASE = 'https://api.yourdomain.com/api';
```

## 🐛 Troubleshooting

### "Failed to fetch"
1. Backend not running → Start backend
2. CORS issue → Check backend CORS config
3. Wrong API URL → Verify `API_BASE` in `js/api.js`

### "Invalid credentials"
- Email: `admin@test.com`
- Password: `admin123`
- Check for typos

### "Access denied"
Only SuperAdmin role can access this panel.

### Charts not showing
1. Check Chart.js CDN is loaded
2. Check browser console for errors
3. Verify data format from API

## 📱 Responsive Design

- Desktop: Full sidebar + content
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation

## 🚀 Deployment

### Build for Production
No build step needed - pure HTML/CSS/JS.

### Deploy to Web Server
1. Upload all files to web server
2. Update `API_BASE` in `js/api.js`
3. Configure CORS on backend
4. Set up HTTPS

### Environment Variables
Create `js/config.js`:
```javascript
const CONFIG = {
  API_BASE: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : 'https://api.yourdomain.com/api'
};
```

## 📊 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔒 Security

- JWT tokens in localStorage
- Role-based access control
- HTTPS in production
- Input validation
- XSS protection
- CSRF protection (backend)

## 📝 Notes

- This is a SPA (Single Page Application) without routing
- Each page is a separate HTML file
- Shared JS modules for common functionality
- TailwindCSS via CDN (no build step)
- Chart.js via CDN

## 🎉 Status

✅ **100% Complete**

All features implemented and tested.

---

**Ready to use!** Just start the backend and open `login.html`.
