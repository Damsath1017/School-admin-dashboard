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
    deleteTeacher
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
  const [department, setDepartment] = useState('Sciences');
  const [assignedClass, setAssignedClass] = useState('10th Grade');
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
    setDepartment('Sciences');
    setAssignedClass('10th Grade');
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

  const getStatusBadgeColor = (val: 'Active' | 'On Leave' | 'Inactive') => {
    switch (val) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
      case 'On Leave': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800/40 dark:text-slate-400 border-slate-200 dark:border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white tracking-tight">
            Teachers & Staff Directory
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage academic personnel, departments, and class allocations.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-semibold rounded-xl text-sm shadow-lg shadow-sky-500/10 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Hire Teacher</span>
        </button>
      </div>

      {/* Filter Section */}
      <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </div>

          {/* Department filter */}
          <div className="flex items-center gap-1">
            <label className="text-slate-400">Department:</label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-700 dark:text-slate-200 focus:border-sky-500"
            >
              <option value="All">All Departments</option>
              <option value="Sciences">Sciences</option>
              <option value="Humanities">Humanities</option>
              <option value="Social Studies">Social Studies</option>
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
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
            Showing {filteredTeachers.length} of {teachers.length} staff members
          </div>
        </div>
      </div>

      {/* Directory Table Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4">Faculty Member</th>
                <th className="px-6 py-4">Subject expert</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Assigned Class</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold font-outfit text-sm shadow-md shadow-indigo-500/10">
                          {teacher.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{teacher.name}</p>
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
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-500 dark:text-slate-400">
                      {teacher.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-600 dark:text-slate-300">
                      {teacher.assignedClass}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeColor(teacher.status)}`}>
                        {teacher.status}
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
                    <p className="text-sm">No teacher records found</p>
                    <p className="text-xs text-slate-500 mt-1">Try modifying your filter options.</p>
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
        title={editingTeacher ? `Edit Teacher Details: ${editingTeacher.name}` : 'Hire New Faculty Member'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {formError && (
            <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-900/30">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Full Name *
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
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Email Address *
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
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all"
                  required
                />
              </div>
            </div>

            {/* Subject Expert */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Subject Expert *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <BookOpen className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Chemistry, Algebra"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all"
                  required
                />
              </div>
            </div>

            {/* Department select */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all"
              >
                <option value="Sciences">Sciences</option>
                <option value="Humanities">Humanities</option>
                <option value="Social Studies">Social Studies</option>
              </select>
            </div>

            {/* Assigned Class select */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Class Allocation *
              </label>
              <select
                value={assignedClass}
                onChange={(e) => setAssignedClass(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all"
              >
                <option value="9th Grade">9th Grade</option>
                <option value="10th Grade">10th Grade</option>
                <option value="11th Grade">11th Grade</option>
                <option value="12th Grade">12th Grade</option>
              </select>
            </div>

            {/* Status select */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                Contract Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all"
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
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-semibold rounded-xl text-xs shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition-all cursor-pointer"
            >
              {editingTeacher ? 'Save Changes' : 'Hire Teacher'}
            </button>
          </div>

        </form>
      </Modal>

    </div>
  );
};
