import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Student, Teacher, ActivityLog, ScheduleEvent, FeeTransaction, SchoolSettings } from '../types';
import { translations } from '../utils/translations';

interface DashboardContextType {
  students: Student[];
  teachers: Teacher[];
  activities: ActivityLog[];
  schedules: ScheduleEvent[];
  transactions: FeeTransaction[];
  settings: SchoolSettings;
  theme: 'light' | 'dark';
  currentTab: string;
  searchQuery: string;
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;
  addActivity: (action: string, target: string, type: ActivityLog['type']) => void;
  updateSettings: (settings: SchoolSettings) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrentTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  resetDatabase: () => void;
  triggerToast: (message: string, type: 'success' | 'info' | 'error') => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  t: (key: keyof typeof translations['en']) => string;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Initial Seed Data
const initialStudents: Student[] = [
  { id: 'STU-1001', name: 'Alex Johnson', grade: '12-Commerce-A', email: 'alex.j@school.com', parentName: 'Mark Johnson', parentContact: '+94 77 123 4567', attendanceRate: 98.2, gpa: 3.9, feeStatus: 'Paid', status: 'Active' },
  { id: 'STU-1002', name: 'Sophia Smith', grade: '13-Commerce-A', email: 'sophia.s@school.com', parentName: 'Helen Smith', parentContact: '+94 71 234 5678', attendanceRate: 94.5, gpa: 3.7, feeStatus: 'Paid', status: 'Active' },
  { id: 'STU-1003', name: 'Liam Miller', grade: '12-Commerce-B', email: 'liam.m@school.com', parentName: 'Paul Miller', parentContact: '+94 76 345 6789', attendanceRate: 88.0, gpa: 3.1, feeStatus: 'Pending', status: 'Active' },
  { id: 'STU-1004', name: 'Olivia Davis', grade: '13-Commerce-B', email: 'olivia.d@school.com', parentName: 'Ruth Davis', parentContact: '+94 72 456 7890', attendanceRate: 97.8, gpa: 4.0, feeStatus: 'Paid', status: 'Active' },
  { id: 'STU-1005', name: 'Noah Wilson', grade: '12-Commerce-A', email: 'noah.w@school.com', parentName: 'Gary Wilson', parentContact: '+94 75 567 8901', attendanceRate: 82.3, gpa: 2.8, feeStatus: 'Overdue', status: 'Active' },
  { id: 'STU-1006', name: 'Emma Martinez', grade: '13-Commerce-A', email: 'emma.m@school.com', parentName: 'Maria Martinez', parentContact: '+94 77 678 9012', attendanceRate: 95.1, gpa: 3.5, feeStatus: 'Paid', status: 'Active' },
  { id: 'STU-1007', name: 'Jackson Anderson', grade: '13-Commerce-B', email: 'jackson.a@school.com', parentName: 'Scott Anderson', parentContact: '+94 71 789 0123', attendanceRate: 92.4, gpa: 3.2, feeStatus: 'Pending', status: 'Active' },
  { id: 'STU-1008', name: 'Ava Taylor', grade: '12-Commerce-B', email: 'ava.t@school.com', parentName: 'Lisa Taylor', parentContact: '+94 70 890 1234', attendanceRate: 96.0, gpa: 3.6, feeStatus: 'Paid', status: 'Active' },
  { id: 'STU-1009', name: 'Lucas Thomas', grade: '12-Commerce-A', email: 'lucas.t@school.com', parentName: 'David Thomas', parentContact: '+94 78 901 2345', attendanceRate: 79.5, gpa: 2.4, feeStatus: 'Overdue', status: 'Suspended' },
  { id: 'STU-1010', name: 'Isabella White', grade: '13-Commerce-B', email: 'isabella.w@school.com', parentName: 'John White', parentContact: '+94 77 012 3456', attendanceRate: 99.1, gpa: 3.95, feeStatus: 'Paid', status: 'Active' },
];

const initialTeachers: Teacher[] = [
  { id: 'TCH-201', name: 'Dr. Sarah Connor', email: 's.connor@school.com', subject: 'Economics', department: 'Commerce Dept.', status: 'Active', assignedClass: '12-Commerce-A' },
  { id: 'TCH-202', name: 'Prof. Albus Dumbledore', email: 'a.dumbledore@school.com', subject: 'English', department: 'Languages Dept.', status: 'Active', assignedClass: '13-Commerce-B' },
  { id: 'TCH-203', name: 'Walter White', email: 'w.white@school.com', subject: 'Accounting', department: 'Commerce Dept.', status: 'Active', assignedClass: '13-Commerce-A' },
  { id: 'TCH-204', name: 'Indiana Jones', email: 'i.jones@school.com', subject: 'Business Studies', department: 'Commerce Dept.', status: 'Active', assignedClass: '12-Commerce-B' },
  { id: 'TCH-205', name: 'Sherlock Holmes', email: 's.holmes@school.com', subject: 'Economics', department: 'Commerce Dept.', status: 'On Leave', assignedClass: '13-Commerce-A' },
  { id: 'TCH-206', name: 'Minerva McGonagall', email: 'm.mcgonagall@school.com', subject: 'ICT', department: 'IT Dept.', status: 'Active', assignedClass: '12-Commerce-A' },
];

const initialSchedules: ScheduleEvent[] = [
  { id: 'SCH-301', class: '12-Commerce-A', subject: 'Economics', teacher: 'Dr. Sarah Connor', day: 'Monday', time: '08:30 - 09:30', room: 'Room Com-101' },
  { id: 'SCH-302', class: '13-Commerce-B', subject: 'English', teacher: 'Prof. Albus Dumbledore', day: 'Monday', time: '09:45 - 10:45', room: 'Room Lang-02' },
  { id: 'SCH-303', class: '13-Commerce-A', subject: 'Accounting', teacher: 'Walter White', day: 'Tuesday', time: '11:00 - 12:00', room: 'Room Com-201' },
  { id: 'SCH-304', class: '12-Commerce-B', subject: 'Business Studies', teacher: 'Indiana Jones', day: 'Wednesday', time: '08:30 - 09:30', room: 'Room Com-102' },
  { id: 'SCH-305', class: '13-Commerce-A', subject: 'Economics', teacher: 'Sherlock Holmes', day: 'Thursday', time: '13:30 - 14:30', room: 'Room Com-201' },
  { id: 'SCH-306', class: '12-Commerce-A', subject: 'ICT', teacher: 'Minerva McGonagall', day: 'Friday', time: '10:00 - 11:00', room: 'IT Lab A' },
];

const initialTransactions: FeeTransaction[] = [
  { id: 'TXN-9001', studentName: 'Alex Johnson', grade: '12-Commerce-A', amount: 1500, date: '2026-05-15', status: 'Paid', type: 'Tuition' },
  { id: 'TXN-9002', studentName: 'Sophia Smith', grade: '13-Commerce-A', amount: 1500, date: '2026-05-14', status: 'Paid', type: 'Tuition' },
  { id: 'TXN-9003', studentName: 'Noah Wilson', grade: '12-Commerce-A', amount: 150, date: '2026-05-10', status: 'Overdue', type: 'Sports' },
  { id: 'TXN-9004', studentName: 'Liam Miller', grade: '12-Commerce-B', amount: 1500, date: '2026-05-08', status: 'Pending', type: 'Tuition' },
  { id: 'TXN-9005', studentName: 'Olivia Davis', grade: '13-Commerce-B', amount: 200, date: '2026-05-04', status: 'Paid', type: 'Lab' },
  { id: 'TXN-9006', studentName: 'Lucas Thomas', grade: '12-Commerce-A', amount: 1500, date: '2026-05-01', status: 'Overdue', type: 'Tuition' },
];

const defaultSettings: SchoolSettings = {
  schoolName: "Prince of Wales' College",
  academicYear: '2025 - 2026',
  email: 'commerce@princeofwales.edu.lk',
  phone: '+94 11 264 5628',
  address: "Prince of Wales' College, Galle Road, Moratuwa, Sri Lanka",
  enableNotifications: true,
  lowAttendanceAlert: 85,
  systemTheme: 'light',
  brandingColor: '#6b21a8', // Purple
  systemLanguage: 'en',
};

const initialActivities: ActivityLog[] = [
  { id: 'ACT-001', user: 'Admin User', role: 'Super Admin', action: 'Added Teacher', target: 'Minerva McGonagall', time: '10 mins ago', type: 'success' },
  { id: 'ACT-002', user: 'Admin User', role: 'Super Admin', action: 'Logged in', target: 'Console Panel', time: '1 hour ago', type: 'info' },
  { id: 'ACT-003', user: 'Finance Dept', role: 'Staff', action: 'Flagged overdue fees', target: 'Noah Wilson', time: '4 hours ago', type: 'warning' },
  { id: 'ACT-004', user: 'Registrar Office', role: 'Staff', action: 'Suspended student', target: 'Lucas Thomas', time: '1 day ago', type: 'danger' },
  { id: 'ACT-005', user: 'Admin User', role: 'Super Admin', action: 'Updated timetable', target: 'Accounting Class', time: '2 days ago', type: 'info' },
];

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('school_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('school_teachers');
    return saved ? JSON.parse(saved) : initialTeachers;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('school_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [schedules, setSchedules] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem('school_schedules');
    return saved ? JSON.parse(saved) : initialSchedules;
  });

  const [transactions, setTransactions] = useState<FeeTransaction[]>(() => {
    const saved = localStorage.getItem('school_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem('school_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('school_theme') as 'light' | 'dark' | null;
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [currentTab, setCurrentTab] = useState<string>('Overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('school_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('school_teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('school_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('school_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('school_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('school_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('school_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Toast Trigger
  const triggerToast = (message: string, type: 'success' | 'info' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Translation helper function
  const t = (key: keyof typeof translations['en']): string => {
    const lang = settings.systemLanguage || 'en';
    const dict = translations[lang] as Record<string, string>;
    return dict[key] || translations['en'][key] || String(key);
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    triggerToast(`Theme switched to ${newTheme} mode!`, 'info');
  };

  // Activity Logger
  const addActivity = (action: string, target: string, type: ActivityLog['type']) => {
    const newLog: ActivityLog = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      user: 'Admin User',
      role: 'Super Admin',
      action,
      target,
      time: 'Just now',
      type
    };
    setActivities(prev => [newLog, ...prev.slice(0, 15)]);
  };

  // Student Actions
  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newId = `STU-${Math.floor(1000 + Math.random() * 9000)}`;
    const newStudent: Student = { ...studentData, id: newId };
    setStudents(prev => [...prev, newStudent]);
    addActivity('Added Student', newStudent.name, 'success');
    triggerToast(`Successfully added student ${newStudent.name}!`, 'success');
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    addActivity('Updated Student Profile', updatedStudent.name, 'info');
    triggerToast(`Updated profile for ${updatedStudent.name}`, 'success');
  };

  const deleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    if (!student) return;
    setStudents(prev => prev.filter(s => s.id !== id));
    addActivity('Deleted Student', student.name, 'danger');
    triggerToast(`Removed student ${student.name} from records.`, 'error');
  };

  // Teacher Actions
  const addTeacher = (teacherData: Omit<Teacher, 'id'>) => {
    const newId = `TCH-${Math.floor(200 + Math.random() * 800)}`;
    const newTeacher: Teacher = { ...teacherData, id: newId };
    setTeachers(prev => [...prev, newTeacher]);
    addActivity('Added Teacher', newTeacher.name, 'success');
    triggerToast(`Successfully added teacher ${newTeacher.name}!`, 'success');
  };

  const updateTeacher = (updatedTeacher: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
    addActivity('Updated Teacher Profile', updatedTeacher.name, 'info');
    triggerToast(`Updated profile for ${updatedTeacher.name}`, 'success');
  };

  const deleteTeacher = (id: string) => {
    const teacher = teachers.find(t => t.id === id);
    if (!teacher) return;
    setTeachers(prev => prev.filter(t => t.id !== id));
    addActivity('Deleted Teacher', teacher.name, 'danger');
    triggerToast(`Removed teacher ${teacher.name} from records.`, 'error');
  };

  const updateSettings = (updatedSettings: SchoolSettings) => {
    setSettings(updatedSettings);
    addActivity('Updated School Settings', 'Configuration', 'info');
    triggerToast('Settings saved successfully!', 'success');
  };

  const resetDatabase = () => {
    localStorage.removeItem('school_students');
    localStorage.removeItem('school_teachers');
    localStorage.removeItem('school_activities');
    localStorage.removeItem('school_schedules');
    localStorage.removeItem('school_transactions');
    localStorage.removeItem('school_settings');
    localStorage.removeItem('school_theme');

    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setActivities(initialActivities);
    setSchedules(initialSchedules);
    setTransactions(initialTransactions);
    setSettings(defaultSettings);
    setThemeState('light');
    setCurrentTab('Overview');
    setSearchQuery('');
    triggerToast('Database reset to initial demo seeds!', 'info');
  };

  return (
    <DashboardContext.Provider value={{
      students,
      teachers,
      activities,
      schedules,
      transactions,
      settings,
      theme,
      currentTab,
      searchQuery,
      addStudent,
      updateStudent,
      deleteStudent,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      addActivity,
      updateSettings,
      setTheme,
      setCurrentTab,
      setSearchQuery,
      resetDatabase,
      triggerToast,
      toast,
      t
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard must be used within DashboardProvider');
  return context;
};
