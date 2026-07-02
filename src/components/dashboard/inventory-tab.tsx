'use client';
import { useState } from 'react';
import {
  Package, FileText, Activity, TrendingDown, TrendingUp,
  AlertTriangle, CheckCircle2, Truck, RefreshCw,
  ChevronLeft, ChevronRight, ShieldCheck, Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from 'recharts';

interface MedicineItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  onHand: number;
  unit: string;
  percentage: number;
  usagePerDay: number;
  trend: 'stable' | 'surge' | 'down';
  shelfLife: string;
  aiPrediction: string;
  status: 'in-stock' | 'low' | 'critical';
}

const MEDICINES: MedicineItem[] = [
  {
    id: '1', name: 'ORS Packets', sku: '#ORS-2024-XP', category: 'Essential',
    onHand: 1240, unit: 'pkts', percentage: 85, usagePerDay: 180, trend: 'down',
    shelfLife: 'Oct 2025', aiPrediction: 'Surplus likely', status: 'in-stock',
  },
  {
    id: '2', name: 'Amoxicillin 250mg', sku: '#AMX-SYP-02', category: 'Antibiotic',
    onHand: 42, unit: 'vials', percentage: 12, usagePerDay: 8, trend: 'surge',
    shelfLife: '14 Days left', aiPrediction: 'Stockout Warning', status: 'critical',
  },
  {
    id: '3', name: 'Covaxin Vial (5ml)', sku: '#CVX-009-MH', category: 'Vaccine',
    onHand: 85, unit: 'units', percentage: 42, usagePerDay: 12, trend: 'stable',
    shelfLife: 'Jan 2026', aiPrediction: 'Scheduled Restock', status: 'low',
  },
  {
    id: '4', name: 'Paracetamol 500mg', sku: '#PCM-500-GP', category: 'Analgesic',
    onHand: 420, unit: 'tabs', percentage: 24, usagePerDay: 110, trend: 'surge',
    shelfLife: 'Aug 2025', aiPrediction: 'Depletion Alert', status: 'critical',
  },
  {
    id: '5', name: 'Azithromycin 500mg', sku: '#AZI-500-XP', category: 'Antibiotic',
    onHand: 600, unit: 'tabs', percentage: 75, usagePerDay: 34, trend: 'stable',
    shelfLife: 'Nov 2025', aiPrediction: 'Optimal Stock', status: 'in-stock',
  },
  {
    id: '6', name: 'Metformin 500mg', sku: '#MET-500-DM', category: 'Antidiabetic',
    onHand: 320, unit: 'tabs', percentage: 55, usagePerDay: 22, trend: 'stable',
    shelfLife: 'Mar 2026', aiPrediction: 'Optimal Stock', status: 'in-stock',
  },
];

const FORECAST_DATA = [
  { week: 'WK 1', demand: 420, isSurge: false },
  { week: 'WK 2', demand: 580, isSurge: false },
  { week: 'WK 3', demand: 850, isSurge: true },
  { week: 'WK 4', demand: 510, isSurge: false },
];

const LOGISTICS = [
  {
    id: 'ax992', batch: 'Batch #AX-992 (PHC Rampur)', status: 'IN TRANSIT',
    desc: 'Cold-chain medication (Insulin, Covaxin). Temperature maintained at 4.2°C.',
    progress: 65, remaining: '12km left', statusColor: 'emerald',
  },
  {
    id: 'wB', batch: 'Warehouse B - District Center', status: 'PACKING',
    desc: 'Emergency replenishment for ORS and Paracetamol. Dispatch in 45m.',
    progress: null, remaining: null, statusColor: 'orange',
  },
  {
    id: 'tr441', batch: 'Batch #TR-441 - Delivered', status: 'DELIVERED',
    desc: 'General antibiotics and gauze. Received by Dr. Mehra yesterday.',
    progress: 100, remaining: null, statusColor: 'gray',
  },
];

export default function InventoryTab() {
  const [query, setQuery] = useState('');
  const [aiAccepted, setAiAccepted] = useState(false);

  const filtered = MEDICINES.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.sku.toLowerCase().includes(query.toLowerCase())
  );

  const statusBar = (pct: number, status: MedicineItem['status']) => {
    const color =
      status === 'critical' ? 'bg-red-500' :
      status === 'low' ? 'bg-amber-500' : 'bg-emerald-500';
    return (
      <div className="w-20 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden mt-1.5">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    );
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Medicine Inventory Intelligence
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Predictive logistics and stock optimization across PHC Rampur network
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-teal-500/20">
            <Truck className="w-3.5 h-3.5" />
            Initiate Redistribution
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
            <FileText className="w-3.5 h-3.5" />
            Audit Report
          </button>
        </div>
      </div>

      {/* ── Bento Top Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Critical Alert Card */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-red-500 mb-3">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Critical Shortage Alert</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Paracetamol 500mg — Stock Depletion in 48h
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Unusually high demand detected in 3 satellite clinics due to Dengue cluster.
            Projected deficit: 1,400 units by Friday.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Current Stock', value: '420', unit: 'units', color: 'text-gray-900 dark:text-white' },
              { label: 'Usage Rate', value: '+142%', unit: 'vs avg', color: 'text-red-500' },
              { label: 'In Transit', value: '800', unit: 'ETA 4h', color: 'text-teal-500' },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 dark:bg-zinc-950 rounded-xl p-3 border border-gray-100 dark:border-zinc-800">
                <p className="text-[9px] font-bold uppercase text-gray-400 mb-1">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.color}`}>
                  {stat.value} <span className="text-[10px] font-normal opacity-70">{stat.unit}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Gauge */}
          <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#fecaca" strokeWidth="7" className="dark:stroke-red-950" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="#ef4444" strokeWidth="7"
                  strokeDasharray="201.1" strokeDashoffset="177" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-bold text-red-500">12%</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase">Safe</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-red-600 dark:text-red-400">Critical Reorder Triggered</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Emergency supplier notified. Expected restock in 4 hours.</p>
            </div>
          </div>
        </div>

        {/* AI Widget */}
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-2xl p-5 shadow-md shadow-teal-500/20 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-teal-100" />
            <h4 className="font-bold text-base">AI Redistribution Recs</h4>
          </div>
          <div className="space-y-3 flex-1">
            <div className="bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-sm">
              <p className="text-[9px] font-black uppercase text-teal-200 tracking-wider mb-1">Path Optimization</p>
              <p className="text-[11px] leading-relaxed opacity-90">
                PHC Shajahanpur has <strong>300% surplus</strong> of ORS. Transferring 40 cases to Rampur avoids waste & covers 15% shortfall.
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-sm">
              <p className="text-[9px] font-black uppercase text-teal-200 tracking-wider mb-1">Expiry Forecast</p>
              <p className="text-[11px] leading-relaxed opacity-90">
                240 Amoxicillin units expiring in{' '}
                <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">14 DAYS</span>.
                Priority dispatch to Outpatient Dept recommended.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAiAccepted(true)}
            className={`mt-4 w-full py-2.5 font-bold rounded-xl text-xs transition-all ${
              aiAccepted
                ? 'bg-white/20 text-white cursor-default'
                : 'bg-white text-teal-700 hover:bg-teal-50 cursor-pointer'
            }`}
          >
            {aiAccepted ? '✓ Suggestions Accepted' : 'Accept All Suggestions'}
          </button>
        </div>
      </div>

      {/* ── Live Stock Table ── */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white">Live Stock Monitoring</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Real-time stock levels across PHC network</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search drug or SKU..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs w-44 focus:outline-none focus:border-teal-500 text-gray-800 dark:text-zinc-200 transition-colors"
            />
            <div className="hidden sm:flex gap-2">
              {[
                { label: 'In Stock', color: 'bg-emerald-500' },
                { label: 'Low', color: 'bg-amber-500' },
                { label: 'Critical', color: 'bg-red-500' },
              ].map((s) => (
                <span key={s.label} className="flex items-center gap-1.5 text-[9px] font-bold text-gray-500 dark:text-gray-400">
                  <span className={`w-2 h-2 rounded-full ${s.color}`} />
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-950/60 border-b border-gray-100 dark:border-zinc-800">
                {['Medicine / SKU', 'Category', 'On Hand', 'Usage / day', 'Shelf Life', 'AI Prediction', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/80">
              {filtered.map((med) => (
                <tr key={med.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-xs text-gray-900 dark:text-white">{med.name}</p>
                    <p className="text-[9px] font-mono text-gray-400 mt-0.5">{med.sku}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[9px] font-bold border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded px-1.5 py-0.5 text-gray-500 dark:text-gray-400">
                      {med.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className={`font-bold text-xs ${med.status === 'critical' ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                      {med.onHand.toLocaleString()} <span className="font-normal text-[10px] opacity-60">{med.unit}</span>
                    </p>
                    {statusBar(med.percentage, med.status)}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{med.usagePerDay}/day</p>
                    <p className={`text-[9px] font-bold flex items-center gap-0.5 mt-0.5 ${
                      med.trend === 'surge' ? 'text-red-500' : med.trend === 'down' ? 'text-emerald-500' : 'text-gray-400'
                    }`}>
                      {med.trend === 'surge' && <TrendingUp className="w-2.5 h-2.5" />}
                      {med.trend === 'down' && <TrendingDown className="w-2.5 h-2.5" />}
                      {med.trend === 'surge' ? 'Surge' : med.trend === 'down' ? 'Stable' : 'Average'}
                    </p>
                  </td>
                  <td className={`px-4 py-3.5 text-xs ${med.status === 'critical' ? 'text-red-500 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                    {med.shelfLife}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[9px] font-bold py-0.5 px-2 rounded-full uppercase ${
                      med.aiPrediction.includes('Warning') || med.aiPrediction.includes('Alert')
                        ? 'bg-red-500/10 text-red-500'
                        : 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                    }`}>
                      {med.aiPrediction}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button className="text-teal-500 hover:text-teal-400 font-bold text-[10px] uppercase tracking-tight transition-colors cursor-pointer">
                      {med.status === 'critical' ? 'Emergency Order' : 'View Batch'}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-gray-400">
                    No medicines match &quot;{query}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 bg-gray-50/50 dark:bg-zinc-950/30 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
          <p className="text-[10px] text-gray-400">Showing {filtered.length} of {MEDICINES.length} medicines</p>
          <div className="flex gap-1.5">
            <button className="p-1 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
              <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <button className="p-1 border border-teal-500 rounded-lg bg-teal-500 text-white cursor-pointer">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Forecast + Logistics ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Demand Forecast Chart */}
        <div className="col-span-12 lg:col-span-7 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">Inventory Demand Forecast</h4>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">AI-driven 30-Day Projection</p>
            </div>
            <select className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-xs font-semibold rounded-lg px-2.5 py-1.5 text-gray-700 dark:text-zinc-200 focus:outline-none focus:border-teal-500 cursor-pointer">
              <option>All Essential Drugs</option>
              <option>Anti-Pyretics</option>
              <option>Antibiotics</option>
            </select>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FORECAST_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  cursor={{ fill: 'rgba(20,184,166,0.05)' }}
                  formatter={(v: number) => [`${v} units`, 'Demand']}
                />
                <Bar dataKey="demand" radius={[4, 4, 0, 0]} name="Projected Demand">
                  {FORECAST_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.isSurge ? '#ef4444' : '#14b8a6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-3 text-[9px] font-bold text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-teal-500 inline-block" /> Normal</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-red-500 inline-block" /> Projected Surge</span>
          </div>
        </div>

        {/* Logistics */}
        <div className="col-span-12 lg:col-span-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <h4 className="font-bold text-gray-900 dark:text-white mb-4">Logistics & Supply Chain</h4>
          <div className="space-y-4">
            {LOGISTICS.map((item) => {
              const isDelivered = item.status === 'DELIVERED';
              return (
                <div key={item.id} className={`flex gap-3 ${isDelivered ? 'opacity-50' : ''}`}>
                  <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800 flex items-center justify-center shrink-0">
                    {isDelivered
                      ? <CheckCircle2 className="w-4 h-4 text-gray-400" />
                      : item.status === 'PACKING'
                        ? <Package className="w-4 h-4 text-amber-500" />
                        : <Truck className="w-4 h-4 text-teal-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <p className="font-bold text-xs text-gray-900 dark:text-white truncate">{item.batch}</p>
                      <span className={`shrink-0 text-[8px] font-black px-2 py-0.5 rounded uppercase ${
                        item.statusColor === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                        item.statusColor === 'orange' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' :
                        'bg-gray-100 dark:bg-zinc-800 text-gray-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{item.desc}</p>
                    {item.progress !== null && item.remaining && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${item.progress}%` }} />
                        </div>
                        <span className="text-[8px] font-bold text-gray-400 shrink-0">{item.remaining}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Footer Banner ── */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 flex flex-wrap gap-6 justify-between items-center shadow-sm">
        {[
          { icon: Activity, label: 'Predict Problems', sub: 'Before they happen' },
          { icon: RefreshCw, label: 'Optimize Resources', sub: 'Reduce waste' },
          { icon: ShieldCheck, label: 'Improve Outcomes', sub: 'Better patient care' },
          { icon: Sparkles, label: 'Powered by AI', sub: 'Backed by data' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-teal-500" />
            <div>
              <p className="text-[10px] font-bold text-gray-900 dark:text-white">{label}</p>
              <p className="text-[9px] text-gray-400 uppercase tracking-wide">{sub}</p>
            </div>
          </div>
        ))}
        <p className="ml-auto italic text-sm text-gray-600 dark:text-gray-300 font-medium">
          Healthy Village, Healthy Nation ✨
        </p>
      </div>

    </div>
  );
}
