import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';
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

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Auto-create Super Admin if none exists
const ensureSuperAdmin = async () => {
  try {
    const superAdminExists = await User.findOne({ role: 'SuperAdmin' });

    if (!superAdminExists) {
      const superAdminData = {
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: 'admin123',
        role: 'SuperAdmin'
      };

      await User.create(superAdminData);
      console.log('✅ Auto-created Super Admin account');
      console.log('   Email:', superAdminData.email);
      console.log('   Password:', superAdminData.password);
    }
  } catch (error) {
    console.error('⚠️  Could not auto-create Super Admin:', error.message);
  }
};

// Run after database connection
setTimeout(ensureSuperAdmin, 1000);

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS - Allow all origins in development
app.use(cors({
  origin: true, // Allow all origins (for file:// protocol and any localhost port)
  credentials: true
}));

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
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
