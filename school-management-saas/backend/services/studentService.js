import Student from '../models/Student.js';
import User from '../models/User.js';

class StudentService {
  // Create student with user account
  async createStudent(studentData, schoolId) {
    const {
      name,
      email,
      password,
      phone,
      rollNumber,
      class: studentClass,
      section,
      dateOfBirth,
      parentName,
      parentPhone,
      address
    } = studentData;

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Check if roll number exists in this school
    const existingStudent = await Student.findOne({ schoolId, rollNumber });
    if (existingStudent) {
      throw new Error('Roll number already exists in this school');
    }

    // Create user account
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'Student',
      schoolId
    });

    // Create student profile
    const student = await Student.create({
      userId: user._id,
      schoolId,
      rollNumber,
      class: studentClass,
      section,
      dateOfBirth,
      parentName,
      parentPhone,
      address
    });

    return await Student.findById(student._id).populate('userId', 'name email isActive');
  }

  // Get all students with filters
  async getStudents(schoolId, filters = {}) {
    const query = { schoolId };

    if (filters.class) query.class = filters.class;
    if (filters.section) query.section = filters.section;
    if (filters.search) {
      const users = await User.find({
        name: { $regex: filters.search, $options: 'i' },
        schoolId
      }).select('_id');
      query.userId = { $in: users.map(u => u._id) };
    }

    return await Student.find(query)
      .populate('userId', 'name email isActive')
      .sort({ class: 1, section: 1, rollNumber: 1 });
  }

  // Get single student
  async getStudentById(studentId, schoolId) {
    const student = await Student.findOne({ _id: studentId, schoolId })
      .populate('userId', 'name email phone isActive');

    if (!student) {
      throw new Error('Student not found');
    }

    return student;
  }

  // Update student
  async updateStudent(studentId, schoolId, updateData) {
    const student = await Student.findOne({ _id: studentId, schoolId });

    if (!student) {
      throw new Error('Student not found');
    }

    // Update student fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== 'userId' && key !== 'schoolId') {
        student[key] = updateData[key];
      }
    });

    await student.save();

    return await Student.findById(studentId).populate('userId', 'name email isActive');
  }

  // Delete student
  async deleteStudent(studentId, schoolId) {
    const student = await Student.findOne({ _id: studentId, schoolId });

    if (!student) {
      throw new Error('Student not found');
    }

    // Delete user account
    await User.findByIdAndDelete(student.userId);

    // Delete student profile
    await student.deleteOne();

    return { message: 'Student deleted successfully' };
  }

  // Get students by class
  async getStudentsByClass(schoolId, studentClass, section) {
    const query = { schoolId, class: studentClass };
    if (section) query.section = section;

    return await Student.find(query)
      .populate('userId', 'name email')
      .sort({ rollNumber: 1 });
  }
}

export default new StudentService();
