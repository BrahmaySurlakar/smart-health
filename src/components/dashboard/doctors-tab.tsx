'use client';
// ============================================================
// Arogya AI Command Center — Doctors & Staff Tab
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope, Clock, ShieldAlert, Sparkles, Check, CheckCircle2, UserX,
  Users, User, Star, Briefcase, Calendar, ChevronRight
} from 'lucide-react';
import { getDoctors, getStaff } from '@/data/generators';
import { Doctor, StaffMember } from '@/types';
import { getStatusColor } from '@/lib/utils';

export default function DoctorsTab() {
  const [doctors, setDoctors] = useState<Doctor[]>(getDoctors());
  const [staff, setStaff] = useState<StaffMember[]>(getStaff());
  const [selectedSubTab, setSelectedSubTab] = useState<'doctors' | 'staff'>('doctors');
  const [optimizationProposed, setOptimizationProposed] = useState(false);
  const [optimizationApplied, setOptimizationApplied] = useState(false);

  // Proposed redistribution details
  const triggerOptimization = () => {
    setOptimizationProposed(true);
  };

  const applyOptimization = () => {
    setOptimizationApplied(true);
    // Simulate updating doctor patient loads
    setDoctors(prev =>
      prev.map(d => {
        if (d.name.includes('Amit Kumar')) {
          return { ...d, patientsToday: 137, workloadScore: 68, burnoutRisk: 'High' };
        }
        if (d.name.includes('Verma') || d.specialty === 'Pediatrics') {
          return { ...d, patientsToday: d.patientsToday + 50, workloadScore: d.workloadScore + 25, status: 'Busy' };
        }
        return d;
      })
    );
  };

  const getBurnoutBadgeClass = (risk: Doctor['burnoutRisk']) => {
    switch (risk) {
      case 'Critical': return 'bg-rose-500/10 border-rose-500/30 text-rose-500';
      case 'High': return 'bg-orange-500/10 border-orange-500/30 text-orange-500';
      case 'Medium': return 'bg-amber-500/10 border-amber-500/30 text-amber-500';
      case 'Low': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Selector */}
      <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-1">
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedSubTab('doctors')}
            className={`pb-3 text-xs font-bold relative transition-colors cursor-pointer ${
              selectedSubTab === 'doctors' ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-zinc-500'
            }`}
          >
            Doctors & Clinicians ({doctors.length})
            {selectedSubTab === 'doctors' && (
              <motion.div layoutId="subTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />
            )}
          </button>
          <button
            onClick={() => setSelectedSubTab('staff')}
            className={`pb-3 text-xs font-bold relative transition-colors cursor-pointer ${
              selectedSubTab === 'staff' ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400 dark:text-zinc-500'
            }`}
          >
            Support Staff ({staff.length})
            {selectedSubTab === 'staff' && (
              <motion.div layoutId="subTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500" />
            )}
          </button>
        </div>

        {/* Workload Optimizer Action */}
        {selectedSubTab === 'doctors' && (
          <button
            onClick={triggerOptimization}
            disabled={optimizationApplied}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              optimizationApplied
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
                : 'bg-teal-500 text-slate-950 hover:bg-teal-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{optimizationApplied ? 'Workload Balanced' : 'Optimize Workload'}</span>
          </button>
        )}
      </div>

      {/* Workload Optimization Alerts */}
      <AnimatePresence>
        {optimizationProposed && !optimizationApplied && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-teal-800 dark:text-teal-400">Workload Optimization Suggestion</h4>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
                  Dr. Amit Kumar hasSeen **187 patients** today (Critical Burnout Risk). Recommend shifting General OPD caseload to Dr. Priya Patel and Pediatrics backup Dr. Verma.
                </p>
              </div>
            </div>
            <button
              onClick={applyOptimization}
              className="py-1.5 px-4 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold self-start md:self-auto text-xs cursor-pointer shadow-lg shadow-teal-500/10"
            >
              Apply Reallocation Plan
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Section Content */}
      {selectedSubTab === 'doctors' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((doctor) => {
            const burnoutClass = getBurnoutBadgeClass(doctor.burnoutRisk);
            const statusColor = getStatusColor(doctor.status);

            return (
              <motion.div
                layout
                key={doctor.id}
                className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between gap-4 group hover:border-teal-500/20 transition-all duration-200"
              >
                {/* Profile Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold">
                      {doctor.name.split(' ')[1]?.[0] || 'D'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-xs">{doctor.name}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">{doctor.specialty} • {doctor.qualification}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColor}`}>
                    {doctor.status}
                  </span>
                </div>

                {/* Consultation Statistics */}
                <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 dark:border-zinc-800/80 text-center">
                  <div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase">Seen Today</div>
                    <div className="text-sm font-extrabold text-gray-800 dark:text-gray-200 mt-0.5">{doctor.patientsToday}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase">Avg Consult</div>
                    <div className="text-sm font-extrabold text-gray-800 dark:text-gray-200 mt-0.5">{doctor.avgConsultationTime}m</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-400 font-bold uppercase">Rating</div>
                    <div className="text-sm font-extrabold text-amber-500 mt-0.5 flex items-center justify-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-500 stroke-none" />
                      <span>{doctor.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Workload Progress & Burnout Indicators */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-500">Workload Index</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">{doctor.workloadScore}/100</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        doctor.workloadScore > 80 ? 'bg-rose-500' : doctor.workloadScore > 50 ? 'bg-orange-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${doctor.workloadScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] pt-1">
                    <span className="text-gray-400">Burnout Threshold</span>
                    <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${burnoutClass}`}>
                      {doctor.burnoutRisk} Risk
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Support Staff Directory View */
        <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-zinc-500 bg-gray-50/50 dark:bg-zinc-900/50">
                  <th className="p-4 pl-6">Staff Member</th>
                  <th className="p-4">Duty Role</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Stress Indicator</th>
                  <th className="p-4 text-center">Duty Hours</th>
                  <th className="p-4 text-center">Tasks Done</th>
                  <th className="p-4 pr-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                {staff.map((member) => {
                  const statusColor = getStatusColor(member.status);
                  const stressColor =
                    member.stressLevel === 'Critical' || member.stressLevel === 'High'
                      ? 'text-rose-500 font-bold'
                      : member.stressLevel === 'Medium'
                        ? 'text-amber-500'
                        : 'text-emerald-500';

                  return (
                    <tr key={member.id} className="hover:bg-gray-50/40 dark:hover:bg-zinc-950/20 transition-colors">
                      <td className="p-4 pl-6 font-bold text-gray-900 dark:text-white">{member.name}</td>
                      <td className="p-4 capitalize text-gray-600 dark:text-gray-400">{member.role.replace('_', ' ')}</td>
                      <td className="p-4 text-gray-500 font-medium">{member.department}</td>
                      <td className={`p-4 ${stressColor}`}>{member.stressLevel} stress</td>
                      <td className="p-4 text-center font-semibold text-gray-700 dark:text-gray-300">{member.workloadHours}h</td>
                      <td className="p-4 text-center font-bold text-teal-600 dark:text-teal-400">{member.tasksCompleted}</td>
                      <td className="p-4 pr-6 text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusColor}`}>
                          {member.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
