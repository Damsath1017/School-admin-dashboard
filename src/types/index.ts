export interface Student {
  id: string;
  name: string;
  grade: string;
  email: string;
  parentName: string;
  parentContact: string;
  attendanceRate: number; // percentage, e.g., 96.5
  gpa: number; // e.g. 3.8
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
  status: 'Active' | 'Suspended' | 'Inactive';
  avatarUrl?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  department: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  assignedClass: string;
  avatarUrl?: string;
}

export interface ActivityLog {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  time: string; // ISO String or relative time
  type: 'info' | 'success' | 'warning' | 'danger';
}

export interface ScheduleEvent {
  id: string;
  class: string;
  subject: string;
  teacher: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string; // e.g. "08:30 - 09:30"
  room: string;
}

export interface FeeTransaction {
  id: string;
  studentName: string;
  grade: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  type: 'Tuition' | 'Library' | 'Sports' | 'Lab';
}

export interface SchoolSettings {
  schoolName: string;
  academicYear: string;
  email: string;
  phone: string;
  address: string;
  enableNotifications: boolean;
  lowAttendanceAlert: number; // threshold e.g. 85
  systemTheme: 'light' | 'dark' | 'system';
  brandingColor: string; // hex code
}
