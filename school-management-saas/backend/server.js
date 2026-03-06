import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connectDB from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import logger from './utils/logger.js';
import { initSocket } from './utils/socket.js';
import User from './models/User.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import schoolRoutes from './routes/schoolRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import examRoutes from './routes/examRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import revenueRoutes from './routes/revenueRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import homeworkRoutes from './routes/homeworkRoutes.js';
import studentPortalRoutes from './routes/studentPortalRoutes.js';
import sectionRoutes from './routes/sectionRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Ensure required directories exist
const ensureDirectories = () => {
  const dirs = [
    process.env.UPLOAD_PATH || path.join(__dirname, 'uploads'),
    process.env.LOG_FILE_PATH || path.join(__dirname, 'logs')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Created directory: ${dir}`);
    }
  });
};

ensureDirectories();

// Auto-create Super Admin if none exists
const ensureSuperAdmin = async () => {
  try {
    const superAdminExists = await User.findOne({ role: 'SuperAdmin' });

    if (!superAdminExists) {
      const superAdminData = {
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: 'Admin@123',
        role: 'SuperAdmin'
      };

      await User.create(superAdminData);
      logger.info('Auto-created Super Admin account');
      logger.info(`Email: ${superAdminData.email}, Password: ${superAdminData.password}`);
    }
  } catch (error) {
    logger.error(`Could not auto-create Super Admin: ${error.message}`);
  }
};

// Run after database connection
setTimeout(ensureSuperAdmin, 1000);

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);
logger.info('Socket.IO initialized');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Rate limiting
app.use('/api/', apiLimiter);

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/homework', homeworkRoutes);
app.use('/api/student', studentPortalRoutes);
app.use('/api/sections', sectionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔌 Socket.IO ready for real-time connections`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

export default app;
