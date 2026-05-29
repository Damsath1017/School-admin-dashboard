import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Database, Trash2, Download, AlertTriangle } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const Settings: React.FC = () => {
  const { settings, updateSettings, resetDatabase, triggerToast, students, teachers, transactions, schedules } = useDashboard();

  // Settings states
  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [academicYear, setAcademicYear] = useState(settings.academicYear);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [enableNotifications, setEnableNotifications] = useState(settings.enableNotifications);
  const [lowAttendanceAlert, setLowAttendanceAlert] = useState(settings.lowAttendanceAlert.toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const attendanceNum = parseInt(lowAttendanceAlert);
    if (isNaN(attendanceNum) || attendanceNum < 0 || attendanceNum > 100) {
      triggerToast('Attendance alert threshold must be between 0% and 100%.', 'error');
      setIsSaving(false);
      return;
    }

    setTimeout(() => {
      updateSettings({
        schoolName,
        academicYear,
        email,
        phone,
        address,
        enableNotifications,
        lowAttendanceAlert: attendanceNum,
        systemTheme: settings.systemTheme,
        brandingColor: settings.brandingColor
      });
      setIsSaving(false);
    }, 800);
  };

  // Back up data to JSON and download
  const handleBackupDatabase = () => {
    try {
      const backupData = {
        students,
        teachers,
        transactions,
        schedules,
        settings,
        backupDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(backupData, null, 2)
      )}`;
      
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', `${schoolName.toLowerCase().replace(/\s+/g, '_')}_db_backup.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      triggerToast('Database backup downloaded successfully!', 'success');
    } catch (err) {
      triggerToast('Failed to export database backup.', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Title & Introduction Section */}
      <div>
        <h1 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white tracking-tight">
          System Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Customize school information, notification thresholds, and manage data backups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Core settings Form - Takes 2 columns */}
        <div className="md:col-span-2 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-sky-500" />
            <span>School Parameters</span>
          </h3>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            
            {/* School Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                School Name
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Academic Year */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Academic Term / Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                  required
                />
              </div>

              {/* Attendance Threshold */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Low Attendance Limit (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={lowAttendanceAlert}
                  onChange={(e) => setLowAttendanceAlert(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                School Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all resize-none font-semibold"
                required
              ></textarea>
            </div>

            {/* Notification Checkbox */}
            <div className="flex items-center gap-2.5 pt-2">
              <input
                type="checkbox"
                id="notify"
                checked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
                className="w-4.5 h-4.5 text-sky-500 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-lg outline-none focus:ring-sky-500"
              />
              <label htmlFor="notify" className="text-xs text-slate-600 dark:text-slate-300 font-semibold cursor-pointer">
                Enable low attendance and payment alerts notifications
              </label>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4.5 py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-semibold rounded-xl text-xs shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 disabled:opacity-75 disabled:scale-100 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Database administration - Takes 1 column */}
        <div className="space-y-6">
          
          {/* Backup Database */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold font-outfit text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>Database Operations</span>
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed mb-5">
              Export all local records (students, staff, timetables, and settings) as a backup JSON file to your device.
            </p>
            
            <button
              onClick={handleBackupDatabase}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-emerald-500 hover:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Backup</span>
            </button>
          </div>

          {/* Reset Database */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm border-rose-200/50 dark:border-rose-950/20">
            <h3 className="text-sm font-bold font-outfit text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span className="text-rose-600 dark:text-rose-400">Danger Zone</span>
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed mb-5">
              Clear all customized settings and local records, restoring the database to default demo values.
            </p>
            
            <button
              onClick={() => {
                if (window.confirm('Are you absolutely sure you want to reset the database? All your edits will be permanently lost!')) {
                  resetDatabase();
                }
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/25 dark:hover:bg-rose-950/50 dark:text-rose-400 font-bold rounded-xl text-xs transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Factory Reset Database</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
