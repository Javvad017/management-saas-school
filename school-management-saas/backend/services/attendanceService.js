import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';

class AttendanceService {
  // Mark attendance for multiple students
  async markAttendance(attendanceData, schoolId, markedBy) {
    const { date, students } = attendanceData;

    const attendanceRecords = [];
    const errors = [];

    for (const studentData of students) {
      try {
        // Check if student exists
        const student = await Student.findOne({
          _id: studentData.studentId,
          schoolId
        });

        if (!student) {
          errors.push({
            studentId: studentData.studentId,
            error: 'Student not found'
          });
          continue;
        }

        // Check if attendance already marked for this date
        const existing = await Attendance.findOne({
          studentId: studentData.studentId,
          date: new Date(date)
        });

        if (existing) {
          // Update existing attendance
          existing.status = studentData.status;
          existing.remarks = studentData.remarks || '';
          existing.markedBy = markedBy;
          await existing.save();
          attendanceRecords.push(existing);
        } else {
          // Create new attendance record
          const attendance = await Attendance.create({
            studentId: studentData.studentId,
            schoolId,
            date: new Date(date),
            status: studentData.status,
            remarks: studentData.remarks || '',
            markedBy
          });
          attendanceRecords.push(attendance);
        }
      } catch (error) {
        errors.push({
          studentId: studentData.studentId,
          error: error.message
        });
      }
    }

    return { attendanceRecords, errors };
  }

  // Get attendance by class and date
  async getAttendanceByClass(schoolId, studentClass, section, date) {
    // Get all students in the class
    const query = { schoolId, class: studentClass };
    if (section) query.section = section;

    const students = await Student.find(query)
      .populate('userId', 'name email')
      .sort({ rollNumber: 1 });

    // Get attendance for the date
    const attendanceRecords = await Attendance.find({
      schoolId,
      date: new Date(date)
    });

    // Map attendance to students
    const result = students.map(student => {
      const attendance = attendanceRecords.find(
        a => a.studentId.toString() === student._id.toString()
      );

      return {
        student: {
          _id: student._id,
          name: student.userId.name,
          rollNumber: student.rollNumber,
          class: student.class,
          section: student.section
        },
        attendance: attendance ? {
          status: attendance.status,
          remarks: attendance.remarks,
          markedAt: attendance.createdAt
        } : null
      };
    });

    return result;
  }

  // Get attendance history for a student
  async getStudentAttendance(studentId, schoolId, startDate, endDate) {
    const query = {
      studentId,
      schoolId
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('markedBy', 'name');

    return attendance;
  }

  // Calculate attendance percentage
  async calculateAttendancePercentage(studentId, schoolId, startDate, endDate) {
    const query = {
      studentId,
      schoolId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const totalDays = await Attendance.countDocuments(query);
    const presentDays = await Attendance.countDocuments({
      ...query,
      status: 'Present'
    });

    const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

    return {
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
      percentage: parseFloat(percentage)
    };
  }

  // Get attendance report for class
  async getClassAttendanceReport(schoolId, studentClass, section, startDate, endDate) {
    const query = { schoolId, class: studentClass };
    if (section) query.section = section;

    const students = await Student.find(query)
      .populate('userId', 'name')
      .sort({ rollNumber: 1 });

    const report = [];

    for (const student of students) {
      const stats = await this.calculateAttendancePercentage(
        student._id,
        schoolId,
        startDate,
        endDate
      );

      report.push({
        student: {
          _id: student._id,
          name: student.userId.name,
          rollNumber: student.rollNumber
        },
        ...stats
      });
    }

    return report;
  }
}

export default new AttendanceService();
