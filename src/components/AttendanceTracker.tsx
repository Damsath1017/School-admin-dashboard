import React, { useState } from 'react';
import { ClipboardCheck, UserCheck, UserX, Clock, Send } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const AttendanceTracker: React.FC = () => {
  const { students, triggerToast, addActivity } = useDashboard();
  const [selectedGrade, setSelectedGrade] = useState('10th Grade');
  
  // Get students of the selected grade
  const gradeStudents = students.filter(s => s.grade === selectedGrade);
  
  // Track local changes to attendance status before submitting
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, 'Present' | 'Absent' | 'Late'>>({});

  const handleStatusChange = (studentId: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Get current status of student (either from local changes or default 'Present')
  const getStudentStatus = (studentId: string): 'Present' | 'Absent' | 'Late' => {
    return attendanceRecords[studentId] || 'Present';
  };

  // Calculate stats for current preview
  const totalStudents = gradeStudents.length;
  const presentCount = gradeStudents.filter(s => getStudentStatus(s.id) === 'Present').length;
  const lateCount = gradeStudents.filter(s => getStudentStatus(s.id) === 'Late').length;
  const absentCount = gradeStudents.filter(s => getStudentStatus(s.id) === 'Absent').length;
  const currentAttendanceRate = totalStudents > 0 
    ? parseFloat((((presentCount + lateCount) / totalStudents) * 100).toFixed(1)) 
    : 100;

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalStudents === 0) {
      triggerToast('No students registered in this grade to submit.', 'error');
      return;
    }

    addActivity('Submitted Attendance Sheet', selectedGrade, 'success');
    triggerToast(`Attendance submitted for ${selectedGrade}! (${presentCount + lateCount}/${totalStudents} present)`, 'success');
    setAttendanceRecords({}); // Clear modifications
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Introduction Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white tracking-tight">
            Attendance Register
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Record and review daily attendance logs by class grade.
          </p>
        </div>
        
        {/* Grade select filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Class:</label>
          <select
            value={selectedGrade}
            onChange={(e) => {
              setSelectedGrade(e.target.value);
              setAttendanceRecords({}); // Reset local edits when switching grades
            }}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none text-xs font-semibold text-slate-700 dark:text-slate-200 focus:border-sky-500"
          >
            <option value="9th Grade">9th Grade</option>
            <option value="10th Grade">10th Grade</option>
            <option value="11th Grade">11th Grade</option>
            <option value="12th Grade">12th Grade</option>
          </select>
        </div>
      </div>

      {/* Class Statistics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Present Card */}
        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500 text-white shadow shadow-emerald-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Present</p>
            <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-emerald-400 mt-0.5">{presentCount} Students</h3>
          </div>
        </div>

        {/* Late Card */}
        <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/20 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500 text-white shadow shadow-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Late Arrivals</p>
            <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-amber-400 mt-0.5">{lateCount} Students</h3>
          </div>
        </div>

        {/* Absent Card */}
        <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500 text-white shadow shadow-rose-500/20">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Absent</p>
            <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-rose-400 mt-0.5">{absentCount} Students</h3>
          </div>
        </div>

        {/* Rate Card */}
        <div className="p-4 rounded-xl bg-sky-50/50 dark:bg-sky-950/10 border border-sky-100 dark:border-sky-900/20 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sky-500 text-white shadow shadow-sky-500/20">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</p>
            <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-sky-400 mt-0.5">{currentAttendanceRate}%</h3>
          </div>
        </div>
      </div>

      {/* Interactive Sheet Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmitReport}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4">Student Details</th>
                  <th className="px-6 py-4">Current Average</th>
                  <th className="px-6 py-4 text-center">Marking Register</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {gradeStudents.length > 0 ? (
                  gradeStudents.map((student) => {
                    const currentStatus = getStudentStatus(student.id);
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold font-outfit text-xs shadow">
                              {student.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{student.name}</p>
                              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{student.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <span className={`font-semibold font-outfit text-xs ${
                            student.attendanceRate >= 90 ? 'text-emerald-500' : student.attendanceRate >= 80 ? 'text-sky-500' : 'text-rose-500'
                          }`}>
                            {student.attendanceRate}%
                          </span>
                        </td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Present Toggle */}
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.id, 'Present')}
                              className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-all cursor-pointer ${
                                currentStatus === 'Present'
                                  ? 'bg-emerald-500 text-white shadow shadow-emerald-500/20'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              Present
                            </button>

                            {/* Late Toggle */}
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.id, 'Late')}
                              className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-all cursor-pointer ${
                                currentStatus === 'Late'
                                  ? 'bg-amber-500 text-white shadow shadow-amber-500/20'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              Late
                            </button>

                            {/* Absent Toggle */}
                            <button
                              type="button"
                              onClick={() => handleStatusChange(student.id, 'Absent')}
                              className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-all cursor-pointer ${
                                currentStatus === 'Absent'
                                  ? 'bg-rose-500 text-white shadow shadow-rose-500/20'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400">
                      <p className="text-sm">No student records registered in this grade.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Form Actions Footer */}
          {gradeStudents.length > 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-semibold rounded-xl text-xs shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Attendance Sheet</span>
              </button>
            </div>
          )}
        </form>
      </div>

    </div>
  );
};
