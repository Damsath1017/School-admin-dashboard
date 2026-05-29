import React, { useState } from 'react';
import { DollarSign, Landmark, AlertCircle, FileText, CheckCircle2, SlidersHorizontal, Plus } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { Modal } from './Modal';

export const FinanceTracker: React.FC = () => {
  const { transactions, triggerToast, addActivity, t } = useDashboard();
  const [statusFilter, setStatusFilter] = useState('All');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Form states for custom invoice generation
  const [studentName, setStudentName] = useState('');
  const [grade, setGrade] = useState('12-Commerce-A');
  const [amount, setAmount] = useState('');
  const [invoiceType, setInvoiceType] = useState<'Tuition' | 'Library' | 'Sports' | 'Lab'>('Tuition');
  const [formError, setFormError] = useState('');

  // Calculations
  const totalPaid = transactions
    .filter(t => t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = transactions
    .filter(t => t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOverdue = transactions
    .filter(t => t.status === 'Overdue')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFees = totalPaid + totalPending + totalOverdue;
  const collectionRate = totalFees > 0 
    ? Math.round((totalPaid / totalFees) * 100) 
    : 100;

  // Filter transactions
  const filteredTransactions = transactions.filter(
    t => statusFilter === 'All' || t.status === statusFilter
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusDisplay = (val: 'Paid' | 'Pending' | 'Overdue') => {
    switch (val) {
      case 'Paid': return 'Paid';
      case 'Pending': return 'Pending';
      default: return 'Overdue';
    }
  };

  const getStatusBadgeColor = (val: 'Paid' | 'Pending' | 'Overdue') => {
    switch (val) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
      case 'Pending': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
      default: return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30';
    }
  };

  const getFeeTypeDisplay = (type: 'Tuition' | 'Library' | 'Sports' | 'Lab') => {
    switch (type) {
      case 'Tuition': return t('tuitionType');
      case 'Library': return t('libraryType');
      case 'Sports': return t('sportsType');
      default: return t('labType');
    }
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!studentName.trim() || !amount.trim()) {
      setFormError('Please fill in all fields.');
      return;
    }

    const amtNum = parseFloat(amount);
    if (isNaN(amtNum) || amtNum <= 0) {
      setFormError('Invoice amount must be a positive number.');
      return;
    }

    addActivity('Generated Fee Invoice', `${studentName} - ${formatCurrency(amtNum)}`, 'info');
    triggerToast(`Invoice successfully generated for ${studentName}!`, 'success');
    setIsInvoiceModalOpen(false);
    
    // Reset form
    setStudentName('');
    setAmount('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title & Introduction Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white tracking-tight">
            {t('financeTitle')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {t('financeSub')}
          </p>
        </div>
        <button
          onClick={() => setIsInvoiceModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/10 transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>{t('recordPaymentBtn')}</span>
        </button>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-semibold">
        {/* Paid Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('totalCollections')}</p>
            <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-emerald-400">{formatCurrency(totalPaid)}</h3>
            <p className="text-[10px] text-emerald-500 font-semibold">{collectionRate}% of total fees</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100/60 dark:border-emerald-900/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('pendingInvoices')}</p>
            <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-amber-400">{formatCurrency(totalPending)}</h3>
            <p className="text-[10px] text-slate-400">Awaiting processing</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100/60 dark:border-amber-900/30">
            <Landmark className="w-6 h-6" />
          </div>
        </div>

        {/* Overdue Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('overdueAccounts')}</p>
            <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-rose-400">{formatCurrency(totalOverdue)}</h3>
            <p className="text-[10px] text-rose-500 font-semibold">Flag alerts active</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100/60 dark:border-rose-900/30">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Total Billing Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('totalRevenue')}</p>
            <h3 className="text-xl font-bold font-outfit text-slate-800 dark:text-sky-400">{formatCurrency(totalFees)}</h3>
            <p className="text-[10px] text-slate-400">Combined academic terms</p>
          </div>
          <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400 border border-sky-100/60 dark:border-sky-900/30">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Ledger Grid */}
      <div className="space-y-4">
        
        {/* Filter Toolbar */}
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t('targetAudience')}</span>
          </div>

          <div className="flex gap-1.5">
            {['All', 'Paid', 'Pending', 'Overdue'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-all cursor-pointer border ${
                  statusFilter === status
                    ? 'bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent shadow'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="ml-auto text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            Showing {filteredTransactions.length} transaction entries
          </div>
        </div>

        {/* Ledger Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4">{t('idCol')}</th>
                  <th className="px-6 py-4">{t('students')}</th>
                  <th className="px-6 py-4">{t('gradeCol')}</th>
                  <th className="px-6 py-4">{t('feesCol')}</th>
                  <th className="px-6 py-4">{t('dateCol')}</th>
                  <th className="px-6 py-4">{t('amountCol')}</th>
                  <th className="px-6 py-4">{t('statusCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm font-semibold">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-400 dark:text-slate-500">
                        {txn.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800 dark:text-slate-200">
                        {txn.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-650 dark:text-slate-350">
                        {txn.grade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-650 dark:text-slate-350">
                          <FileText className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                          <span>{getFeeTypeDisplay(txn.type)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono text-xs">
                        {txn.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold font-outfit text-slate-800 dark:text-white">
                        {formatCurrency(txn.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusBadgeColor(txn.status)}`}>
                          {getStatusDisplay(txn.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-semibold">
                      <p className="text-sm">No transaction records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Invoice Generator Modal */}
      <Modal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        title={t('recordPaymentTitle')}
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4 font-semibold text-xs">
          {formError && (
            <div className="p-3 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-900/30">
              {formError}
            </div>
          )}

          <div className="space-y-4">
            {/* Student Name */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('formName')} *
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Grade */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  {t('formGrade')} *
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                >
                  <option value="12-Commerce-A">12-Commerce-A</option>
                  <option value="12-Commerce-B">12-Commerce-B</option>
                  <option value="13-Commerce-A">13-Commerce-A</option>
                  <option value="13-Commerce-B">13-Commerce-B</option>
                </select>
              </div>

              {/* Invoice Category */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  {t('feesCol')} *
                </label>
                <select
                  value={invoiceType}
                  onChange={(e) => setInvoiceType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                >
                  <option value="Tuition">{t('tuitionType')}</option>
                  <option value="Library">{t('libraryType')}</option>
                  <option value="Sports">{t('sportsType')}</option>
                  <option value="Lab">{t('labType')}</option>
                </select>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                {t('amountCol')} (LKR) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-sky-500 text-xs text-slate-800 dark:text-slate-200 transition-all font-semibold"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
            <button
              type="button"
              onClick={() => setIsInvoiceModalOpen(false)}
              className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-605 dark:text-slate-400 font-semibold rounded-xl text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t('cancelBtn')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-500/10 hover:shadow-sky-500/20 transition-all cursor-pointer"
            >
              {t('submitBtn')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
