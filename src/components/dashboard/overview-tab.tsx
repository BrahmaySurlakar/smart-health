'use client';
// ============================================================
// Arogya AI Command Center — Role-Based Command Review (Overview)
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth-store';
import {
  Users, Stethoscope, Bed, Pill, Clock, AlertTriangle, TrendingUp, Heart,
  ArrowUpRight, ArrowDownRight, ChevronRight, CheckCircle2, AlertCircle, Sparkles,
  ClipboardList, Activity, Star, Syringe, ShieldAlert, ListTodo, ShieldCheck, Database, Calendar
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Cell
} from 'recharts';
import { getRiskColor, getRiskBgColor } from '@/lib/utils';

interface OverviewTabProps {
  onTabChange: (tab: string) => void;
}

export default function OverviewTab({ onTabChange }: OverviewTabProps) {
  const { user } = useAuthStore();
  const role = user?.role || 'doctor';

  // --- Mock Role-Specific Datasets ---

  // 1. Medical Officer
  const moKPIs = [
    { label: 'OPD Expected Load', value: 156, change: 18, changeType: 'increase', icon: Users, color: '#0F766E' },
    { label: 'Doctors Available', value: '8 / 12', change: -12, changeType: 'decrease', icon: Stethoscope, color: '#F59E0B' },
    { label: 'ICU Bed Occupancy', value: '87%', change: 8, changeType: 'increase', icon: Bed, color: '#EF4444' },
    { label: 'Facility Health Score', value: '87 / 100', change: 3, changeType: 'increase', icon: Sparkles, color: '#10B981' },
  ];

  // 2. Doctor
  const doctorKPIs = [
    { label: 'Assigned Cases Today', value: 28, change: 15, changeType: 'increase', icon: Users, color: '#0F766E' },
    { label: 'Consulted Patients', value: 14, change: 100, changeType: 'increase', icon: CheckCircle2, color: '#10B981' },
    { label: 'Avg Consult Time', value: '8 mins', change: -20, changeType: 'decrease', icon: Clock, color: '#14B8A6' },
    { label: 'Practitioner Feedback', value: '4.8 / 5.0', change: 4, changeType: 'increase', icon: Star, color: '#F59E0B' },
  ];

  // 3. Nurse
  const nurseKPIs = [
    { label: 'General Ward Occupancy', value: '24 / 30', change: 5, changeType: 'increase', icon: Bed, color: '#F97316' },
    { label: 'Beds Needing Cleaning', value: 3, change: 50, changeType: 'increase', icon: Activity, color: '#F59E0B' },
    { label: 'Active Queue Waiting', value: 12, change: -15, changeType: 'decrease', icon: Clock, color: '#14B8A6' },
    { label: 'Critical Vitals Alerts', value: 2, change: 100, changeType: 'increase', icon: AlertTriangle, color: '#EF4444' },
  ];

  // 4. Pharmacist
  const pharmacistKPIs = [
    { label: 'Dispensary Total Items', value: '14.2K', change: 2, changeType: 'increase', icon: Pill, color: '#0F766E' },
    { label: 'Critical Stock Shortages', value: 2, change: -50, changeType: 'decrease', icon: AlertTriangle, color: '#EF4444' },
    { label: 'Medicines Expiring soon', value: 3, change: 0, changeType: 'neutral', icon: Calendar, color: '#F59E0B' },
    { label: 'Redistribution Savings', value: '₹20.2K', change: 12, changeType: 'increase', icon: Sparkles, color: '#10B981' },
  ];

  // 5. Lab Technician
  const labKPIs = [
    { label: 'Pending Test Samples', value: 8, change: 33, changeType: 'increase', icon: Activity, color: '#F59E0B' },
    { label: 'Completed Lab Tests', value: 22, change: 15, changeType: 'increase', icon: CheckCircle2, color: '#10B981' },
    { label: 'Critical Lab Results', value: 3, change: 200, changeType: 'increase', icon: AlertCircle, color: '#EF4444' },
    { label: 'Lab Accuracy Index', value: '98%', change: 1, changeType: 'increase', icon: Sparkles, color: '#14B8A6' },
  ];

  // 6. ANM (Auxiliary Nurse Midwife)
  const anmKPIs = [
    { label: 'Vaccination Gaps (Chandpur)', value: 23, change: -15, changeType: 'decrease', icon: Syringe, color: '#EF4444' },
    { label: 'Overdue Beneficiaries', value: 40, change: 5, changeType: 'increase', icon: Users, color: '#F59E0B' },
    { label: 'High-Risk Pregnancies', value: 5, change: 25, changeType: 'increase', icon: Heart, color: '#EC4899' },
    { label: 'Immunization Coverage', value: '82%', change: 4, changeType: 'increase', icon: Sparkles, color: '#10B981' },
  ];

  // 7. ASHA Worker
  const ashaKPIs = [
    { label: 'Active Village Hotspots', value: 3, change: 50, changeType: 'increase', icon: ShieldAlert, color: '#EF4444' },
    { label: 'Suspected Dengue Cases', value: 14, change: 100, changeType: 'increase', icon: Activity, color: '#F59E0B' },
    { label: 'Scheduled Home Visits', value: 6, change: 20, changeType: 'increase', icon: Calendar, color: '#14B8A6' },
    { label: 'Outreach Compliance', value: '92%', change: 2, changeType: 'increase', icon: CheckCircle2, color: '#10B981' },
  ];

  // 8. Administrator
  const adminKPIs = [
    { label: 'Staff Attendance Rate', value: '94%', change: 2, changeType: 'increase', icon: Users, color: '#10B981' },
    { label: 'Stress Burnout Warnings', value: '1 High', change: 0, changeType: 'neutral', icon: AlertTriangle, color: '#EF4444' },
    { label: 'Background API Syncs', value: 'Active', change: 0, changeType: 'neutral', icon: Database, color: '#14B8A6' },
    { label: 'Unresolved System Alerts', value: 4, change: 33, changeType: 'increase', icon: Clock, color: '#F59E0B' },
  ];

  // Get active role KPIs
  const getRoleKPIs = () => {
    switch (role) {
      case 'medical_officer': return moKPIs;
      case 'doctor': return doctorKPIs;
      case 'nurse': return nurseKPIs;
      case 'pharmacist': return pharmacistKPIs;
      case 'lab_technician': return labKPIs;
      case 'anm': return anmKPIs;
      case 'asha_worker': return ashaKPIs;
      case 'administrator': return adminKPIs;
      default: return doctorKPIs;
    }
  };

  const currentKPIs = getRoleKPIs();

  // Get custom headers
  const getHeaderTitle = () => {
    switch (role) {
      case 'medical_officer': return 'Medical Officer Command Review';
      case 'doctor': return 'Clinical Practice & Consultations';
      case 'nurse': return 'Nursing Ward & Triage Operations';
      case 'pharmacist': return 'Dispensary Stock & Redistribution';
      case 'lab_technician': return 'Laboratory Diagnostic Queue';
      case 'anm': return 'Outreach & Vaccination Campaigns';
      case 'asha_worker': return 'Community Health Surveillance';
      case 'administrator': return 'System Settings & Operational Control';
      default: return 'Command Review';
    }
  };

  const getHeaderSubtitle = () => {
    switch (role) {
      case 'medical_officer': return 'Real-time catching analytics and predictive facility metrics.';
      case 'doctor': return 'Active OPD diagnostic queue and patient feedback logs.';
      case 'nurse': return 'Live bed map, sanitization status, and vitals checkups.';
      case 'pharmacist': return 'Dispensary inventory levels, expirations, and inter-facility swaps.';
      case 'lab_technician': return 'Pending test tubes, completed blood indices, and panic values.';
      case 'anm': return 'Village coverage index, maternal cohorts, and vaccine mobilization.';
      case 'asha_worker': return 'Catchment village tracking, vector clusters, and home visits.';
      case 'administrator': return 'System logs, database synchronization, and threshold metrics.';
      default: return 'Command operations panel.';
    }
  };

  // --- Dynamic Chart Rendering ---
  const chartData = [
    { date: 'Mon', value: 34, expected: 40 },
    { date: 'Tue', value: 56, expected: 45 },
    { date: 'Wed', value: 45, expected: 50 },
    { date: 'Thu', value: 80, expected: 65 },
    { date: 'Fri', value: 72, expected: 70 },
    { date: 'Sat', value: 20, expected: 25 },
    { date: 'Sun', value: 12, expected: 15 },
  ];

  return (
    <div className="space-y-6">
      {/* Role-Specific Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm">
        <h3 className="text-lg font-bold text-gray-950 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-500" />
          {getHeaderTitle()}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {getHeaderSubtitle()}
        </p>
      </div>

      {/* Visual KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {currentKPIs.map((kpi, idx) => {
          const Icon = kpi.icon;
          const isIncrease = kpi.changeType === 'increase';
          const isNeutral = kpi.changeType === 'neutral';

          return (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={kpi.label}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between group hover:border-teal-500/30 dark:hover:border-teal-500/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{kpi.label}</span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-teal-600 dark:text-teal-400 bg-teal-500/10"
                  style={{ color: kpi.color, backgroundColor: `${kpi.color}15` }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {kpi.value}
                </span>
                <span
                  className={`text-xs font-semibold flex items-center ${
                    isNeutral ? 'text-gray-500' : isIncrease ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {isNeutral ? null : isIncrease ? (
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-0.5" />
                  )}
                  {isNeutral ? 'Stable' : `${kpi.change}%`}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts & Action Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Customized Dynamic Chart (Recharts) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-gray-950 dark:text-white text-lg">
              {role === 'pharmacist' ? 'Dispensary Item Consumption' : role === 'doctor' ? 'OPD Consultations Handled' : 'Catchment Telemetry Trend'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {role === 'pharmacist' ? 'Weekly drug dispense load' : role === 'doctor' ? 'Cases consulted vs daily benchmark' : 'Current metrics vs weekly expectations'}
            </p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0f766e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#valGrad)"
                  name={role === 'pharmacist' ? 'Dispensary Consumption' : 'Completed Work'}
                />
                <Area
                  type="monotone"
                  dataKey="expected"
                  stroke="#22c55e"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  fill="transparent"
                  name="Expectation Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Action Checklist based on Role */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-950 dark:text-white text-lg flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-teal-500" />
              Duty Checklist
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Action items assigned for today</p>
          </div>

          <div className="flex-1 space-y-2 mt-2">
            {role === 'medical_officer' && (
              <>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Authorize inter-facility ORS transfer</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Review Dengue cluster vector map</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Call backup doctor to cover General OPD</span>
                </div>
              </>
            )}

            {role === 'doctor' && (
              <>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Summon next waiting patient from queue</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Inspect patient clinical vitals twin</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Record prescriptions for completed visits</span>
                </div>
              </>
            )}

            {role === 'nurse' && (
              <>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Audit vitals check for ICU beds</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Mark vacated beds as Sanitized</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Log triage priority for incoming patients</span>
                </div>
              </>
            )}

            {role === 'pharmacist' && (
              <>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Accept inter-facility ORS stock transfer</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Audit expiring drugs batch number</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Prepare monthly medicine consumption log</span>
                </div>
              </>
            )}

            {role === 'lab_technician' && (
              <>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Submit completed CBC results</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Audit abnormal platelet levels</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Input rapid diagnostic test files</span>
                </div>
              </>
            )}

            {role === 'anm' && (
              <>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Check maternal pregnancy cohort list</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Schedule Chandpur local vaccination drive</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Broadcast SMS reminders to village mothers</span>
                </div>
              </>
            )}

            {role === 'asha_worker' && (
              <>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Identify dengue suspected patients</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Complete scheduled home checkups</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Alert ANM of vaccine overdue children</span>
                </div>
              </>
            )}

            {role === 'administrator' && (
              <>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Audit staff attendance record logs</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Review system alert thresholds</span>
                </div>
                <div className="p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[10px] text-gray-700 dark:text-gray-300">Test backup generator synchronisation</span>
                </div>
              </>
            )}
          </div>

          <div className="text-[10px] text-teal-600 dark:text-teal-400 bg-teal-500/10 p-3 rounded-xl border border-teal-500/20 font-medium flex items-center justify-between">
            <span>Actions synced with local unit</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
