'use client';
// ============================================================
// Arogya AI Command Center — Overview Tab
// ============================================================
import { motion } from 'framer-motion';
import {
  Users, Stethoscope, Bed, Pill, Clock, AlertTriangle, TrendingUp, Heart,
  ArrowUpRight, ArrowDownRight, ChevronRight, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend
} from 'recharts';
import { generateKPIData, generateFootfallPredictions, generateAIInsights } from '@/data/generators';

const ICON_MAP: Record<string, any> = {
  Users: Users,
  Stethoscope: Stethoscope,
  Bed: Bed,
  Pill: Pill,
  Clock: Clock,
  AlertTriangle: AlertTriangle,
  TrendingUp: TrendingUp,
  Heart: Heart,
};

export default function OverviewTab({ onTabChange }: { onTabChange: (tab: string) => void }) {
  const kpis = generateKPIData();
  const predictions = generateFootfallPredictions();
  const insights = generateAIInsights().slice(0, 3); // top 3 insights

  // Mock hourly data for the bar chart
  const hourlyData = [
    { hour: '08:00', patients: 12 },
    { hour: '10:00', patients: 35 },
    { hour: '12:00', patients: 28 },
    { hour: '14:00', patients: 15 },
    { hour: '16:00', patients: 22 },
    { hour: '18:00', patients: 30 },
    { hour: '20:00', patients: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Visual KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.slice(0, 8).map((kpi, idx) => {
          const Icon = ICON_MAP[kpi.icon] || Users;
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
        {/* Footfall Trend Area Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-gray-950 dark:text-white text-lg">OPD Patient Footfall</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Weekly predictive model bounds vs actual load</p>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={predictions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="predictedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
                  dataKey="predicted"
                  stroke="#0f766e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#predictedGrad)"
                  name="AI Prediction"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#actualGrad)"
                  name="Actual OPD Count"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Flow Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-950 dark:text-white text-lg">Hourly Load Distribution</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Peak consult hours tracking</p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={10} tickLine={false} />
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
                <Bar dataKey="patients" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-teal-600 dark:text-teal-400 bg-teal-500/10 p-3 rounded-xl border border-teal-500/20 font-medium flex items-start gap-2">
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>OPD Peak detected between 10:00 AM and 12:00 PM. Recommend staging shifts.</span>
          </div>
        </div>
      </div>

      {/* AI Decision Recommendations & Fast Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Action Items */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
            <h3 className="font-bold text-gray-950 dark:text-white text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-500" />
              AI Operational Actions
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">
              Ready
            </span>
          </div>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800/80 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                      {insight.severity === 'critical' && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
                      {insight.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                    Conf: {insight.confidence}%
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 pl-2 border-l border-teal-500/30">
                  {insight.actionItems.slice(0, 2).map((action, i) => (
                    <div key={i} className="text-[11px] text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Panel */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-gray-950 dark:text-white text-lg">Command Shortcuts</h3>
          <div className="grid grid-cols-1 gap-2.5">
            {[
              { label: 'Register New Patient', tab: 'Patients', desc: 'Add OPD intake' },
              { label: 'Verify Lab Reports', tab: 'Reports', desc: 'Review abnormal results' },
              { label: 'Redistribute Amoxicillin', tab: 'Pharmacy', desc: 'Execute stock transfers' },
              { label: 'Manage ICU Beds', tab: 'Wards & Beds', desc: 'Discharge or assign patients' },
              { label: 'Outbreak Hotspots', tab: 'Surveillance', desc: 'Check vector surveillance map' },
            ].map((shortcut) => (
              <button
                key={shortcut.label}
                onClick={() => onTabChange(shortcut.tab)}
                className="p-3.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/40 text-left hover:border-teal-500/40 dark:hover:border-teal-500/40 hover:bg-teal-500/[0.02] dark:hover:bg-teal-500/[0.01] transition-all duration-200 cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                    {shortcut.label}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{shortcut.desc}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-500 transform group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
