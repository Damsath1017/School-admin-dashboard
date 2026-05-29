import React, { useState } from 'react';
import { BookOpen, HelpCircle, FileText, ChevronRight } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const KnowledgeBase: React.FC = () => {
  const { t } = useDashboard();
  const [activeTab, setActiveTab] = useState<'syllabus' | 'faq' | 'rules'>('syllabus');

  const faqs = [
    {
      q: 'How do I backup the entire student and teacher registry?',
      a: 'Navigate to "Settings" page. Inside "Database Operations", click the "Download Backup" button. The system will bundle all records into a single JSON file and download it to your device.'
    },
    {
      q: 'Can I restore default demo seeds if I make mistake edits?',
      a: 'Yes, navigate to "Settings" page. Scroll down to the "Danger Zone" and click "Factory Reset Database". This will delete all customized records in localStorage and restore the default A/L Commerce records.'
    },
    {
      q: 'How does low attendance flagging work?',
      a: 'The system computes attendance rates. If a student falls below the custom threshold specified in settings (e.g. 85%), a system warning notification is raised in the notifications panel.'
    },
    {
      q: 'How can I print or record invoice transactions?',
      a: 'Go to the "Fees & Payments" page. Click "Record Payment" to post a tuition or lab collection entry. Transactions update the total revenue in real-time.'
    }
  ];

  const rules = [
    'Students must maintain a minimum attendance rate of 80% to be eligible for G.C.E A/L school candidate registration.',
    'Daily registration closes at 8:00 AM. Arrival after 8:15 AM will be flagged as "Late" or "Absent".',
    'Official uniform attire is mandatory on all school days and external administrative seminars.',
    'Mobile phone usage is strictly prohibited within the school campus during instructional hours.'
  ];

  const syllabus = [
    {
      subject: 'Accounting (ගිණුම්කරණය)',
      code: 'BS-01',
      details: 'Focuses on financial accounting principles, ledger systems, partnership adjustments, company auditing, costing methodologies, and joint venture financial models.'
    },
    {
      subject: 'Economics (ආර්ථික විද්‍යාව)',
      code: 'BS-02',
      details: 'Covers microeconomics concepts (consumer demand, price elasticity), macroeconomics indicators (national output, inflation), fiscal policies, and international trade dynamics.'
    },
    {
      subject: 'Business Studies (ව්‍යාපාර අධ්‍යයනය)',
      code: 'BS-03',
      details: 'Examines business environments, management structures, entrepreneurship models, marketing foundations, and administrative human resource systems.'
    },
    {
      subject: 'Information Technology (ICT) / English',
      code: 'IT-09',
      details: 'Covers database management, networking, web development basics, and academic English competencies suited for global trade.'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white tracking-tight">
          {t('kbTitle')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          {t('kbSub')}
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`pb-3 font-semibold text-xs transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'syllabus'
              ? 'border-sky-500 text-sky-500 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{t('streamInfoTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`pb-3 font-semibold text-xs transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'faq'
              ? 'border-sky-500 text-sky-500 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{t('faqTab')}</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`pb-3 font-semibold text-xs transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'rules'
              ? 'border-sky-500 text-sky-500 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('rulesTab')}</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        {activeTab === 'syllabus' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-white">{t('streamTitle')}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{t('streamSub')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {syllabus.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-sky-500/30 transition-all bg-slate-50/50 dark:bg-slate-950/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-xs text-slate-850 dark:text-slate-200">{item.subject}</span>
                    <span className="text-[10px] bg-sky-50 dark:bg-sky-950/40 text-sky-650 dark:text-sky-400 px-2 py-0.5 rounded font-mono font-bold">{item.code}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                    {item.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-white">{t('faqTitle')}</h3>
            </div>

            <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-850">
              {faqs.map((faq, idx) => (
                <div key={idx} className={`${idx > 0 ? 'pt-4' : ''}`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold pl-5 mt-1.5">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-white">{t('rulesTitle')}</h3>
            </div>

            <ul className="space-y-3.5 pl-1.5">
              {rules.map((rule, idx) => (
                <li key={idx} className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed flex items-start gap-2.5 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 mt-1"></span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
