import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  SlidersHorizontal, 
  User, 
  Mail, 
  Phone
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { Modal } from './Modal';
import type { Student } from '../types';

export const StudentsList: React.FC = () => {
  const { 
    students, 
    searchQuery, 
    setSearchQuery, 
    addStudent, 
    updateStudent, 
    deleteStudent,
    t
  } = useDashboard();

  // Filter States
  const [gradeFilter, setGradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [feeFilter, setFeeFilter] = useState('All');

  // Modal Control States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form Field States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [grade, setGrade] = useState('12-Commerce-A');
  const [parentName, setParentName] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [gpa, setGpa] = useState('3.5');
  const [attendanceRate, setAttendanceRate] = useState('95.0');
  const [feeStatus, setFeeStatus] = useState<'Paid' | 'Pending' | 'Overdue'>('Paid');
  const [status, setStatus] = useState<'Active' | 'Suspended' | 'Inactive'>('Active');
  
  // Validation State
  const [formError, setFormError] = useState('');

  // Handle Edit Trigger
  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setName(student.name);
    setEmail(student.email);
    setGrade(student.grade);
    setParentName(student.parentName);
    setParentContact(student.parentContact);
    setGpa(student.gpa.toString());
    setAttendanceRate(student.attendanceRate.toString());
    setFeeStatus(student.feeStatus);
    setStatus(student.status);
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle Add New Trigger
  const handleAddClick = () => {
    setEditingStudent(null);
    setName('');
    setEmail('');
    setGrade('12-Commerce-A');
    setParentName('');
    setParentContact('');
    setGpa('3.5');
    setAttendanceRate('95.0');
    setFeeStatus('Paid');
    setStatus('Active');
    setFormError('');
    setIsModalOpen(true);
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!name.trim() || !email.trim() || !parentName.trim() || !parentContact.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    const gpaNum = parseFloat(gpa);
    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4.0) {
      setFormError('GPA must be a number between 0.0 and 4.0.');
      return;
    }

    const attendanceNum = parseFloat(attendanceRate);
    if (isNaN(attendanceNum) || attendanceNum < 0 || attendanceNum > 100) {
      setFormError('Attendance rate must be a percentage between 0% and 100%.');
      return;
    }

    const studentData = {
      name,
      email,
      grade,
      parentName,
      parentContact,
      gpa: gpaNum,
      attendanceRate: attendanceNum,
      feeStatus,
      status
    };

    if (editingStudent) {
      updateStudent({
        ...studentData,
        id: editingStudent.id
      });
    } else {
      addStudent(studentData);
    }

    setIsModalOpen(false);
  };

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

  const getStatusDisplay = (val: 'Active' | 'Suspended' | 'Inactive') => {
    switch (val) {
      case 'Active': return t('activeStatus');
      case 'Suspended': return t('onLeaveStatus');
      default: return t('inactiveStatus');
    }
  };

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
    <div className="space-y-6 animate-fade-in">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white tracking-tight">
            {t('studentsTitle')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {t('studentsSub')}
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/10 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addStudentBtn')}</span>
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
            placeholder={t('searchPlaceholderStudents')}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 dark:text-slate-200 transition-all text-xs font-semibold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t('targetAudience')}</span>
          </div>

          {/* Grade filter */}
          <div className="flex items-center gap-1">
            <label className="text-slate-400">{t('gradeCol')}:</label>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-700 dark:text-slate-200 focus:border-sky-500 font-semibold"
            >
              <option value="All">{t('filterAllGrades')}</option>
              <option value="12-Commerce-A">12-Commerce-A</option>
              <option value="12-Commerce-B">12-Commerce-B</option>
              <option value="13-Commerce-A">13-Commerce-A</option>
              <option value="13-Commerce-B">13-Commerce-B</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1">
            <label className="text-slate-400">{t('statusCol')}:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-700 dark:text-slate-200 focus:border-sky-500 font-semibold"
            >
              <option value="All">{t('selectStatus')}</option>
              <option value="Active">{t('activeStatus')}</option>
              <option value="Suspended">{t('onLeaveStatus')}</option>
              <option value="Inactive">{t('inactiveStatus')}</option>
            </select>
          </div>

          {/* Fees status filter */}
          <div className="flex items-center gap-1">
            <label className="text-slate-400">{t('feesCol')}:</label>
            <select
              value={feeFilter}
              onChange={(e) => setFeeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-700 dark:text-slate-200 focus:border-sky-500 font-semibold"
            >
              <option value="All">{t('selectFeeStatus')}</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>
      </div>

      {/* Directory Table Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">{t('formName')}</th>
                <th className="px-6 py-4">{t('gradeCol')}</th>
                <th className="px-6 py-4">{t('gpaCol')}</th>
                <th className="px-6 py-4">{t('attendanceCol')}</th>
                <th className="px-6 py-4">{t('feesCol')}</th>
                <th className="px-6 py-4">{t('statusCol')}</th>
                <th className="px-6 py-4 text-right">{t('actionsCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm font-semibold">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-sky-500 rounded-xl flex items-center justify-center text-white font-bold font-outfit text-sm shadow-md shadow-sky-500/10">
                          {student.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{student.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{student.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-650 dark:text-slate-350">
                      {student.grade}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-bold font-outfit ${
                        student.gpa >= 3.5 ? 'text-emerald-500' : student.gpa >= 3.0 ? 'text-sky-500' : 'text-slate-650 dark:text-slate-350'
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
                        <span className="font-bold font-outfit text-xs text-slate-700 dark:text-slate-300">
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
                        {getStatusDisplay(student.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(student)}
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
                    <p className="text-sm font-semibold">{t('noStudentsFound')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register/Edit Student Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? `${t('editStudent')}: ${editingStudent.name}` : t('registerNewStudent')}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {formError && (
            <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-900/30 font-semibold">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('formName')} *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Smith"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('formEmail')} *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@gmail.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                  required
                />
              </div>
            </div>

            {/* Grade select */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('formGrade')} *
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
              >
                <option value="12-Commerce-A">12-Commerce-A</option>
                <option value="12-Commerce-B">12-Commerce-B</option>
                <option value="13-Commerce-A">13-Commerce-A</option>
                <option value="13-Commerce-B">13-Commerce-B</option>
              </select>
            </div>

            {/* GPA */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('formGPA')} *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.0"
                max="4.0"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="e.g. 3.8"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                required
              />
            </div>

            {/* Parent Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('formParentName')} *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Gary Smith"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                  required
                />
              </div>
            </div>

            {/* Parent Contact */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('formParentContact')} *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={parentContact}
                  onChange={(e) => setParentContact(e.target.value)}
                  placeholder="e.g. +94 77 123 4567"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                  required
                />
              </div>
            </div>

            {/* Attendance Rate */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('attendanceCol')} (%) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={attendanceRate}
                onChange={(e) => setAttendanceRate(e.target.value)}
                placeholder="e.g. 96.5"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                required
              />
            </div>

            {/* Fee Status select */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('formFeeStatus')} *
              </label>
              <select
                value={feeStatus}
                onChange={(e) => setFeeStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            {/* Status select */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('formStatus')} *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
              >
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 font-semibold rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t('cancelBtn')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition-all cursor-pointer"
            >
              {editingStudent ? t('submitBtn') : t('addStudentBtn')}
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
};
