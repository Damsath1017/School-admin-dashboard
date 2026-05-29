import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Sparkles, Sun, Moon, Globe } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { theme, setTheme, triggerToast, settings, updateSettings, t } = useDashboard();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating for 1 second
    setTimeout(() => {
      if (username.toLowerCase() === 'admin' && password === 'admin123') {
        triggerToast('Login successful! Welcome back.', 'success');
        onLoginSuccess();
      } else {
        setError(t('loginError'));
        setIsLoading(false);
      }
    }, 1000);
  };

  const toggleLanguage = () => {
    const nextLang = settings.systemLanguage === 'en' ? 'si' : 'en';
    updateSettings({
      ...settings,
      systemLanguage: nextLang
    });
    triggerToast(nextLang === 'en' ? 'Language switched to English' : 'භාෂාව සිංහලට මාරු කරන ලදී', 'info');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 relative overflow-hidden transition-colors duration-200">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/20 dark:bg-sky-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

      {/* Top Controls (Theme & Language Toggle) */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        {/* Language switch button */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-800 dark:text-slate-350 dark:hover:text-white bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 shadow-md backdrop-blur active:scale-95 transition-all cursor-pointer"
        >
          <Globe className="w-4 h-4 text-sky-500" />
          <span>{settings.systemLanguage === 'en' ? 'සිංහල' : 'English'}</span>
        </button>

        {/* Theme switch button */}
        <button
          type="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 shadow-md backdrop-blur hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>

      <div className="w-full max-w-md p-8 rounded-2xl glass shadow-2xl relative border border-white/20 dark:border-slate-800/50">
        {/* Brand/Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-sky-500 dark:bg-sky-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/30 text-white mb-4 animate-bounce">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-3xl font-extrabold font-outfit bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400 bg-clip-text text-transparent">
            {t('loginTitle')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 flex items-center gap-1.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            {t('loginSub')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3.5 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-900/30 font-semibold animate-shake">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {t('usernameLabel')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-900 dark:text-white transition-all text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              {t('passwordLabel')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-900 dark:text-white transition-all text-sm font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] focus:scale-95 active:scale-95 disabled:opacity-75 disabled:scale-100 transition-all cursor-pointer text-xs flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              t('loginBtn')
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
          <p className="text-[10px] text-slate-400 font-semibold">
            Demo credentials: <code className="bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sky-600 dark:text-sky-400 font-mono font-bold">admin</code> / <code className="bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sky-600 dark:text-sky-400 font-mono font-bold">admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
};
