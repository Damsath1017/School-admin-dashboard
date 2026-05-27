import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar, 
  ClipboardCheck, 
  DollarSign, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  GraduationCap as AcademyIcon
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface SidebarProps {
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const { currentTab, setCurrentTab, settings } = useDashboard();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Students', icon: Users },
    { name: 'Teachers', icon: GraduationCap },
    { name: 'Schedule', icon: Calendar },
    { name: 'Attendance', icon: ClipboardCheck },
    { name: 'Fees & Payments', icon: DollarSign },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-30 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="min-w-[40px] h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <AcademyIcon className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-outfit font-bold text-lg text-slate-800 dark:text-white truncate">
              {settings.schoolName}
            </span>
          )}
        </div>
        
        {/* Toggle Collapse Button (hidden on mobile, managed in layout) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setCurrentTab(item.name)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all group relative cursor-pointer ${
                isActive 
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/10' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'
              }`} />
              
              {!isCollapsed && (
                <span className="font-outfit text-[14px]">{item.name}</span>
              )}

              {/* Hover Tooltip when Collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-950 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 shadow-md">
                  {item.name}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-medium transition-colors group cursor-pointer"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          {!isCollapsed && <span className="font-outfit text-[14px]">Log Out</span>}
        </button>
      </div>
    </aside>
  );
};
