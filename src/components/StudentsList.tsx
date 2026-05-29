import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  SlidersHorizontal
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { Student } from '../types';

export const StudentsList: React.FC = () => {
  const { 
    students, 
    searchQuery, 
    setSearchQuery, 
    deleteStudent
  } = useDashboard();

  // Filter States
  const [gradeFilter, setGradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [feeFilter, setFeeFilter] = useState('All');

  // Filter students array based on queries
  const filteredStudents = students.filter((student) => {
    // Search query match
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter selects matches
    const matchesGrade = gradeFilter === 'All' || student.grade === gradeFilter;
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    const matchesFee = feeFilter === 'All' || student.feeStatus === feeFilter;

    return matchesSearch && matchesGrade && matchesStatus && matchesFee;
  });

  const getStatusBadgeColor = (val: 'Active' | 'Suspended' | 'Inactive') => {
    switch (val) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
      case 'Suspended': return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-400 border-slate-200 dark:border-slate-800';
    }
  };

  const getFeeBadgeColor = (val: 'Paid' | 'Pending' | 'Overdue') => {
    switch (val) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
      case 'Pending': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
      default: return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white tracking-tight">
            Students Directory
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage student registrations, performance metrics, and statuses.
          </p>
        </div>
        <button
          onClick={() => alert('Add student form will be available in next step!')}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-semibold rounded-xl text-sm shadow-lg shadow-sky-500/10 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Register Student</span>
        </button>
      </div>

      {/* Filter and Mobile Search Section */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        
        {/* Search input visible only on mobile */}
        <div className="relative group md:hidden">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-sky-500 transition-colors">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 dark:text-slate-200 transition-all text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </div>

          {/* Grade filter */}
          <div className="flex items-center gap-1">
            <label className="text-slate-400">Grade:</label>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-700 dark:text-slate-200 focus:border-sky-500"
            >
              <option value="All">All Grades</option>
              <option value="9th Grade">9th Grade</option>
              <option value="10th Grade">10th Grade</option>
              <option value="11th Grade">11th Grade</option>
              <option value="12th Grade">12th Grade</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1">
            <label className="text-slate-400">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-700 dark:text-slate-200 focus:border-sky-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Fees status filter */}
          <div className="flex items-center gap-1">
            <label className="text-slate-400">Fees:</label>
            <select
              value={feeFilter}
              onChange={(e) => setFeeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-700 dark:text-slate-200 focus:border-sky-500"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>
      </div>

      {/* Directory Table Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">Student Details</th>
                <th className="px-6 py-4">Grade</th>
                <th className="px-6 py-4">GPA</th>
                <th className="px-6 py-4">Attendance</th>
                <th className="px-6 py-4">Fee Status</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center text-white font-bold font-outfit text-sm shadow-md shadow-sky-500/10">
                          {student.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{student.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600 dark:text-slate-300">
                      {student.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-bold font-outfit ${
                        student.gpa >= 3.5 ? 'text-emerald-500' : student.gpa >= 3.0 ? 'text-sky-500' : 'text-slate-600 dark:text-slate-300'
                      }`}>
                        {student.gpa.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              student.attendanceRate >= 90 ? 'bg-emerald-500' : student.attendanceRate >= 80 ? 'bg-sky-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${student.attendanceRate}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold font-outfit text-xs text-slate-700 dark:text-slate-300">
                          {student.attendanceRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getFeeBadgeColor(student.feeStatus)}`}>
                        {student.feeStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeColor(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => alert('Edit student form will be available in next step!')}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20 hover:border-sky-200 dark:hover:border-sky-900/30 transition-all cursor-pointer"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-200 dark:hover:border-rose-900/30 transition-all cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <p className="text-sm">No student records found</p>
                    <p className="text-xs text-slate-500 mt-1">Try modifying your search text or filter options.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
