'use client';
// ============================================================
// Arogya AI Command Center — Medicine Inventory Intelligence
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Trash2, Calendar, FileText, Activity, ArrowUpRight,
  TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, Truck,
  FolderOpen, HelpCircle, RefreshCw, Send, ChevronLeft, ChevronRight,
  ShieldCheck, Thermometer, Info, Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from 'recharts';

interface MedicineItem {
  id: string;
  name: string;
  sku: string;
  category: 'Essential' | 'Antibiotic' | 'Vaccine' | 'Analgesic';
  onHand: number;
  unit: string;
  percentage: number;
  usage7d: number;
  trend: 'stable' | 'surge' | 'down';
  shelfLife: string;
  aiPrediction: string;
  status: 'in-stock' | 'low' | 'critical';
}

export default function InventoryTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MedicineItem | null>(null);

  // Mock datasets matching HTML schema
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    {
      id: '1',
      name: 'ORS Packets',
      sku: 'ORS-2024-XP',
      category: 'Essential',
      onHand: 1240,
      unit: 'pkts',
      percentage: 85,
      usage7d: 180,
      trend: 'down',
      shelfLife: 'Oct 2025',
      aiPrediction: 'Surplus likely',
      status: 'in-stock'
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      sku: 'AMX-SYP-02',
      category: 'Antibiotic',
      onHand: 42,
      unit: 'vials',
      percentage: 12,
      usage7d: 8,
      trend: 'surge',
      shelfLife: '14 Days left',
      aiPrediction: 'Stockout Warning',
      status: 'critical'
    },
    {
      id: '3',
      name: 'Covaxin Vial (5ml)',
      sku: 'CVX-009-MH',
      category: 'Vaccine',
      onHand: 85,
      unit: 'units',
      percentage: 42,
      usage7d: 12,
      trend: 'stable',
      shelfLife: 'Jan 2025',
      aiPrediction: 'Scheduled Restock',
      status: 'low'
    },
    {
      id: '4',
      name: 'Paracetamol 500mg',
      sku: 'PCM-500-GP',
      category: 'Analgesic',
      onHand: 420,
      unit: 'tablets',
      percentage: 24,
      usage7d: 110,
      trend: 'surge',
      shelfLife: 'Aug 2025',
      aiPrediction: 'Depletion Alert',
      status: 'critical'
    },
    {
      id: '5',
      name: 'Azithromycin 500mg',
      sku: 'AZI-500-XP',
      category: 'Antibiotic',
      onHand: 600,
      unit: 'tabs',
      percentage: 75,
      usage7d: 34,
      trend: 'stable',
      shelfLife: 'Nov 2025',
      aiPrediction: 'Optimal Stock',
      status: 'in-stock'
    }
  ]);

  // Handle Search
  const filteredMedicines = medicines.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Demand Forecast Chart Data
  const forecastData = [
    { name: 'WK 1', value: 420, expected: 400 },
    { name: 'WK 2', value: 680, expected: 500 },
    { name: 'WK 3', value: 850, expected: 650 },
    { name: 'WK 4', value: 510, expected: 480 },
  ];

  return (
    <div className="space-y-8 text-[#3a302a] dark:text-zinc-100">
      
      {/* Page Description */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-[#c2652a] dark:text-teal-400">Medicine Inventory Intelligence</h2>
          <p className="text-xs text-on-surface-variant dark:text-gray-400 mt-1">Predictive logistics and stock optimization across PHC Rampur network.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[#c2652a] hover:bg-[#a6501f] dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/10 cursor-pointer">
            <Truck className="w-3.5 h-3.5" />
            <span>Initiate Redistribution</span>
          </button>
          <button className="px-4 py-2 border border-outline-variant/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-1.5 cursor-pointer">
            <FileText className="w-3.5 h-3.5" />
            <span>Full Audit Report</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Top Section */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Critical Shortage Alert Hero Card */}
        <div className="col-span-12 lg:col-span-8 bg-[#f6f0e8] dark:bg-zinc-900/60 border border-outline-variant/40 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[10px] uppercase font-bold tracking-widest">Critical Shortage Alert</span>
            </div>
            <h3 className="text-2xl font-headline font-extrabold text-gray-900 dark:text-white">
              Paracetamol 500mg - Stock Depletion in 48h
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Unusually high demand detected in 3 satellite clinics due to Dengue cluster. Projected deficit: 1,400 units by Friday.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl border border-outline-variant/40 dark:border-zinc-800/80">
                <span className="text-[8px] uppercase font-bold text-gray-400">Current Stock</span>
                <p className="text-lg font-bold mt-1 text-[#3a302a] dark:text-zinc-200">420 <span className="text-xs font-normal opacity-70">units</span></p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl border border-outline-variant/40 dark:border-zinc-800/80">
                <span className="text-[8px] uppercase font-bold text-gray-400">Usage Rate</span>
                <p className="text-lg font-bold text-rose-500 mt-1">+142% <span className="text-[9px] font-normal opacity-70">vs avg</span></p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl border border-outline-variant/40 dark:border-zinc-800/80">
                <span className="text-[8px] uppercase font-bold text-gray-400">Transit Logs</span>
                <p className="text-lg font-bold text-[#c2652a] dark:text-teal-400 mt-1">800 <span className="text-[9px] font-normal opacity-70">ETA 4h</span></p>
              </div>
            </div>
          </div>
          
          {/* Circular SVG Gauge */}
          <div className="w-full md:w-56 bg-white dark:bg-zinc-950 rounded-2xl p-5 border border-outline-variant/40 dark:border-zinc-800/80 flex flex-col items-center justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="56" cy="56" fill="transparent" r="48" stroke="#e6e0d6" strokeWidth="8" className="dark:stroke-zinc-800" />
                <circle cx="56" cy="56" fill="transparent" r="48" stroke="#ef4444" strokeWidth="8" strokeDasharray="301.6" strokeDashoffset="240" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="text-2xl font-bold text-rose-500">12%</span>
                <span className="text-[8px] uppercase font-bold text-gray-400 mt-1">Safe Level</span>
              </div>
            </div>
            <p className="text-xs font-semibold text-rose-500 mt-4 text-center">Critical Reorder Triggered</p>
          </div>
        </div>

        {/* AI Intelligence Widget */}
        <div className="col-span-12 lg:col-span-4 bg-[#c2652a] dark:bg-zinc-900 text-white rounded-3xl p-6 shadow-sm border border-orange-600/20 dark:border-zinc-800 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24" />
          </div>
          <div className="relative z-10 space-y-4">
            <h4 className="text-lg font-headline font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-200 dark:text-teal-400" />
              AI Redistribution Recs
            </h4>
            <div className="space-y-3">
              <div className="bg-white/10 dark:bg-zinc-950/60 p-3 rounded-xl border border-white/10 dark:border-zinc-800/50 backdrop-blur-sm">
                <p className="text-[8px] font-black uppercase text-orange-200 dark:text-teal-400 tracking-wider">Path Optimization</p>
                <p className="text-[11px] mt-1 leading-relaxed opacity-90">PHC Shajahanpur has **300% surplus** of ORS. Transferring 40 cases to Rampur today avoids waste and addresses 15% shortfall.</p>
              </div>
              <div className="bg-white/10 dark:bg-zinc-950/60 p-3 rounded-xl border border-white/10 dark:border-zinc-800/50 backdrop-blur-sm">
                <p className="text-[8px] font-black uppercase text-orange-200 dark:text-teal-400 tracking-wider">Expiry Forecast</p>
                <p className="text-[11px] mt-1 leading-relaxed opacity-90">240 Amoxicillin units expiring in <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">14 DAYS</span>. Priority dispatch to Outpatient Dept recommended.</p>
              </div>
            </div>
          </div>
          <button className="relative z-10 w-full mt-4 py-2 bg-white dark:bg-teal-500 hover:bg-gray-100 dark:hover:bg-teal-400 text-[#c2652a] dark:text-slate-950 font-bold rounded-xl text-xs cursor-pointer transition-all shadow-md">
            Accept All Suggestions
          </button>
        </div>

      </div>

      {/* Live Stock Monitoring Table */}
      <div className="bg-[#fcfaf6] dark:bg-zinc-900/40 border border-outline-variant/40 dark:border-zinc-800/80 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h4 className="font-bold text-lg text-gray-950 dark:text-white">Live Stock Monitoring</h4>
            <p className="text-[10px] text-gray-400">Stock indices refreshed across local networks</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drug inventory..."
                className="bg-white dark:bg-zinc-950 border border-outline-variant/40 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-1.5 text-xs w-48 focus:outline-none focus:border-[#c2652a] text-gray-800 dark:text-zinc-200"
              />
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                In Stock
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/15 px-2 py-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Low
              </span>
              <span className="flex items-center gap-1.5 text-[9px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/15 px-2 py-1 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                Critical
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f6f0e8]/50 dark:bg-zinc-950/40 text-gray-500 dark:text-zinc-400">
              <tr>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider">Medicine / SKU</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider">On Hand</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider">Usage (7d)</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider">Shelf Life</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider">AI Prediction</th>
                <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 dark:divide-zinc-800/80">
              {filteredMedicines.map((med) => (
                <tr key={med.id} className="hover:bg-gray-50 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 dark:text-white text-xs">{med.name}</p>
                    <p className="text-[9px] font-mono text-gray-400 mt-0.5">{med.sku}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 border border-outline-variant/40 dark:border-zinc-850 bg-white dark:bg-zinc-900 rounded text-[9px] font-bold dark:text-gray-400">
                      {med.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`font-bold text-xs ${med.status === 'critical' ? 'text-rose-500' : 'text-gray-900 dark:text-white'}`}>
                      {med.onHand.toLocaleString()} <span className="font-normal text-[10px] opacity-70">{med.unit}</span>
                    </p>
                    <div className="w-20 h-1 bg-gray-200 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          med.status === 'critical' ? 'bg-rose-500' : med.status === 'low' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${med.percentage}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-semibold">{med.usage7d}/{med.unit.slice(0, 3)}/d</p>
                    <p className={`text-[8px] font-bold flex items-center gap-0.5 mt-0.5 ${
                      med.trend === 'surge' ? 'text-rose-500' : med.trend === 'down' ? 'text-emerald-500' : 'text-gray-400'
                    }`}>
                      {med.trend === 'surge' ? <TrendingUp className="w-2.5 h-2.5" /> : med.trend === 'down' ? <TrendingDown className="w-2.5 h-2.5" /> : null}
                      {med.trend === 'surge' ? 'Surge' : med.trend === 'down' ? 'Stable' : 'Average'}
                    </p>
                  </td>
                  <td className={`px-6 py-4 text-xs ${med.status === 'critical' ? 'text-rose-500 font-bold' : ''}`}>
                    {med.shelfLife}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-bold py-0.5 px-2 rounded-full uppercase ${
                      med.aiPrediction.includes('Warning') || med.aiPrediction.includes('Alert')
                        ? 'bg-rose-500/10 text-rose-500'
                        : 'bg-[#c2652a]/10 dark:bg-teal-500/10 text-[#c2652a] dark:text-teal-400'
                    }`}>
                      {med.aiPrediction}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#c2652a] dark:text-teal-400 hover:underline font-bold text-[10px] tracking-tight cursor-pointer">
                      {med.status === 'critical' ? 'Emergency Order' : 'View Batch'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3.5 bg-[#f6f0e8]/30 dark:bg-zinc-950/20 border-t border-outline-variant/20 dark:border-zinc-800/80 flex justify-between items-center text-xs text-gray-500">
          <p>Showing 1-{filteredMedicines.length} of 154 medicines</p>
          <div className="flex gap-2">
            <button className="p-1 border border-outline-variant/60 dark:border-zinc-800 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer">
              <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <button className="p-1 border border-outline-variant/60 dark:border-zinc-800 rounded bg-[#c2652a] dark:bg-teal-500 text-white dark:text-slate-950 hover:bg-[#a6501f] cursor-pointer">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Forecasting and Supply chain logistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Demand Forecasting Graph */}
        <div className="col-span-12 lg:col-span-7 bg-[#fcfaf6] dark:bg-zinc-900/40 border border-outline-variant/40 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">Inventory Demand Forecast</h4>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">AI-driven 30-Day Projection</p>
            </div>
            <select className="bg-white dark:bg-zinc-950 border border-outline-variant/40 dark:border-zinc-800 text-xs font-bold rounded-lg px-2.5 py-1 text-gray-700 dark:text-zinc-200">
              <option>All Essential Drugs</option>
              <option>Anti-Pyretics</option>
              <option>Antibiotics</option>
            </select>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-zinc-800/60" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Projected Demand">
                  {forecastData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 2 ? '#ef4444' : '#c2652a'} // Highlight projected surge in Week 3
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Logistics Supply Chain */}
        <div className="col-span-12 lg:col-span-5 bg-[#fcfaf6] dark:bg-zinc-900/40 border border-outline-variant/40 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-gray-900 dark:text-white">Logistics & Supply Chain</h4>
          <div className="space-y-4">
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-950 border border-outline-variant/40 dark:border-zinc-800/80 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#c2652a] dark:text-teal-400" />
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-950 dark:text-white">Batch #AX-992 (PHC Rampur)</span>
                  <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/15 px-2 py-0.5 rounded">IN TRANSIT</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal">Cold-chain insulin shipment. Temperature logged at 4.2°C.</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-[#c2652a] dark:bg-teal-500 w-[65%]" />
                  </div>
                  <span className="text-[8px] font-bold shrink-0">12km left</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-950 border border-outline-variant/40 dark:border-zinc-800/80 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-950 dark:text-white">Warehouse B - District Center</span>
                  <span className="text-[8px] font-black bg-[#c2652a]/10 text-[#c2652a] dark:text-teal-400 border border-[#c2652a]/15 px-2 py-0.5 rounded">PACKING</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal">Emergency replenishment for ORS and Paracetamol. Dispatch in 45m.</p>
              </div>
            </div>

            <div className="flex gap-4 opacity-50">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-950 border border-outline-variant/40 dark:border-zinc-800/80 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-950 dark:text-white">Batch #TR-441 - Delivered</span>
                  <span className="text-[8px] font-black bg-gray-100 text-gray-400 border border-gray-200 px-2 py-0.5 rounded">DELIVERED</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-normal">General antibiotics and gauze. Received by Dr. Mehra yesterday.</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Sticky Bottom Health Mission Banner */}
      <footer className="mt-8 border-t border-outline-variant/20 dark:border-zinc-850 bg-[#fbfaf8] dark:bg-zinc-950/40 p-4 rounded-3xl flex flex-wrap gap-6 justify-between items-center text-[10px] text-gray-500 font-medium">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#c2652a] dark:text-teal-400" />
          <span>Predict Problems before they happen</span>
        </div>
        <div className="w-px h-4 bg-gray-200 dark:bg-zinc-850" />
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[#c2652a] dark:text-teal-400" />
          <span>Optimize Resources & reduce waste</span>
        </div>
        <div className="w-px h-4 bg-gray-200 dark:bg-zinc-850" />
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#c2652a] dark:text-teal-400" />
          <span>Improve Outcomes & patient care</span>
        </div>
        <div className="ml-auto italic font-headline text-[#3a302a] dark:text-zinc-200 text-sm flex items-center gap-1.5">
          <span>Healthy Village, Healthy Nation</span>
          <span className="material-symbols-outlined text-xs not-italic text-[#c2652a] dark:text-teal-400">sentiment_satisfied</span>
        </div>
      </footer>

    </div>
  );
}
