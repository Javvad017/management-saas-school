import api from './api.js';

class StudentAPI {
  // Get current user info (works for all roles)
  async getMyProfile() {
    try {
      console.log('Fetching current user profile...');
      const { data } = await api.get('/auth/me');
      console.log('Profile data:', data);
      return data.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Get student attendance
  async getMyAttendance(startDate, endDate) {
    try {
      console.log('Fetching attendance...', { startDate, endDate });
      const user = JSON.parse(localStorage.getItem('user'));
      
      const params = {};
      if (user && user._id) {
        params.studentId = user._id;
      }
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const { data } = await api.get('/attendance', { params });
      console.log('Attendance data:', data);
      return data.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  }

  // Get attendance percentage
  async getAttendancePercentage(startDate, endDate) {
    try {
      console.log('Fetching attendance percentage...', { startDate, endDate });
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user._id) {
        throw new Error('User ID not found');
      }
      
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const { data } = await api.get(`/attendance/percentage/${user._id}`, { params });
      console.log('Attendance percentage:', data);
      return data.data;
    } catch (error) {
      console.error('Error fetching attendance percentage:', error);
      // Return default stats if endpoint fails
      return {
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        percentage: 0
      };
    }
  }

  // Get student fees
  async getMyFees() {
    try {
      console.log('Fetching fees...');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const params = {};
      if (user && user._id) {
        params.studentId = user._id;
      }
      
      const { data } = await api.get('/fees', { params });
      console.log('Fees data:', data);
      return data.data;
    } catch (error) {
      console.error('Error fetching fees:', error);
      throw error;
    }
  }

  // Get fee summary
  async getFeeSummary() {
    try {
      console.log('Fetching fee summary...');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user._id) {
        throw new Error('User ID not found');
      }
      
      const { data } = await api.get(`/fees/summary/${user._id}`);
      console.log('Fee summary:', data);
      return data.data;
    } catch (error) {
      console.error('Error fetching fee summary:', error);
      // Return default summary if endpoint fails
      return {
        totalAmount: 0,
        totalPaid: 0,
        totalDue: 0,
        pendingCount: 0
      };
    }
  }

  // Get student results
  async getMyResults() {
    try {
      console.log('Fetching results...');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user._id) {
        throw new Error('User ID not found');
      }
      
      const { data } = await api.get(`/exams/results/student/${user._id}`);
      console.log('Results data:', data);
      return data.data;
    } catch (error) {
      console.error('Error fetching results:', error);
      throw error;
    }
  }

  // Get dashboard stats
  async getDashboardStats() {
    try {
      console.log('Fetching dashboard stats...');
      const { data } = await api.get('/dashboard/stats');
      console.log('Dashboard stats:', data);
      return data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default stats if endpoint fails
      return {
        totalStudents: 0,
        totalTeachers: 0,
        presentToday: 0,
        absentToday: 0,
        pendingFees: 0
      };
    }
  }
}

export default new StudentAPI();
