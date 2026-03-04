import Teacher from '../models/Teacher.js';
import User from '../models/User.js';

class TeacherService {
  // Create teacher with user account
  async createTeacher(teacherData, schoolId) {
    const {
      name,
      email,
      password,
      phone,
      employeeId,
      subject,
      qualification,
      address,
      salary
    } = teacherData;

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Check if employee ID exists in this school
    const existingTeacher = await Teacher.findOne({ schoolId, employeeId });
    if (existingTeacher) {
      throw new Error('Employee ID already exists in this school');
    }

    // Create user account
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'Teacher',
      schoolId
    });

    // Create teacher profile
    const teacher = await Teacher.create({
      userId: user._id,
      schoolId,
      employeeId,
      subject,
      qualification,
      phone,
      address,
      salary
    });

    return await Teacher.findById(teacher._id).populate('userId', 'name email isActive');
  }

  // Get all teachers with filters
  async getTeachers(schoolId, filters = {}) {
    const query = { schoolId };

    if (filters.subject) {
      query.subject = { $regex: filters.subject, $options: 'i' };
    }

    if (filters.search) {
      const users = await User.find({
        name: { $regex: filters.search, $options: 'i' },
        schoolId
      }).select('_id');
      query.userId = { $in: users.map(u => u._id) };
    }

    return await Teacher.find(query)
      .populate('userId', 'name email isActive')
      .sort({ employeeId: 1 });
  }

  // Get single teacher
  async getTeacherById(teacherId, schoolId) {
    const teacher = await Teacher.findOne({ _id: teacherId, schoolId })
      .populate('userId', 'name email isActive');

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    return teacher;
  }

  // Update teacher
  async updateTeacher(teacherId, schoolId, updateData) {
    const teacher = await Teacher.findOne({ _id: teacherId, schoolId });

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    // Update teacher fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== 'userId' && key !== 'schoolId') {
        teacher[key] = updateData[key];
      }
    });

    await teacher.save();

    return await Teacher.findById(teacherId).populate('userId', 'name email isActive');
  }

  // Delete teacher
  async deleteTeacher(teacherId, schoolId) {
    const teacher = await Teacher.findOne({ _id: teacherId, schoolId });

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    // Delete user account
    await User.findByIdAndDelete(teacher.userId);

    // Delete teacher profile
    await teacher.deleteOne();

    return { message: 'Teacher deleted successfully' };
  }
}

export default new TeacherService();
