import React from 'react';
import { Users, GraduationCap, ClipboardCheck, DollarSign, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const Overview: React.FC = () => {
  const { students, teachers, transactions, theme } = useDashboard();

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

  // GPA Distribution Calculation
  const gpaBrackets = {
    'A (3.5 - 4.0)': students.filter(s => s.gpa >= 3.5).length,
    'B (3.0 - 3.49)': students.filter(s => s.gpa >= 3.0 && s.gpa < 3.5).length,
    'C (2.5 - 2.99)': students.filter(s => s.gpa >= 2.5 && s.gpa < 3.0).length,
    'D/F (< 2.5)': students.filter(s => s.gpa < 2.5).length,
  };

  // ChartJS Data Configurations
  const barChartData = {
    labels: Object.keys(gpaBrackets),
    datasets: [
      {
        label: 'Number of Students',
        data: Object.values(gpaBrackets),
        backgroundColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(14, 165, 233, 0.75)',
        borderColor: theme === 'dark' ? '#38bdf8' : '#0ea5e9',
        borderWidth: 1.5,
        borderRadius: 8,
        barPercentage: 0.6,
      }
    ]
  };

  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Attendance Rate (%)',
        data: [94.2, 95.8, 93.1, 95.0, avgAttendance],
        fill: true,
        backgroundColor: theme === 'dark' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
        borderColor: '#6366f1',
        borderWidth: 2.5,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        tension: 0.35,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
        titleColor: theme === 'dark' ? '#ffffff' : '#0f172a',
        bodyColor: '#64748b',
        borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Inter',
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: theme === 'dark' ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)',
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Inter',
            size: 11
          },
          stepSize: 1
        }
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        min: 80,
        max: 100,
        ticks: {
          ...chartOptions.scales.y.ticks,
          stepSize: 5
        }
      }
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
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Student Performance Bar Chart */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-white">GPA Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Academic Performance of Active Students</p>
          </div>
          <div className="h-64 relative">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Weekly Attendance Line Chart */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-white">Weekly Attendance Trend</h3>
            <p className="text-xs text-slate-400 mt-0.5">Percentage of Present Students</p>
          </div>
          <div className="h-64 relative">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

      </div>
    </div>
  );
};
