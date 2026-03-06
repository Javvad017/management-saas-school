import Fee from '../models/Fee.js';
import Student from '../models/Student.js';

class FeeService {
  // Create fee record
  async createFee(feeData, schoolId) {
    const { studentId, amount, dueDate, feeType, month, year } = feeData;

    // Verify student exists
    const student = await Student.findOne({ _id: studentId, schoolId });
    if (!student) {
      throw new Error('Student not found');
    }

    // Derive month/year if not provided
    const feeMonth = month || new Date(dueDate).toLocaleString('default', { month: 'long' });
    const feeYear = year || new Date(dueDate).getFullYear();

    // Check if fee already exists for this month/year/type
    const existingFee = await Fee.findOne({
      studentId,
      schoolId,
      feeType,
      month: feeMonth,
      year: feeYear
    });

    if (existingFee) {
      throw new Error('Fee record already exists for this period');
    }

    const fee = await Fee.create({
      studentId,
      schoolId,
      amount,
      dueDate,
      feeType,
      month: feeMonth,
      year: feeYear,
      paidAmount: 0,
      status: 'Pending'
    });

    return await Fee.findById(fee._id)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name' }
      });
  }

  // Get fees with filters
  async getFees(schoolId, filters = {}) {
    const query = { schoolId };

    if (filters.studentId) query.studentId = filters.studentId;
    if (filters.status) query.status = filters.status;
    if (filters.feeType) query.feeType = filters.feeType;
    if (filters.month) query.month = filters.month;
    if (filters.year) query.year = parseInt(filters.year);

    return await Fee.find(query)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ dueDate: -1 });
  }

  // Record payment
  async recordPayment(feeId, schoolId, paymentData) {
    const { paidAmount } = paymentData;

    const fee = await Fee.findOne({ _id: feeId, schoolId });
    if (!fee) {
      throw new Error('Fee record not found');
    }

    // Update paid amount
    fee.paidAmount += paidAmount;

    // Status will be updated by pre-save hook
    await fee.save();

    return {
      ...fee.toObject(),
      dueAmount: fee.getRemainingAmount()
    };
  }

  // Update fee
  async updateFee(feeId, schoolId, feeData) {
    let fee = await Fee.findOne({ _id: feeId, schoolId });
    if (!fee) {
      throw new Error('Fee record not found');
    }

    // Special logic if updating status to 'Paid'
    if (feeData.status === 'Paid' && fee.status !== 'Paid') {
      feeData.paidAmount = fee.amount;
      feeData.paymentDate = new Date();
    }

    if (feeData.status === 'Pending' && fee.status !== 'Pending') {
      feeData.paidAmount = 0;
      feeData.paymentDate = null;
    }

    fee = await Fee.findByIdAndUpdate(
      feeId,
      feeData,
      { new: true, runValidators: true }
    ).populate({
      path: 'studentId',
      populate: { path: 'userId', select: 'name' }
    });

    return fee;
  }

  // Delete fee
  async deleteFee(feeId, schoolId) {
    const fee = await Fee.findOne({ _id: feeId, schoolId });
    if (!fee) {
      throw new Error('Fee record not found');
    }

    await Fee.deleteOne({ _id: feeId });
    return true;
  }

  // Get unpaid students
  async getUnpaidStudents(schoolId, filters = {}) {
    const query = {
      schoolId,
      status: { $in: ['Pending', 'Overdue'] }
    };

    if (filters.class) {
      const students = await Student.find({
        schoolId,
        class: filters.class
      }).select('_id');
      query.studentId = { $in: students.map(s => s._id) };
    }

    const fees = await Fee.find(query)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ dueDate: 1 });

    // Group by student
    const studentFees = {};
    fees.forEach(fee => {
      const studentId = fee.studentId._id.toString();
      if (!studentFees[studentId]) {
        studentFees[studentId] = {
          student: fee.studentId,
          fees: [],
          totalDue: 0
        };
      }
      const dueAmount = fee.amount - fee.paidAmount;
      studentFees[studentId].fees.push({
        ...fee.toObject(),
        dueAmount
      });
      studentFees[studentId].totalDue += dueAmount;
    });

    return Object.values(studentFees);
  }

  // Get fee summary for a student
  async getStudentFeeSummary(studentId, schoolId) {
    const fees = await Fee.find({ studentId, schoolId });

    const summary = {
      totalAmount: 0,
      totalPaid: 0,
      totalDue: 0,
      paidCount: 0,
      pendingCount: 0,
      overdueCount: 0
    };

    fees.forEach(fee => {
      summary.totalAmount += fee.amount;
      summary.totalPaid += fee.paidAmount;
      summary.totalDue += (fee.amount - fee.paidAmount);

      if (fee.status === 'Paid') summary.paidCount++;
      else if (fee.status === 'Pending') summary.pendingCount++;
      else if (fee.status === 'Overdue') summary.overdueCount++;
    });

    return summary;
  }

  // Create bulk fees for a class
  async createBulkFees(schoolId, bulkData) {
    const { class: studentClass, section, amount, dueDate, feeType, month, year } = bulkData;

    const query = { schoolId, class: studentClass };
    if (section) query.section = section;

    const students = await Student.find(query);

    if (students.length === 0) {
      throw new Error('No students found in this class');
    }

    const fees = [];
    const errors = [];

    for (const student of students) {
      try {
        // Check if fee already exists
        const existing = await Fee.findOne({
          studentId: student._id,
          schoolId,
          feeType,
          month,
          year
        });

        if (!existing) {
          const fee = await Fee.create({
            studentId: student._id,
            schoolId,
            amount,
            dueDate,
            feeType,
            month,
            year
          });
          fees.push(fee);
        }
      } catch (error) {
        errors.push({
          studentId: student._id,
          error: error.message
        });
      }
    }

    return { fees, errors, created: fees.length };
  }
}

export default new FeeService();
