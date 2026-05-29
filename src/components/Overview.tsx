import React from 'react';
import { Users, GraduationCap, ClipboardCheck, DollarSign, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const Overview: React.FC = () => {
  const { students, teachers, transactions } = useDashboard();

  // Dynamic Metrics calculations
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  
  const avgAttendance = parseFloat(
    (students.reduce((acc, s) => acc + s.attendanceRate, 0) / totalStudents).toFixed(1)
  ) || 0;

  const totalRevenue = transactions
    .filter(t => t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);

  // Growth percentages (simulated based on static values)
  const studentGrowth = 8.4;
  const teacherGrowth = 2.1;
  const attendanceGrowth = -0.5;
  const revenueGrowth = 12.8;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Students',
      value: totalStudents,
      change: `+${studentGrowth}%`,
      isPositive: true,
      timeframe: 'vs last term',
      icon: Users,
      color: 'sky'
    },
    {
      title: 'Total Teachers',
      value: totalTeachers,
      change: `+${teacherGrowth}%`,
      isPositive: true,
      timeframe: 'vs last term',
      icon: GraduationCap,
      color: 'indigo'
    },
    {
      title: 'Avg. Attendance',
      value: `${avgAttendance}%`,
      change: `${attendanceGrowth}%`,
      isPositive: false,
      timeframe: 'vs last week',
      icon: ClipboardCheck,
      color: 'emerald'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: `+${revenueGrowth}%`,
      isPositive: true,
      timeframe: 'this month',
      icon: DollarSign,
      color: 'amber'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'indigo':
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-950/30',
          text: 'text-indigo-600 dark:text-indigo-400',
          border: 'border-indigo-100 dark:border-indigo-900/30',
          glow: 'shadow-indigo-500/10'
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/30',
          text: 'text-emerald-600 dark:text-emerald-400',
          border: 'border-emerald-100 dark:border-emerald-900/30',
          glow: 'shadow-emerald-500/10'
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/30',
          text: 'text-amber-600 dark:text-amber-400',
          border: 'border-amber-100 dark:border-amber-900/30',
          glow: 'shadow-amber-500/10'
        };
      default: // sky
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/30',
          text: 'text-sky-600 dark:text-sky-400',
          border: 'border-sky-100 dark:border-sky-900/30',
          glow: 'shadow-sky-500/10'
        };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title & Introduction Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Real-time analytics and management operations summary.
          </p>
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl w-fit">
          <ArrowUpRight className="w-3.5 h-3.5 text-sky-500" />
          <span>Live calculations from local database</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          const style = getColorClasses(card.color);

          return (
            <div
              key={card.title}
              className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md ${style.glow} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${style.bg} ${style.text} border ${style.border} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg ${
                  card.isPositive 
                    ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/20' 
                    : 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/20'
                }`}>
                  {card.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{card.change}</span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold font-outfit text-slate-800 dark:text-white mt-1">
                  {card.value}
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  {card.timeframe}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Charts Placeholder - to be filled in Commit 2 and 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md min-h-[300px] flex items-center justify-center">
          <p className="text-sm text-slate-400">Loading Student performance analytics...</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md min-h-[300px] flex items-center justify-center">
          <p className="text-sm text-slate-400">Loading Weekly attendance reports...</p>
        </div>
      </div>
    </div>
  );
};
