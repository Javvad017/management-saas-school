import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  console.error(err.stack);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION:', err);
  console.error(err.stack);
});

// Import routes
import authRoutes from './routes/auth.js';
import studentsRoutes from './routes/students.js';
import teachersRoutes from './routes/teachers.js';
import classesRoutes from './routes/classes.js';
import attendanceRoutes from './routes/attendance.js';
import announcementsRoutes from './routes/announcements.js';

// Import models
import Admin from './models/Admin.js';

const app = express();

// CORS Configuration - MUST be before routes
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/school-management';
const PORT = process.env.PORT || 5000;

console.log('========================================');
console.log('Starting School Management System Server');
console.log('========================================');
console.log('MongoDB URI:', MONGODB_URI);
console.log('Server Port:', PORT);
console.log('JWT Secret:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('========================================');

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    createDefaultAdmin();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('');
    console.error('TROUBLESHOOTING:');
    console.error('1. Make sure MongoDB is installed');
    console.error('2. Start MongoDB service:');
    console.error('   Windows: net start MongoDB');
    console.error('   Or run: mongod --dbpath C:/data/db');
    console.error('3. Check if MongoDB is running on port 27017');
    console.error('   Run: netstat -ano | findstr :27017');
    console.error('');
    process.exit(1);
  });

// Auto-create default admin user
const createDefaultAdmin = async () => {
  try {
    const existing = await Admin.findOne({ email: 'admin@school.com' });
    
    if (!existing) {
      const hashed = await bcrypt.hash('admin123', 10);
      await Admin.create({ 
        email: 'admin@school.com', 
        password: hashed 
      });
      console.log('✅ Default admin created: admin@school.com / admin123');
    } else {
      console.log('✅ Admin already exists');
    }
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  }
};

// JWT Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Test route - check if backend is working
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', authMiddleware, studentsRoutes);
app.use('/api/teachers', authMiddleware, teachersRoutes);
app.use('/api/classes', authMiddleware, classesRoutes);
app.use('/api/attendance', authMiddleware, attendanceRoutes);
app.use('/api/announcements', authMiddleware, announcementsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server with error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('✅ Server running successfully!');
  console.log('========================================');
  console.log('Local:   http://127.0.0.1:' + PORT);
  console.log('Local:   http://localhost:' + PORT);
  console.log('API:     http://127.0.0.1:' + PORT + '/api');
  console.log('Test:    http://127.0.0.1:' + PORT + '/api/test');
  console.log('========================================');
  console.log('Ready to accept connections...');
  console.log('');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('❌ ERROR: Port ' + PORT + ' is already in use!');
    console.error('');
    console.error('SOLUTION:');
    console.error('1. Find process using port ' + PORT + ':');
    console.error('   netstat -ano | findstr :' + PORT);
    console.error('2. Kill that process:');
    console.error('   taskkill /PID <PID> /F');
    console.error('3. Or change PORT in .env file');
    console.error('');
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});
