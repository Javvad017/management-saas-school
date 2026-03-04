# Production Deployment Guide

## Overview

This guide covers deploying the School Management SaaS system to production.

## Architecture Options

### Option 1: Single Server (Small Scale)
- 1-10 schools
- <1000 users
- Cost: $20-50/month

### Option 2: Scalable (Medium Scale)
- 10-100 schools
- <10,000 users
- Cost: $100-300/month

### Option 3: Enterprise (Large Scale)
- 100+ schools
- 10,000+ users
- Cost: $500+/month

## Prerequisites

- Domain name (e.g., schoolsaas.com)
- SSL certificate (Let's Encrypt free)
- Server (VPS or Cloud)
- MongoDB Atlas account (or self-hosted MongoDB)

## Step 1: Server Setup

### Recommended Providers
- DigitalOcean ($12/month droplet)
- AWS EC2 (t3.small ~$15/month)
- Linode ($10/month)
- Vultr ($12/month)

### Server Specifications (Minimum)
- 2 CPU cores
- 4GB RAM
- 80GB SSD
- Ubuntu 22.04 LTS

### Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Create app user
sudo adduser --disabled-password --gecos "" schoolapp
sudo usermod -aG sudo schoolapp
```

## Step 2: MongoDB Setup

### Option A: MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (M0 free tier or M10 for production)
4. Whitelist your server IP
5. Create database user
6. Get connection string

### Option B: Self-Hosted MongoDB

```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Secure MongoDB
sudo mongo
> use admin
> db.createUser({
    user: "admin",
    pwd: "STRONG_PASSWORD_HERE",
    roles: ["root"]
  })
> exit

# Enable authentication
sudo nano /etc/mongod.conf
# Add:
# security:
#   authorization: enabled

sudo systemctl restart mongod
```

## Step 3: Deploy Backend

```bash
# Switch to app user
sudo su - schoolapp

# Clone or upload your code
git clone YOUR_REPO_URL school-saas
cd school-saas/backend

# Install dependencies
npm install --production

# Create production .env
nano .env
```

### Production .env

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/school_saas?retryWrites=true&w=majority
JWT_SECRET=GENERATE_STRONG_SECRET_HERE_USE_openssl_rand_base64_32
JWT_EXPIRE=7d
NODE_ENV=production
```

### Start with PM2

```bash
# Start application
pm2 start server.js --name school-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command it outputs

# Monitor
pm2 monit
```

## Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/schoolsaas
```

### Nginx Configuration

```nginx
# Backend API
server {
    listen 80;
    server_name api.schoolsaas.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend (if serving React build)
server {
    listen 80;
    server_name app.schoolsaas.com;
    root /home/schoolapp/school-saas/user-website/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/schoolsaas /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 5: SSL Certificate

```bash
# Get SSL certificate
sudo certbot --nginx -d api.schoolsaas.com -d app.schoolsaas.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

## Step 6: Deploy Frontend

### Option A: Static Hosting (Recommended)

```bash
cd /home/schoolapp/school-saas/user-website

# Update API URL in src/services/api.js
nano src/services/api.js
# Change: const API_URL = 'https://api.schoolsaas.com/api';

# Build
npm install
npm run build

# Files are in dist/ folder
# Nginx will serve them (configured above)
```

### Option B: Vercel/Netlify

1. Push code to GitHub
2. Connect to Vercel/Netlify
3. Set environment variable: VITE_API_URL=https://api.schoolsaas.com/api
4. Deploy

## Step 7: Deploy Desktop App

### Build for Distribution

```bash
cd admin-desktop

# Install electron-builder
npm install --save-dev electron-builder

# Update package.json
```

```json
{
  "build": {
    "appId": "com.schoolsaas.admin",
    "productName": "School Admin",
    "win": {
      "target": "nsis"
    },
    "mac": {
      "target": "dmg"
    },
    "linux": {
      "target": "AppImage"
    }
  },
  "scripts": {
    "build:win": "electron-builder --win",
    "build:mac": "electron-builder --mac",
    "build:linux": "electron-builder --linux"
  }
}
```

```bash
# Build for Windows
npm run build:win

# Distribute the installer from dist/ folder
```

## Step 8: Security Hardening

### Firewall Setup

```bash
# Enable UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

### Additional Security

```bash
# Install fail2ban
sudo apt install -y fail2ban

# Configure fail2ban
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
```

```bash
sudo systemctl restart fail2ban
```

### Rate Limiting (Backend)

Install express-rate-limit:

```bash
npm install express-rate-limit
```

Update server.js:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Step 9: Monitoring & Logging

### PM2 Monitoring

```bash
# View logs
pm2 logs school-backend

# Monitor resources
pm2 monit

# Web dashboard
pm2 plus
```

### Application Logging

Install winston:

```bash
npm install winston
```

Create logger.js:

```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

## Step 10: Backup Strategy

### Database Backup

```bash
# Create backup script
nano /home/schoolapp/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/schoolapp/backups"
mkdir -p $BACKUP_DIR

# MongoDB backup
mongodump --uri="YOUR_MONGODB_URI" --out="$BACKUP_DIR/backup_$DATE"

# Compress
tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$BACKUP_DIR/backup_$DATE"
rm -rf "$BACKUP_DIR/backup_$DATE"

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
```

```bash
chmod +x /home/schoolapp/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /home/schoolapp/backup.sh
```

## Step 11: Environment Variables

### Secure Secrets Management

```bash
# Generate strong JWT secret
openssl rand -base64 32

# Store in .env (never commit to git)
# Use environment variables in production
```

### PM2 with Environment Variables

```bash
pm2 start server.js --name school-backend --env production
```

## Step 12: CI/CD (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /home/schoolapp/school-saas
            git pull
            cd backend
            npm install --production
            pm2 restart school-backend
```

## Step 13: Health Checks

Add health check endpoint in server.js:

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Monitor with UptimeRobot

1. Go to https://uptimerobot.com
2. Add monitor for https://api.schoolsaas.com/health
3. Get alerts if server goes down

## Step 14: Performance Optimization

### Enable Gzip in Nginx

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### Add Caching Headers

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Deployment Checklist

- [ ] Server provisioned and secured
- [ ] MongoDB setup (Atlas or self-hosted)
- [ ] Backend deployed with PM2
- [ ] Nginx configured as reverse proxy
- [ ] SSL certificate installed
- [ ] Frontend built and deployed
- [ ] Desktop app built and distributed
- [ ] Firewall configured
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Backup strategy implemented
- [ ] Monitoring setup
- [ ] Health checks configured
- [ ] Environment variables secured
- [ ] DNS records configured
- [ ] Test all functionality

## DNS Configuration

Point your domain to server:

```
A Record: api.schoolsaas.com → YOUR_SERVER_IP
A Record: app.schoolsaas.com → YOUR_SERVER_IP
```

## Cost Estimation

### Monthly Costs (Small Scale)

- Server (DigitalOcean): $12
- MongoDB Atlas (M10): $57
- Domain: $1
- SSL: Free (Let's Encrypt)
- **Total: ~$70/month**

### Monthly Costs (Medium Scale)

- Server (2x): $24
- Load Balancer: $10
- MongoDB Atlas (M30): $200
- Domain: $1
- CDN (Cloudflare): Free
- **Total: ~$235/month**

## Troubleshooting

### Backend not starting
```bash
pm2 logs school-backend
# Check for errors
```

### MongoDB connection failed
```bash
# Test connection
mongosh "YOUR_MONGODB_URI"
```

### Nginx errors
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### SSL issues
```bash
sudo certbot certificates
sudo certbot renew --dry-run
```

## Support & Maintenance

### Regular Tasks

- Weekly: Check logs for errors
- Weekly: Review monitoring alerts
- Monthly: Update dependencies
- Monthly: Review backup integrity
- Quarterly: Security audit
- Yearly: SSL certificate renewal (automatic)

## Conclusion

Your School Management SaaS is now deployed to production with:
- Secure HTTPS connections
- Automated backups
- Monitoring and logging
- Scalable architecture
- Professional deployment

For issues, check logs and monitoring dashboards first.
