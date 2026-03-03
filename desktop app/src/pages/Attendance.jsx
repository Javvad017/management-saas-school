import { useState, useEffect, useCallback } from 'react';
import { classesService, studentsService, attendanceService } from '../services/dataStore';

function Attendance() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const classesData = classesService.getAll();
    setClasses(classesData);
  }, []);

  useEffect(() => {
    if (selectedClass) {
      setLoading(true);
      const allStudents = studentsService.getAll();
      const selectedClassName = classes.find(c => c.id === selectedClass)?.className;
      const classStudents = allStudents.filter(s => s.class === selectedClassName);
      
      setStudents(classStudents);
      
      // Load existing attendance or initialize
      const existingAttendance = attendanceService.get(selectedDate, selectedClass);
      if (existingAttendance) {
        setAttendance(existingAttendance.attendance);
      } else {
        const initialAttendance = {};
        classStudents.forEach(student => {
          initialAttendance[student.id] = 'present';
        });
        setAttendance(initialAttendance);
      }
      
      setLoading(false);
      setSaved(false);
    }
  }, [selectedClass, selectedDate, classes]);

  const handleAttendanceChange = useCallback((studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
    setSaved(false);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    attendanceService.save(selectedDate, selectedClass, attendance);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, [selectedDate, selectedClass, attendance]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>
        <p className="text-gray-600 mt-1">Mark student attendance</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="">Choose a class</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.className}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-500">Loading students...</div>
        )}

        {!loading && students.length > 0 && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="font-medium">{student.name}</span>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        value="present"
                        checked={attendance[student.id] === 'present'}
                        onChange={() => handleAttendanceChange(student.id, 'present')}
                        className="mr-2"
                      />
                      <span className="text-green-600">✅ Present</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        value="absent"
                        checked={attendance[student.id] === 'absent'}
                        onChange={() => handleAttendanceChange(student.id, 'absent')}
                        className="mr-2"
                      />
                      <span className="text-red-600">❌ Absent</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
            {saved && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                ✅ Attendance saved successfully!
              </div>
            )}
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              💾 Save Attendance
            </button>
          </form>
        )}

        {!loading && selectedClass && students.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No students found in this class. Add students first!
          </div>
        )}

        {!selectedClass && (
          <div className="text-center py-8 text-gray-500">
            Please select a class to mark attendance
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;
