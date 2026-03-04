import Exam from '../models/Exam.js';
import Result from '../models/Result.js';
import Student from '../models/Student.js';

class ExamService {
  // Create exam
  async createExam(examData, schoolId, createdBy) {
    const { examName, class: examClass, section, examDate, subjects } = examData;

    const exam = await Exam.create({
      examName,
      class: examClass,
      section,
      schoolId,
      examDate,
      subjects,
      createdBy
    });

    return exam;
  }

  // Get exams with filters
  async getExams(schoolId, filters = {}) {
    const query = { schoolId };

    if (filters.class) query.class = filters.class;
    if (filters.section) query.section = filters.section;
    if (filters.status) query.status = filters.status;

    return await Exam.find(query)
      .populate('createdBy', 'name')
      .sort({ examDate: -1 });
  }

  // Get single exam
  async getExamById(examId, schoolId) {
    const exam = await Exam.findOne({ _id: examId, schoolId })
      .populate('createdBy', 'name');

    if (!exam) {
      throw new Error('Exam not found');
    }

    return exam;
  }

  // Update exam
  async updateExam(examId, schoolId, updateData) {
    const exam = await Exam.findOne({ _id: examId, schoolId });

    if (!exam) {
      throw new Error('Exam not found');
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        exam[key] = updateData[key];
      }
    });

    await exam.save();
    return exam;
  }

  // Delete exam
  async deleteExam(examId, schoolId) {
    const exam = await Exam.findOne({ _id: examId, schoolId });

    if (!exam) {
      throw new Error('Exam not found');
    }

    // Delete all results for this exam
    await Result.deleteMany({ examId });

    await exam.deleteOne();

    return { message: 'Exam and associated results deleted successfully' };
  }

  // Add result for a student
  async addResult(resultData, schoolId) {
    const { studentId, examId, marks } = resultData;

    // Verify exam exists
    const exam = await Exam.findOne({ _id: examId, schoolId });
    if (!exam) {
      throw new Error('Exam not found');
    }

    // Verify student exists
    const student = await Student.findOne({ _id: studentId, schoolId });
    if (!student) {
      throw new Error('Student not found');
    }

    // Calculate totals
    let totalMarksObtained = 0;
    let totalMarks = 0;

    marks.forEach(mark => {
      totalMarksObtained += mark.marksObtained;
      totalMarks += mark.totalMarks;
    });

    const percentage = ((totalMarksObtained / totalMarks) * 100).toFixed(2);

    // Calculate grade
    const grade = this.calculateGrade(parseFloat(percentage));

    // Check if result already exists
    const existingResult = await Result.findOne({ studentId, examId });

    if (existingResult) {
      // Update existing result
      existingResult.marks = marks;
      existingResult.totalMarksObtained = totalMarksObtained;
      existingResult.totalMarks = totalMarks;
      existingResult.percentage = parseFloat(percentage);
      existingResult.grade = grade;
      await existingResult.save();
      return existingResult;
    }

    // Create new result
    const result = await Result.create({
      studentId,
      examId,
      schoolId,
      marks,
      totalMarksObtained,
      totalMarks,
      percentage: parseFloat(percentage),
      grade
    });

    return result;
  }

  // Get results for an exam
  async getExamResults(examId, schoolId) {
    const results = await Result.find({ examId, schoolId })
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ percentage: -1 });

    return results;
  }

  // Get results for a student
  async getStudentResults(studentId, schoolId) {
    const results = await Result.find({ studentId, schoolId })
      .populate('examId', 'examName examDate class')
      .sort({ createdAt: -1 });

    return results;
  }

  // Calculate grade based on percentage
  calculateGrade(percentage) {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  }

  // Get exam statistics
  async getExamStatistics(examId, schoolId) {
    const results = await Result.find({ examId, schoolId });

    if (results.length === 0) {
      return {
        totalStudents: 0,
        averagePercentage: 0,
        highestPercentage: 0,
        lowestPercentage: 0,
        passCount: 0,
        failCount: 0
      };
    }

    const percentages = results.map(r => r.percentage);
    const totalPercentage = percentages.reduce((sum, p) => sum + p, 0);
    const passCount = results.filter(r => r.percentage >= 40).length;

    return {
      totalStudents: results.length,
      averagePercentage: (totalPercentage / results.length).toFixed(2),
      highestPercentage: Math.max(...percentages),
      lowestPercentage: Math.min(...percentages),
      passCount,
      failCount: results.length - passCount,
      passPercentage: ((passCount / results.length) * 100).toFixed(2)
    };
  }
}

export default new ExamService();
