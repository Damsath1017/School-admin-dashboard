import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Plus, 
  ChevronDown, 
  HelpCircle, 
  User, 
  LogOut
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface HeaderProps {
  onLogout: () => void;
  onQuickAddStudent: () => void;
  onQuickAddTeacher: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout, onQuickAddStudent, onQuickAddTeacher }) => {
  const { 
    theme, 
    setTheme, 
    searchQuery, 
    setSearchQuery, 
    currentTab, 
    setCurrentTab,
    students,
    t
  } = useDashboard();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);

  // Active notifications computed from state alerts
  const lowAttendanceStudents = students.filter(s => s.attendanceRate < 85);
  const overdueTransactions = students.filter(s => s.feeStatus === 'Overdue');
  
  const notifications = [
    ...lowAttendanceStudents.map(s => ({
      id: `att-${s.id}`,
      title: 'Low Attendance Warning',
      text: `${s.name} is at ${s.attendanceRate}% attendance.`,
      type: 'warning' as const,
      time: 'Check Profile'
    })),
    ...overdueTransactions.map(s => ({
      id: `fee-${s.id}`,
      title: 'Fee Payment Overdue',
      text: `${s.name} fees are flag overdue.`,
      type: 'danger' as const,
      time: 'Send Alert'
    }))
  ].slice(0, 5);

  const getNotificationBadgeColor = (type: 'info' | 'success' | 'warning' | 'danger') => {
    switch (type) {
      case 'success': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'danger': return 'bg-rose-500';
      default: return 'bg-sky-500';
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6 transition-colors duration-200">
      
      {/* Search Input Bar (only relevant for Student/Teacher lists) */}
      <div className="flex-1 max-w-md hidden md:block">
        {(currentTab === 'Students' || currentTab === 'Teachers') && (
          <div className="relative group animate-fade-in">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 group-focus-within:text-sky-500 transition-colors">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentTab === 'Teachers' ? t('searchPlaceholderTeachers') : t('searchPlaceholderStudents')}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800/80 border border-transparent dark:border-slate-800 rounded-xl outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 dark:text-slate-200 transition-all text-sm font-semibold"
            />
          </div>
        )}
      </div>

      <div className="md:hidden font-outfit font-bold text-lg text-slate-800 dark:text-white">
        {currentTab === 'Profile' ? t('myProfile') : currentTab === 'KnowledgeBase' ? t('knowledgeBase') : currentTab}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4 ml-auto">
        
        {/* Quick Add Action */}
        <div className="relative">
          <button
            onClick={() => setShowQuickAddMenu(!showQuickAddMenu)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-semibold rounded-xl text-xs shadow-md shadow-sky-500/10 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('quickAdd')}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showQuickAddMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowQuickAddMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-20 animate-fade-in text-sm font-semibold">
                <button
                  onClick={() => {
                    setShowQuickAddMenu(false);
                    onQuickAddStudent();
                  }}
                  className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {t('regStudent')}
                </button>
                <button
                  onClick={() => {
                    setShowQuickAddMenu(false);
                    onQuickAddTeacher();
                  }}
                  className="w-full text-left px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border-t border-slate-100 dark:border-slate-700"
                >
                  {t('hireTeacher')}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
        </button>

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-800 relative hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-[8px] font-bold text-white">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl z-20 overflow-hidden animate-fade-in">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="font-outfit font-bold text-sm text-slate-800 dark:text-white">{t('notificationsTitle')}</h3>
                  <span className="text-[10px] text-slate-400 font-medium">Auto Updates</span>
                </div>
                
                <div className="divide-y divide-slate-100 dark:divide-slate-700 max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <div className="flex gap-2.5">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getNotificationBadgeColor(notif.type)}`}></div>
                          <div>
                            <p className="font-semibold text-xs text-slate-800 dark:text-slate-100">{notif.title}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">{notif.text}</p>
                            <span 
                              onClick={() => {
                                setShowNotifications(false);
                                if (notif.id.startsWith('att')) setCurrentTab('Students');
                                else setCurrentTab('Fees & Payments');
                              }}
                              className="text-[10px] text-sky-500 font-semibold cursor-pointer hover:underline mt-1.5 block"
                            >
                              {notif.time} &rarr;
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      <p className="text-sm">All logs healthy</p>
                      <p className="text-xs text-slate-500 mt-1">No warnings or overdue bills active.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

        {/* Profile Card */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800/80 p-1.5 rounded-xl transition-colors text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold font-outfit text-sm shadow shadow-indigo-500/20">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">Admin User</p>
              <p className="text-[10px] text-slate-400 font-medium">{t('profileConsole')}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1.5 z-20 text-sm font-semibold">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 sm:hidden">
                  <p className="font-semibold text-xs text-slate-800 dark:text-slate-100">Admin User</p>
                  <p className="text-[10px] text-slate-400 font-medium">{t('profileConsole')}</p>
                </div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setCurrentTab('Profile');
                  }}
                  className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>{t('myProfile')}</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setCurrentTab('KnowledgeBase');
                  }}
                  className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>{t('knowledgeBase')}</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors flex items-center gap-2 border-t border-slate-100 dark:border-slate-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
};
