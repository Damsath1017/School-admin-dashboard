import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  SlidersHorizontal, 
  User, 
  Mail, 
  BookOpen
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { Modal } from './Modal';
import type { Teacher } from '../types';

export const TeachersList: React.FC = () => {
  const { 
    teachers, 
    addTeacher, 
    updateTeacher, 
    deleteTeacher,
    t
  } = useDashboard();

  // Filter States
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal Control States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Form Field States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('Commerce Dept.');
  const [assignedClass, setAssignedClass] = useState('12-Commerce-A');
  const [status, setStatus] = useState<'Active' | 'On Leave' | 'Inactive'>('Active');
  
  // Validation State
  const [formError, setFormError] = useState('');

  // Handle Edit Trigger
  const handleEditClick = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setName(teacher.name);
    setEmail(teacher.email);
    setSubject(teacher.subject);
    setDepartment(teacher.department);
    setAssignedClass(teacher.assignedClass);
    setStatus(teacher.status);
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle Add New Trigger
  const handleAddClick = () => {
    setEditingTeacher(null);
    setName('');
    setEmail('');
    setSubject('');
    setDepartment('Commerce Dept.');
    setAssignedClass('12-Commerce-A');
    setStatus('Active');
    setFormError('');
    setIsModalOpen(true);
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!name.trim() || !email.trim() || !subject.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    const teacherData = {
      name,
      email,
      subject,
      department,
      assignedClass,
      status
    };

    if (editingTeacher) {
      updateTeacher({
        ...teacherData,
        id: editingTeacher.id
      });
    } else {
      addTeacher(teacherData);
    }

    setIsModalOpen(false);
  };

  // Filter teachers array based on queries
  const filteredTeachers = teachers.filter((teacher) => {
    // Filter selects matches
    const matchesDept = deptFilter === 'All' || teacher.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || teacher.status === statusFilter;

    return matchesDept && matchesStatus;
  });

  const getStatusDisplay = (val: 'Active' | 'On Leave' | 'Inactive') => {
    switch (val) {
      case 'Active': return t('activeStatus');
      case 'On Leave': return t('onLeaveStatus');
      default: return t('inactiveStatus');
    }
  };

  const getStatusBadgeColor = (val: 'Active' | 'On Leave' | 'Inactive') => {
    switch (val) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
      case 'On Leave': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-400 border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white tracking-tight">
            {t('teachersTitle')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {t('teachersSub')}
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/10 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addTeacherBtn')}</span>
        </button>
      </div>

      {/* Filter Section */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t('targetAudience')}</span>
          </div>

          {/* Department filter */}
          <div className="flex items-center gap-1">
            <label className="text-slate-400">{t('deptCol')}:</label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-700 dark:text-slate-200 focus:border-sky-500 font-semibold"
            >
              <option value="All">{t('filterAllDepts')}</option>
              <option value="Commerce Dept.">Commerce Dept.</option>
              <option value="Languages Dept.">Languages Dept.</option>
              <option value="IT Dept.">IT Dept.</option>
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
              <option value="On Leave">{t('onLeaveStatus')}</option>
              <option value="Inactive">{t('inactiveStatus')}</option>
            </select>
          </div>

          <div className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            Showing {filteredTeachers.length} of {teachers.length} staff members
          </div>
        </div>
      </div>

      {/* Directory Table Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">{t('teachers')}</th>
                <th className="px-6 py-4">{t('subjectCol')}</th>
                <th className="px-6 py-4">{t('deptCol')}</th>
                <th className="px-6 py-4">{t('formAssignedClass')}</th>
                <th className="px-6 py-4">{t('statusCol')}</th>
                <th className="px-6 py-4 text-right">{t('actionsCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm font-semibold">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold font-outfit text-sm shadow-md shadow-indigo-500/10">
                          {teacher.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{teacher.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{teacher.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>{teacher.subject}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium">
                      {teacher.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-650 dark:text-slate-350">
                      {teacher.assignedClass}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeColor(teacher.status)}`}>
                        {getStatusDisplay(teacher.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditClick(teacher)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/20 hover:border-sky-200 dark:hover:border-sky-900/30 transition-all cursor-pointer"
                          title="Edit Profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTeacher(teacher.id)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-200 dark:hover:border-rose-900/30 transition-all cursor-pointer"
                          title="Terminate Contract"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">{t('noTeachersFound')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hire/Edit Teacher Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingTeacher ? `${t('editTeacher')}: ${editingTeacher.name}` : t('addTeacherBtn')}
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
                  placeholder="e.g. Dr. John Doe"
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
                  placeholder="e.g. john.doe@school.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                  required
                />
              </div>
            </div>

            {/* Subject Expert */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('subjectCol')} *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <BookOpen className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Economics, Accounting"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                  required
                />
              </div>
            </div>

            {/* Department select */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('deptCol')} *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
              >
                <option value="Commerce Dept.">Commerce Dept.</option>
                <option value="Languages Dept.">Languages Dept.</option>
                <option value="IT Dept.">IT Dept.</option>
              </select>
            </div>

            {/* Assigned Class select */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('formAssignedClass')} *
              </label>
              <select
                value={assignedClass}
                onChange={(e) => setAssignedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
              >
                <option value="12-Commerce-A">12-Commerce-A</option>
                <option value="12-Commerce-B">12-Commerce-B</option>
                <option value="12-Commerce-C">12-Commerce-C</option>
                <option value="12-Commerce-D">12-Commerce-D</option>
                <option value="13-Commerce-A">13-Commerce-A</option>
                <option value="13-Commerce-B">13-Commerce-B</option>
                <option value="13-Commerce-C">13-Commerce-C</option>
                <option value="13-Commerce-D">13-Commerce-D</option>
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
                <option value="On Leave">On Leave</option>
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
              {editingTeacher ? t('submitBtn') : t('addTeacherBtn')}
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
};
