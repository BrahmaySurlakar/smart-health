'use client';
// ============================================================
// Arogya AI Command Center — Fleet & Ambulance Tab
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, CheckCircle2, AlertTriangle, Play, Check, Navigation, Fuel,
  Compass, ShieldAlert, Sparkles, MapPin, X, Info, PhoneCall
} from 'lucide-react';
import { generateAmbulances } from '@/data/generators';
import { Ambulance } from '@/types';
import { formatDate } from '@/lib/utils';

const VILLAGES = ['Rampur', 'Sultanpur', 'Laxmipur', 'Govindpur', 'Krishnapur', 'Chandpur', 'Devpur'];

export default function AmbulanceTab() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>(generateAmbulances());
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
  const [dispatchVillage, setDispatchVillage] = useState(VILLAGES[0]);
  const [isDispatching, setIsDispatching] = useState(false);

  // Trigger dispatch simulation
  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmbulance) return;
    
    setIsDispatching(true);
    const targetAmbId = selectedAmbulance.id;
    
    setTimeout(() => {
      setAmbulances(prev =>
        prev.map(a => {
          if (a.id === targetAmbId) {
            return {
              ...a,
              status: 'En Route' as const,
              currentDestination: `${dispatchVillage} Village`,
              eta: Math.floor(8 + Math.random() * 15),
            };
          }
          return a;
        })
      );
      setIsDispatching(false);
      setSelectedAmbulance(null);
    }, 1200);
  };

  // Mark vehicle available
  const handleMakeAvailable = (id: string) => {
    setAmbulances(prev =>
      prev.map(a => {
        if (a.id === id) {
          return {
            ...a,
            status: 'Available' as const,
            currentDestination: undefined,
            eta: undefined,
          };
        }
        return a;
      })
    );
  };

  const getStatusClass = (status: Ambulance['status']) => {
    switch (status) {
      case 'Available':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'En Route':
      case 'Returning':
        return 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'At Scene':
        return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Maintenance':
        return 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20';
    }
  };

  return (
    <div className="space-y-6 text-xs text-gray-800 dark:text-gray-200">
      
      {/* Fleet Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ambulances.map((amb) => {
          const statusClass = getStatusClass(amb.status);
          const fuelLevel = amb.fuelLevel;
          const fuelColor = fuelLevel < 40 ? 'bg-rose-500' : fuelLevel < 70 ? 'bg-amber-500' : 'bg-emerald-500';

          return (
            <motion.div
              layout
              key={amb.id}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col justify-between gap-4 hover:border-teal-500/20 transition-all duration-200"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-950 dark:text-white text-xs">{amb.vehicleNumber}</h4>
                    <p className="text-[10px] text-gray-400">Class {amb.type} • {amb.driver}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${statusClass}`}>
                  {amb.status}
                </span>
              </div>

              {/* ETA / Destination description if busy */}
              {(amb.status === 'En Route' || amb.status === 'At Scene') && amb.currentDestination && (
                <div className="p-3 bg-blue-500/[0.04] border border-blue-500/15 rounded-xl">
                  <div className="text-[9px] text-gray-400 font-bold uppercase">Destination Dispatch</div>
                  <div className="font-bold text-gray-700 dark:text-gray-300 mt-1 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-blue-500" />
                    <span>{amb.currentDestination}</span>
                  </div>
                  {amb.eta !== undefined && amb.eta > 0 && (
                    <div className="text-[9px] text-blue-500 font-bold mt-1">
                      Estimated ETA: {amb.eta} mins
                    </div>
                  )}
                </div>
              )}

              {/* Fuel Level progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5" />
                    Fuel Level
                  </span>
                  <span className="font-bold">{fuelLevel}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${fuelColor}`} style={{ width: `${fuelLevel}%` }} />
                </div>
              </div>

              {/* Fleet Action triggers */}
              <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-zinc-800/80">
                {amb.status === 'Available' ? (
                  <button
                    onClick={() => setSelectedAmbulance(amb)}
                    className="w-full py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-md shadow-teal-500/5 text-[10px]"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                    <span>Dispatch Vehicle</span>
                  </button>
                ) : amb.status !== 'Maintenance' ? (
                  <button
                    onClick={() => handleMakeAvailable(amb.id)}
                    className="w-full py-1.5 bg-gray-100 dark:bg-zinc-800 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/20 rounded-lg font-bold text-gray-500 border border-transparent transition-colors cursor-pointer text-[10px]"
                  >
                    <span>Release to Available</span>
                  </button>
                ) : (
                  <div className="w-full text-center text-gray-400 text-[10px] py-1.5 font-bold">
                    Vehicle offline for maintenance
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Dispatch Simulation Overlay Dialog */}
      <AnimatePresence>
        {selectedAmbulance && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAmbulance(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-0 m-auto w-full max-w-sm h-fit bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 z-[90] flex flex-col gap-4 text-xs"
            >
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800/80 pb-2.5">
                <h4 className="font-bold text-gray-950 dark:text-white text-sm">Ambulance Dispatch Control</h4>
                <button
                  onClick={() => setSelectedAmbulance(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleDispatch} className="space-y-4">
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Active Vehicle</div>
                  <div className="font-bold text-gray-900 dark:text-white mt-0.5">
                    {selectedAmbulance.vehicleNumber} ({selectedAmbulance.driver})
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-400">Target Dispatch Village</label>
                  <select
                    value={dispatchVillage}
                    onChange={e => setDispatchVillage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 focus:outline-none focus:border-teal-500/50 text-gray-900 dark:text-gray-100"
                  >
                    {VILLAGES.map(v => (
                      <option key={v} value={v}>{v} Village</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isDispatching}
                  className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-teal-500/10 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isDispatching ? (
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 text-slate-950" />
                      <span>Dispatch Ambulance</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
