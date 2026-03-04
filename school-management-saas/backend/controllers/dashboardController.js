import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Attendance from '../models/Attendance.js';
import Fee from '../models/Fee.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res, next) => {
  const schoolId = req.user.schoolId;

  const totalStudents = await Student.countDocuments({ schoolId });
  const totalTeachers = await Teacher.countDocuments({ schoolId });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayAttendance = await Attendance.find({
    schoolId,
    date: { $gte: today }
  });

  const presentToday = todayAttendance.filter(a => a.status === 'Present').length;
  const absentToday = todayAttendance.filter(a => a.status === 'Absent').length;

  const pendingFees = await Fee.countDocuments({ schoolId, status: 'Pending' });
  const totalFeeAmount = await Fee.aggregate([
    { $match: { schoolId, status: 'Pending' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalStudents,
      totalTeachers,
      presentToday,
      absentToday,
      pendingFees,
      totalPendingAmount: totalFeeAmount[0]?.total || 0
    }
  });
});
