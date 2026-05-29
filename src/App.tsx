import React, { useState } from 'react';
import { useDashboard } from './context/DashboardContext';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Overview } from './components/Overview';
import { StudentsList } from './components/StudentsList';
import { TeachersList } from './components/TeachersList';
import { ScheduleView } from './components/ScheduleView';
import { AttendanceTracker } from './components/AttendanceTracker';
import { FinanceTracker } from './components/FinanceTracker';
import { Settings } from './components/Settings';
import { 
  CheckCircle2, 
  Info, 
  AlertTriangle
} from 'lucide-react';

const App: React.FC = () => {
  const { currentTab, toast, triggerToast } = useDashboard();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('school_admin_auth') === 'true';
  });

  const handleLoginSuccess = () => {
    sessionStorage.setItem('school_admin_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('school_admin_auth');
    setIsAuthenticated(false);
    triggerToast('Logged out securely.', 'info');
  };

  // Callback mockups for quick add actions
  const triggerQuickAddStudent = () => {
    triggerToast('Add Student form will be available in Day 4!', 'info');
  };

  const triggerQuickAddTeacher = () => {
    triggerToast('Add Teacher form will be available in Day 4!', 'info');
  };

  // Render view depending on active navigation tab
  const renderActiveView = () => {
    switch (currentTab) {
      case 'Overview':
        return <Overview />;
      case 'Students':
        return <StudentsList />;
      case 'Teachers':
        return <TeachersList />;
      case 'Schedule':
        return <ScheduleView />;
      case 'Attendance':
        return <AttendanceTracker />;
      case 'Fees & Payments':
        return <FinanceTracker />;
      case 'Settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Sidebar navigation */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Panel Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        
        {/* Header toolbar */}
        <Header 
          onLogout={handleLogout} 
          onQuickAddStudent={triggerQuickAddStudent}
          onQuickAddTeacher={triggerQuickAddTeacher}
        />

        {/* Dynamic page contents view */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
          <div className="animate-fade-in">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Persistent global toast notification alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl animate-slide-in max-w-sm">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-sky-500 shrink-0" />}
          {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />}
          
          <div className="flex-1 text-xs font-medium text-slate-700 dark:text-slate-200">
            {toast.message}
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
