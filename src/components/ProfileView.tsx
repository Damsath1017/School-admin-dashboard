import React, { useState } from 'react';
import { User, Shield, Phone, Mail, Save, Clock } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const ProfileView: React.FC = () => {
  const { activities, triggerToast, t } = useDashboard();
  const [adminName, setAdminName] = useState('Admin User');
  const [adminEmail, setAdminEmail] = useState('commerce.admin@grandoak.edu');
  const [adminPhone, setAdminPhone] = useState('+94 11 987 6543');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      triggerToast(t('updateProfileBtn') + ' successful!', 'success');
      setIsUpdating(false);
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPw || !newPw) {
      triggerToast('Please fill out password fields.', 'error');
      return;
    }
    triggerToast('Security password updated successfully!', 'success');
    setCurrentPw('');
    setNewPw('');
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white tracking-tight">
          {t('profileTitle')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t('profileSub')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Summary */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-2xl bg-indigo-500 flex items-center justify-center text-white font-bold font-outfit text-3xl shadow-xl shadow-indigo-500/20 mb-4">
            A
          </div>
          <h2 className="text-xl font-bold font-outfit text-slate-800 dark:text-white">{adminName}</h2>
          <p className="text-xs text-sky-500 font-bold mt-1 uppercase tracking-wider">{t('adminRole')}</p>
          <div className="w-full border-t border-slate-100 dark:border-slate-800 my-4"></div>
          
          <div className="w-full space-y-3.5 text-left text-xs">
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate font-semibold">{adminEmail}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-semibold">{adminPhone}</span>
            </div>
          </div>
        </div>

        {/* Edit Fields & Password Reset - Right Column */}
        <div className="md:col-span-2 space-y-6">
          {/* General Details */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <h3 className="text-base font-bold font-outfit text-slate-800 dark:text-white mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              <span>{t('contactInfo')}</span>
            </h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                    {t('formName')}
                  </label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                    {t('formEmail')}
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  {t('formParentContact')}
                </label>
                <input
                  type="text"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs active:scale-95 disabled:opacity-75 disabled:scale-100 transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isUpdating ? t('saving') : t('updateProfileBtn')}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Password Security Form */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            <h3 className="text-base font-bold font-outfit text-slate-800 dark:text-white mb-5 flex items-center gap-2">
              <Shield className="w-5 h-5 text-rose-500" />
              <span>{t('passwordReset')}</span>
            </h3>
            
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                    {t('currentPassword')}
                  </label>
                  <input
                    type="password"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                    {t('newPassword')}
                  </label>
                  <input
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4.5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t('passwordReset')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Activity Logs in profile page */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
        <h3 className="text-base font-bold font-outfit text-slate-800 dark:text-white mb-5 flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-500" />
          <span>{t('activitiesOverview')}</span>
        </h3>
        
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {activities.slice(0, 4).map((log) => (
            <div key={log.id} className="py-3.5 flex justify-between items-center text-xs">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {log.action}: <span className="text-slate-500 dark:text-slate-400">{log.target}</span>
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{log.time}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                log.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' :
                log.type === 'warning' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600' :
                log.type === 'danger' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-600' :
                'bg-sky-50 dark:bg-sky-950/20 text-sky-600'
              }`}>
                {log.id}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
