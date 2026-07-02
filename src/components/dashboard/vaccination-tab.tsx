'use client';
// ============================================================
// Arogya AI Command Center — Vaccination Registry Tab
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Syringe, Sparkles, Send, Check, AlertCircle, Search, Users,
  Mail, MessageSquare, Info, Calendar, ChevronRight, CheckCircle2
} from 'lucide-react';
import { generateVaccinationBeneficiaries } from '@/data/generators';
import { VaccinationBeneficiary } from '@/types';
import { formatDate, getRelativeTime } from '@/lib/utils';

export default function VaccinationTab() {
  const [beneficiaries, setBeneficiaries] = useState<VaccinationBeneficiary[]>(generateVaccinationBeneficiaries());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | 'Overdue' | 'Due' | 'Completed'>('All');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Filter Gaps List
  const filteredBeneficiaries = beneficiaries.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vaccineDue.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (selectedStatusFilter === 'Overdue') matchesStatus = b.status === 'Overdue' || b.status === 'Missed';
    else if (selectedStatusFilter === 'Due') matchesStatus = b.status === 'Due';
    else if (selectedStatusFilter === 'Completed') matchesStatus = b.status === 'Completed';

    return matchesSearch && matchesStatus;
  });

  // Action: Trigger SMS broadcast mobilization
  const triggerSMSBroadcast = () => {
    setIsBroadcasting(true);
    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSent(true);
      
      // Auto-resolve after a few seconds
      setTimeout(() => setBroadcastSent(false), 5000);
    }, 1500);
  };

  const getStatusClass = (status: VaccinationBeneficiary['status']) => {
    switch (status) {
      case 'Overdue':
      case 'Missed':
        return 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Due':
        return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Completed':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  const getRiskClass = (risk: VaccinationBeneficiary['riskLevel']) => {
    switch (risk) {
      case 'High': return 'text-rose-500 bg-rose-500/10';
      case 'Medium': return 'text-amber-500 bg-amber-500/10';
      case 'Low': return 'text-emerald-500 bg-emerald-500/10';
    }
  };

  return (
    <div className="space-y-6 text-xs text-gray-800 dark:text-gray-200">
      
      {/* Village Vaccination Gap Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Priority Village Gap 1 */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-500/15 text-rose-500">
              Priority 1 Area
            </span>
            <h4 className="font-bold text-xs text-gray-900 dark:text-white">
              Chandpur Village
            </h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              **23 children** have missed their **Pentavalent Dose 2** immunizations. High risk of local pertussis occurrence.
            </p>
          </div>
          <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/15">
            Suggested Outreach: Tuesday (Market Day)
          </div>
        </div>

        {/* Priority Village Gap 2 */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-500/15 text-rose-500">
              Priority 2 Area
            </span>
            <h4 className="font-bold text-xs text-gray-900 dark:text-white">
              Rampur Village
            </h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              **18 children** overdue for **MR Vaccine Dose 1** measles prevention campaign. Elevated vulnerability factor.
            </p>
          </div>
          <div className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold bg-teal-500/10 px-3 py-1.5 rounded-lg border border-teal-500/15">
            Suggested Outreach: Wednesday
          </div>
        </div>

        {/* SMS Mobilization Broadcast trigger */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col justify-between gap-3">
          <div className="space-y-2">
            <h4 className="font-bold text-gray-950 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-500" />
              Automated SMS Broadcast
            </h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              Send SMS notifications and voice reminders in local dialects (Hindi/Bhojpuri) to all overdue guardians to mobilize attendance.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={triggerSMSBroadcast}
              disabled={isBroadcasting}
              className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-teal-500/5 cursor-pointer disabled:opacity-50"
            >
              {isBroadcasting ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast SMS Alerts</span>
                </>
              )}
            </button>
            <AnimatePresence>
              {broadcastSent && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-bold text-emerald-500 text-center flex items-center justify-center gap-1 mt-1 bg-emerald-500/10 py-1 rounded"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Reminders sent to 41 guardians.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Directory Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search by child, village, or vaccine..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500/50"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Overdue', 'Due', 'Completed'] as const).map((filter) => {
            const isSelected = selectedStatusFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedStatusFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-teal-600 text-white'
                    : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                }`}
              >
                {filter} Status
              </button>
            );
          })}
        </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-zinc-500 bg-gray-50/50 dark:bg-zinc-900/50">
                <th className="p-4 pl-6">Beneficiary ID</th>
                <th className="p-4">Name & Category</th>
                <th className="p-4">Village</th>
                <th className="p-4">Vaccine Due</th>
                <th className="p-4">Scheduled Date</th>
                <th className="p-4 text-center">Risk Factor</th>
                <th className="p-4 pr-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
              {filteredBeneficiaries.map((b) => {
                const statusClass = getStatusClass(b.status);
                const riskClass = getRiskClass(b.riskLevel);
                return (
                  <tr key={b.id} className="hover:bg-gray-50/40 dark:hover:bg-zinc-950/20 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-teal-600 dark:text-teal-400">{b.id}</td>
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white">{b.name}</div>
                        <div className="text-[9px] text-gray-500 mt-0.5">
                          {b.age === 0 ? 'Under 1 yr' : `${b.age} yrs`} • {b.type}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-600 dark:text-gray-300">{b.village}</td>
                    <td className="p-4 font-bold text-teal-600 dark:text-teal-400">{b.vaccineDue}</td>
                    <td className="p-4 text-gray-500">{formatDate(b.dueDate)}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${riskClass}`}>
                        {b.riskLevel}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[9px] font-bold ${statusClass}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
