'use client';
// ============================================================
// Arogya AI Command Center — Pharmacy & Inventory Tab
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pill, AlertTriangle, ArrowRightLeft, Sparkles, Check, CheckCircle2,
  Calendar, RefreshCw, BarChart2, TrendingUp, AlertCircle, ShoppingCart, X
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { getMedicines, generateRedistributions } from '@/data/generators';
import { Medicine, RedistributionRecommendation } from '@/types';
import { formatDate } from '@/lib/utils';

export default function PharmacyTab() {
  const [medicines, setMedicines] = useState<Medicine[]>(getMedicines());
  const [redistributions, setRedistributions] = useState<RedistributionRecommendation[]>(generateRedistributions());
  const [selectedStockFilter, setSelectedStockFilter] = useState<'All' | 'Low' | 'Critical' | 'Adequate' | 'Expiring'>('All');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [actionedTransfers, setActionedTransfers] = useState<Record<number, boolean>>({});

  const handleTransfer = (idx: number, recommendation: RedistributionRecommendation) => {
    setActionedTransfers(prev => ({ ...prev, [idx]: true }));
    
    // Simulate updating stock counts
    setMedicines(prev =>
      prev.map(med => {
        if (med.name === recommendation.medicine) {
          const qty = recommendation.quantity;
          const isIncoming = recommendation.toFacility.includes('Varanasi');
          const newStock = isIncoming ? med.currentStock + qty : med.currentStock - qty;
          
          let newStatus = med.stockStatus;
          if (newStock <= 0) newStatus = 'Out of Stock';
          else if (newStock < med.minimumStock * 0.3) newStatus = 'Critical';
          else if (newStock < med.minimumStock) newStatus = 'Low';
          else newStatus = 'Adequate';

          return { ...med, currentStock: newStock, stockStatus: newStatus };
        }
        return med;
      })
    );
  };

  // Filter Inventory
  const filteredInventory = medicines.filter((m) => {
    if (selectedStockFilter === 'Critical') return m.stockStatus === 'Critical' || m.stockStatus === 'Out of Stock';
    if (selectedStockFilter === 'Low') return m.stockStatus === 'Low';
    if (selectedStockFilter === 'Adequate') return m.stockStatus === 'Adequate' || m.stockStatus === 'Overstocked';
    if (selectedStockFilter === 'Expiring') return m.daysUntilExpiry <= 30;
    return true; // 'All'
  });

  const getStockStatusClass = (status: Medicine['stockStatus']) => {
    switch (status) {
      case 'Out of Stock':
      case 'Critical':
        return 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Low':
        return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Adequate':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Overstocked':
        return 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upper Grid: Smart Redistribution Proposals */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-500/[0.05] to-emerald-500/[0.05] border border-teal-500/10">
        <h3 className="font-bold text-gray-950 dark:text-white text-sm flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-teal-500" />
          AI Smart Redistribution Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {redistributions.map((rec, idx) => {
            const isCompleted = actionedTransfers[idx];
            const isIncoming = rec.toFacility.includes('Varanasi');
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800/80 shadow-sm flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      isIncoming ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}>
                      {isIncoming ? 'Acquisition (IN)' : 'Dispatch (OUT)'}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-500">Save ₹{rec.savings}</span>
                  </div>
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white">
                    {rec.medicine} • {rec.quantity} units
                  </h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed">
                    {rec.reason}
                  </p>
                  <div className="text-[10px] text-gray-400 font-medium">
                    Route: {rec.fromFacility} → {rec.toFacility}
                  </div>
                </div>
                <button
                  onClick={() => handleTransfer(idx, rec)}
                  disabled={isCompleted}
                  className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/5'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Transfer Actioned</span>
                    </>
                  ) : (
                    <>
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>Accept Transfer</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Critical', 'Low', 'Adequate', 'Expiring'] as const).map((filter) => {
            const isSelected = selectedStockFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedStockFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-teal-600 text-white'
                    : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-zinc-500 bg-gray-50/50 dark:bg-zinc-900/50">
                <th className="p-4 pl-6">Drug Name</th>
                <th className="p-4">Generic Composition</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-center">Current Stock</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4">Expiry Condition</th>
                <th className="p-4 pr-6 text-right">Forecast</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
              {filteredInventory.map((med) => {
                const statusClass = getStockStatusClass(med.stockStatus);
                const isExpiringSoon = med.daysUntilExpiry <= 30;
                const isExpired = med.daysUntilExpiry <= 0;

                return (
                  <tr
                    key={med.id}
                    onClick={() => setSelectedMedicine(med)}
                    className="hover:bg-gray-50/40 dark:hover:bg-zinc-950/20 transition-colors cursor-pointer"
                  >
                    <td className="p-4 pl-6 font-bold text-gray-900 dark:text-white">
                      {med.name}
                    </td>
                    <td className="p-4 text-gray-500 italic font-medium">{med.genericName}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400 font-semibold">{med.category}</td>
                    <td className="p-4 text-center font-extrabold text-gray-800 dark:text-gray-200">
                      {med.currentStock} {med.unit}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${statusClass}`}>
                        {med.stockStatus}
                      </span>
                    </td>
                    <td className={`p-4 font-semibold ${
                      isExpired ? 'text-red-500' : isExpiringSoon ? 'text-amber-500' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {isExpired ? 'Expired' : isExpiringSoon ? `Expiring in ${med.daysUntilExpiry}d` : formatDate(med.expiryDate)}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 bg-teal-500/10 font-bold px-2 py-0.5 rounded">
                        ~{med.usagePerDay}/day
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Demand Forecast Dynamic Sheet Modal */}
      <AnimatePresence>
        {selectedMedicine && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMedicine(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl z-[90] flex flex-col border-l border-gray-100 dark:border-zinc-800 p-6 space-y-6 text-xs"
            >
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <Pill className="w-5 h-5 text-teal-500" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{selectedMedicine.name}</h3>
                    <p className="text-[10px] text-gray-400">Inventory ID: {selectedMedicine.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMedicine(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800/80">
                <div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase">Generic Name</div>
                  <div className="font-bold text-gray-800 dark:text-gray-200 mt-0.5 italic">{selectedMedicine.genericName}</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase">Price Per Unit</div>
                  <div className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">₹{selectedMedicine.pricePerUnit}</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase">Batch Number</div>
                  <div className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">{selectedMedicine.batchNumber}</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-400 font-bold uppercase">Supplier</div>
                  <div className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">{selectedMedicine.supplier}</div>
                </div>
              </div>

              {/* Demand Forecast Chart */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-teal-500" />
                  30-Day Demand Prediction Model
                </h4>
                <div className="h-44 w-full p-2 bg-white dark:bg-zinc-950/30 border border-gray-100 dark:border-zinc-800/80 rounded-xl">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedMedicine.demandForecast.slice(0, 15)} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                      <XAxis dataKey="day" stroke="#9CA3AF" fontSize={8} />
                      <YAxis stroke="#9CA3AF" fontSize={8} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '10px',
                        }}
                      />
                      <Area type="monotone" dataKey="predicted" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.15} name="Predicted Usage" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-teal-500/20 bg-teal-500/[0.04] text-[11px] leading-relaxed text-teal-700 dark:text-teal-400">
                <div className="font-bold flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  AI Forecast Insight
                </div>
                At the current daily burn rate of {selectedMedicine.usagePerDay} units, your current stock will sustain operations for approximately {Math.round(selectedMedicine.currentStock / selectedMedicine.usagePerDay)} days. No immediate ordering necessary.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
