import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const ScheduleView: React.FC = () => {
  const { schedules, t, settings } = useDashboard();
  const [selectedDay, setSelectedDay] = useState<'All' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('All');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

  const dayTranslations: Record<string, string> = {
    Monday: t('dayMonday'),
    Tuesday: t('dayTuesday'),
    Wednesday: t('dayWednesday'),
    Thursday: t('dayThursday'),
    Friday: t('dayFriday'),
  };

  // Filter schedules based on selected day tab
  const filteredSchedules = schedules.filter(
    (event) => selectedDay === 'All' || event.day === selectedDay
  );

  // Group schedules by day for "All days" view
  const getSchedulesByDay = (day: typeof days[number]) => {
    return schedules.filter((event) => event.day === day);
  };

  const getDepartmentColor = (subject: string) => {
    const s = subject.toLowerCase();
    if (s.includes('accounting') || s.includes('commerce')) {
      return 'border-l-sky-500 bg-sky-500/5 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400';
    }
    if (s.includes('economics') || s.includes('business')) {
      return 'border-l-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400';
    }
    return 'border-l-emerald-500 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'; // English/ICT
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Introduction Section */}
      <div>
        <h1 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white tracking-tight">
          {t('scheduleTitle')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t('scheduleSub')}
        </p>
      </div>

      {/* Weekday Tab Switcher */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setSelectedDay('All')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            selectedDay === 'All'
              ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-bold'
          }`}
        >
          {settings.systemLanguage === 'si' ? 'සම්පූර්ණ සතිය' : 'Full Week'}
        </button>
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              selectedDay === day
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 font-bold'
            }`}
          >
            {dayTranslations[day]}
          </button>
        ))}
      </div>

      {/* Timetable Grid */}
      {selectedDay !== 'All' ? (
        // Single Day View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-semibold">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((event) => (
              <div
                key={event.id}
                className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-4 ${getDepartmentColor(
                  event.subject
                )} shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between mb-3.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {event.class}
                  </span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                    {event.id}
                  </span>
                </div>

                <h3 className="text-base font-bold font-outfit text-slate-800 dark:text-white mb-4">
                  {event.subject}
                </h3>

                <div className="space-y-2 text-xs text-slate-550 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                    <span>{event.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                    <span className="font-semibold">{event.room}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-12 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm">No periods scheduled for {dayTranslations[selectedDay]}</p>
            </div>
          )}
        </div>
      ) : (
        // Full Week Grouped View
        <div className="space-y-8 font-semibold">
          {days.map((day) => {
            const dayEvents = getSchedulesByDay(day);
            return (
              <div key={day} className="space-y-4">
                <h3 className="font-outfit font-bold text-lg text-slate-800 dark:text-slate-200 border-l-2 border-sky-500 pl-3">
                  {dayTranslations[day]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dayEvents.length > 0 ? (
                    dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-l-4 ${getDepartmentColor(
                          event.subject
                        )} shadow-sm hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-center justify-between mb-3.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {event.class}
                          </span>
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                            {event.id}
                          </span>
                        </div>

                        <h3 className="text-base font-bold font-outfit text-slate-800 dark:text-white mb-4">
                          {event.subject}
                        </h3>

                        <div className="space-y-2 text-xs text-slate-550 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                            <span>{event.teacher}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                            <span className="font-semibold">{event.room}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full p-8 text-center text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
                      <p className="text-xs">No periods scheduled for this day</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
