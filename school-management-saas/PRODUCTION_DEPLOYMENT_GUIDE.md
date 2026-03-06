# Production Deployment Guide - School Management SaaS

## Overview
This guide covers deploying the upgraded School Management SaaS platform to production with all security, scalability, and multi-tenant features enabled.

## Architecture Overview

```
Super Admin Panel (Vercel/Netlify)
    ↓
Backend API (Node.js + Express + MongoDB Atlas)
    ↓
├── School Admin Desktop (Electron)
├── Teacher Portal (Vercel/Netlify)
├── Student Portal (Vercel/Netlify)
└── User Website (Vercel/Netlify)
```

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account
- Domain name (optional but recommended)
- SSL certificate (Let's Encrypt or cloud provider)
- Cloud storage account (AWS S3 or Cloudinary) for production file uploads

## Step 1: Environment Configuration

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/school_saas?retryWrites=true&w=majority

# JWT Secrets (Generate strong secrets!)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_token_secret_min_32_characters_long
JWT_REFRESH_EXPIRE=30d

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS (Update with your actual domains)
CORS_ORIGIN=https://admin.yourschool.com,https://teacher.yourschool.com,https://student.yourschool.com

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs

# Subscription Limits
STARTER_MAX_STUDENTS=100
PRO_MAX_STUDENTS=500
ENTERPRISE_MAX_STUDENTS=10000
```

## Step 2: Database Setup (MongoDB Atlas)

1. Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (M10+ recommended for production)
3. Configure network access:
   - Add your server IP address
   - Or use 0.0.0.0/0 (less secure, use with authentication)
4. Create database user with read/write permissions
5. Get connection string and update MONGODB_URI in .env
6. Create indexes for performance:

```javascript
// Run these in MongoDB Atlas shell or via script
db.students.createIndex({ schoolId: 1, rollNumber: 1 }, { unique: true });
db.teachers.createIndex({ schoolId: 1, employeeId: 1 }, { unique: true });
db.fees.createIndex({ schoolId: 1, studentId: 1, month: 1, year: 1, feeType: 1 });
db.attendance.createIndex({ schoolId: 1, studentId: 1, date: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });
db.schools.createIndex({ email: 1 }, { unique: true });
```

## Step 3: Backend Deployment

### Option A: Deploy to VPS (DigitalOcean, AWS EC2, etc.)

1. **Install dependencies:**
```bash
cd backend
npm install --production
```

2. **Install PM2 for process management:**
```bash
npm install -g pm2
```

3. **Create PM2 ecosystem file (ecosystem.config.js):**
```javascript
module.exports = {
  apps: [{
    name: 'school-saas-api',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

4. **Start the application:**
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

5. **Setup Nginx as reverse proxy:**
```nginx
server {
    listen 80;
    server_name api.yourschool.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

6. **Setup SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourschool.com
```

### Option B: Deploy to Heroku

1. **Create Heroku app:**
```bash
heroku create school-saas-api
```

2. **Add MongoDB Atlas addon or use existing connection:**
```bash
heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
```

3. **Set environment variables:**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="your_secret"
# ... set all other env vars
```

4. **Deploy:**
```bash
git push heroku main
```

### Option C: Deploy to Railway/Render

1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

## Step 4: Frontend Deployment

### Super Admin Panel

1. **Update API endpoint in `super-admin-panel/src/services/api.js`:**
```javascript
const API_BASE = 'https://api.yourschool.com/api';
```

2. **Build:**
```bash
cd super-admin-panel
npm install
npm run build
```

3. **Deploy to Vercel:**
```bash
npm install -g vercel
vercel --prod
```

Or deploy to Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Teacher Portal & Student Portal

Follow same steps as Super Admin Panel for each portal.

### Admin Desktop (Electron)

1. **Update API endpoint in `admin-desktop/renderer.js` or config:**
```javascript
const API_BASE = 'https://api.yourschool.com/api';
```

2. **Build for production:**
```bash
cd admin-desktop
npm install
npm run build
```

3. **Package for distribution:**
```bash
npm install -g electron-builder
electron-builder --win --mac --linux
```

4. Distribute the installers to school admins

## Step 5: Security Hardening

### 1. Generate Strong Secrets
```bash
# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Enable HTTPS Only
- Ensure all frontend apps use HTTPS
- Set secure cookies in production
- Enable HSTS headers

### 3. Configure Firewall
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp  # HTTP
sudo ufw allow 443/tcp # HTTPS
sudo ufw enable
```

### 4. Database Security
- Use strong passwords
- Enable IP whitelisting
- Enable MongoDB authentication
- Regular backups

### 5. Rate Limiting
Already configured in the upgraded backend. Adjust limits in .env if needed.

## Step 6: Monitoring & Logging

### Setup Winston Logging
Logs are automatically written to `./logs` directory. Configure log rotation:

```javascript
// Already configured in backend/utils/logger.js
// Logs rotate at 5MB, keeps 5 files
```

### Monitor with PM2
```bash
pm2 monit
pm2 logs
```

### Setup Error Tracking (Optional)
Integrate Sentry or similar:
```bash
npm install @sentry/node
```

## Step 7: Backup Strategy

### Database Backups
```bash
# MongoDB Atlas provides automatic backups
# Or setup manual backups:
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)
```

### File Uploads Backup
```bash
# Backup uploads directory
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/
```

## Step 8: Performance Optimization

### 1. Enable Compression
Already enabled via helmet middleware.

### 2. Database Indexing
Indexes created in Step 2.

### 3. Caching (Optional)
Add Redis for session management and caching:
```bash
npm install redis
```

### 4. CDN for Static Assets
Use Cloudflare or AWS CloudFront for frontend assets.

## Step 9: Testing Production Setup

### 1. Health Check
```bash
curl https://api.yourschool.com/api/health
```

### 2. Test School Registration
```bash
curl -X POST https://api.yourschool.com/api/schools/register \
  -H "Content-Type: application/json" \
  -d '{
    "schoolName": "Test School",
    "schoolAddress": "123 Test St",
    "schoolPhone": "1234567890",
    "schoolEmail": "test@school.com",
    "adminName": "Admin User",
    "adminEmail": "admin@school.com",
    "adminPassword": "SecurePass123!",
    "plan": "Starter"
  }'
```

### 3. Test Login
```bash
curl -X POST https://api.yourschool.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "SecurePass123!"
  }'
```

## Step 10: Post-Deployment Checklist

- [ ] All environment variables set correctly
- [ ] Database connection working
- [ ] SSL certificates installed and working
- [ ] CORS configured for all frontend domains
- [ ] Rate limiting tested
- [ ] File uploads working
- [ ] Real-time Socket.IO connections working
- [ ] Logging configured and working
- [ ] Backups scheduled
- [ ] Monitoring setup
- [ ] Error tracking configured
- [ ] Documentation updated
- [ ] Super Admin account created
- [ ] Test school registered and working
- [ ] All frontend apps deployed and accessible

## Maintenance

### Regular Tasks
- Monitor logs daily
- Check database performance weekly
- Review security updates monthly
- Test backups monthly
- Update dependencies quarterly

### Scaling
- Monitor server resources (CPU, RAM, disk)
- Scale horizontally by adding more instances
- Upgrade MongoDB cluster as needed
- Implement caching layer if needed

## Support & Troubleshooting

### Common Issues

**Issue: Cannot connect to database**
- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check network connectivity

**Issue: CORS errors**
- Verify CORS_ORIGIN in .env
- Check frontend API_BASE URLs
- Ensure HTTPS on all domains

**Issue: File uploads failing**
- Check UPLOAD_PATH permissions
- Verify MAX_FILE_SIZE setting
- Check disk space

**Issue: Socket.IO not connecting**
- Verify WebSocket support on server
- Check firewall rules
- Ensure CORS allows WebSocket upgrade

## Rollback Plan

If deployment fails:
1. Revert to previous Git commit
2. Restore database from backup
3. Redeploy previous version
4. Notify users of maintenance

## Success Metrics

Monitor these KPIs:
- API response time < 200ms
- Uptime > 99.9%
- Error rate < 0.1%
- Database query time < 50ms
- User satisfaction score

## Conclusion

Your School Management SaaS platform is now production-ready with:
- ✅ Multi-tenant architecture
- ✅ Role-based access control
- ✅ Subscription management
- ✅ Real-time updates
- ✅ Security hardening
- ✅ Comprehensive logging
- ✅ Rate limiting
- ✅ File upload support
- ✅ Scalable infrastructure

For questions or issues, refer to the main README.md or contact support.
