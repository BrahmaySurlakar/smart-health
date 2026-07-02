'use client';
// ============================================================
// Arogya AI Command Center — Patients Tab
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, Heart, ShieldAlert, Calendar, User, Phone, MapPin,
  X, Check, Activity, Sparkles, FileText, PlusCircle, ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { getPatients } from '@/data/generators';
import { Patient } from '@/types';
import { getRiskColor, getRiskBgColor, formatDate, getRelativeTime } from '@/lib/utils';

export default function PatientsTab() {
  const [patients, setPatients] = useState<Patient[]>(getPatients());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Low'>('All');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Filtering Logic
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());

    const score = p.riskScore;
    let matchesRisk = true;
    if (selectedRiskFilter === 'Critical') matchesRisk = score >= 80;
    else if (selectedRiskFilter === 'High') matchesRisk = score >= 60 && score < 80;
    else if (selectedRiskFilter === 'Medium') matchesRisk = score >= 40 && score < 60;
    else if (selectedRiskFilter === 'Low') matchesRisk = score < 40;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filtering Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search by ID, name, village, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-teal-500/50"
          />
        </div>

        {/* Risk Level Toggles */}
        <div className="flex gap-2 self-start md:self-auto overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
          {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map((filter) => {
            const isSelected = selectedRiskFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setSelectedRiskFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-teal-600 text-white'
                    : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                }`}
              >
                {filter} Risk
              </button>
            );
          })}
        </div>
      </div>

      {/* Patients Grid/Table list */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-zinc-500 bg-gray-50/50 dark:bg-zinc-900/50">
                <th className="p-4 pl-6">Patient ID</th>
                <th className="p-4">Name & Demographics</th>
                <th className="p-4">Village</th>
                <th className="p-4 text-center">Risk Score</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Last Visit</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80 text-xs">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => {
                  const riskColor = getRiskColor(patient.riskScore);
                  const riskBg = getRiskBgColor(patient.riskScore);
                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-gray-50/40 dark:hover:bg-zinc-950/20 transition-colors"
                    >
                      <td className="p-4 pl-6 font-mono font-bold text-teal-600 dark:text-teal-400">
                        {patient.id}
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{patient.name}</div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                            {patient.age} yrs • {patient.gender}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-300 font-medium">
                        {patient.village}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full border text-[10px] font-bold ${riskColor} ${riskBg}`}>
                          {patient.riskScore}%
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{patient.bloodGroup}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400">
                        {getRelativeTime(patient.lastVisit)}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => setSelectedPatient(patient)}
                          className="px-3 py-1 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500 hover:text-white font-bold transition-all duration-200 cursor-pointer"
                        >
                          View Record
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No patient records found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Twin Clinical Detail Modal Overlay */}
      <AnimatePresence>
        {selectedPatient && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPatient(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-zinc-900 shadow-2xl z-[90] flex flex-col border-l border-gray-100 dark:border-zinc-800 text-xs text-gray-800 dark:text-gray-200"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">{selectedPatient.name}</h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">Clinical Digital Twin • {selectedPatient.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Scrollable Clinical Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Visual Demographics Summary Card */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800/80">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Age & Gender</div>
                    <div className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">{selectedPatient.age} yrs • {selectedPatient.gender}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Contact</div>
                    <div className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">{selectedPatient.phone}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Village</div>
                    <div className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">{selectedPatient.village}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Blood Type</div>
                    <div className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">{selectedPatient.bloodGroup}</div>
                  </div>
                </div>

                {/* AI Recommendation Panel */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/20 flex flex-col md:flex-row gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-slate-950 shrink-0 shadow-lg shadow-teal-500/15">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-teal-800 dark:text-teal-400 text-sm">AI Patient Recommendation</span>
                      <span className="text-[9px] uppercase tracking-wide font-bold bg-teal-500/20 text-teal-700 dark:text-teal-300 px-1.5 py-0.5 rounded">
                        Confidence: {selectedPatient.confidenceScore}%
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-[11px] leading-relaxed">
                      {selectedPatient.aiRecommendation}
                    </p>
                  </div>
                </div>

                {/* Interactive Vitals History Line Charts */}
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-950 dark:text-white text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-500" />
                    Vitals Cohort History
                  </h4>
                  <div className="p-4 bg-white dark:bg-zinc-950/30 border border-gray-100 dark:border-zinc-800/80 rounded-2xl">
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={selectedPatient.vitals.slice(-6)} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                          <XAxis
                            dataKey="date"
                            stroke="#9CA3AF"
                            fontSize={9}
                            tickFormatter={(str) => new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          />
                          <YAxis stroke="#9CA3AF" fontSize={9} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1F2937',
                              border: 'none',
                              borderRadius: '8px',
                              color: '#fff',
                              fontSize: '10px',
                            }}
                          />
                          <Line type="monotone" dataKey="bloodPressureSystolic" stroke="#EF4444" strokeWidth={2} name="BP Systolic" dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="bloodPressureDiastolic" stroke="#F59E0B" strokeWidth={2} name="BP Diastolic" dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="spO2" stroke="#10B981" strokeWidth={2} name="SpO2 %" dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="heartRate" stroke="#3B82F6" strokeWidth={2} name="Heart Rate" dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Lower Grid: Clinical Checks vs Prescriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Allergies & Chronic Conditions */}
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800/80 space-y-3">
                    <h5 className="font-bold text-gray-950 dark:text-white">Allergies & Conditions</h5>
                    <div className="space-y-2">
                      <div>
                        <div className="text-[10px] text-gray-400">Allergies</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedPatient.allergies.map((a) => (
                            <span key={a} className={`px-2 py-0.5 rounded text-[10px] font-bold ${a === 'None' ? 'bg-gray-100 text-gray-500' : 'bg-red-500/10 text-red-500'}`}>
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400">Chronic Diseases</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedPatient.chronicDiseases.map((d) => (
                            <span key={d} className={`px-2 py-0.5 rounded text-[10px] font-bold ${d === 'None' ? 'bg-gray-100 text-gray-500' : 'bg-orange-500/10 text-orange-500'}`}>
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Active Prescriptions */}
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-950/40 border border-gray-100 dark:border-zinc-800/80 space-y-3">
                    <h5 className="font-bold text-gray-950 dark:text-white">Active Prescriptions</h5>
                    <div className="divide-y divide-gray-200/50 dark:divide-zinc-800/60 space-y-2">
                      {selectedPatient.prescriptions && selectedPatient.prescriptions.length > 0 ? (
                        selectedPatient.prescriptions[0].medicines.map((m, idx) => (
                          <div key={idx} className="pt-2 first:pt-0 flex justify-between items-center text-[11px]">
                            <div>
                              <div className="font-bold text-gray-800 dark:text-gray-200">{m.name}</div>
                              <div className="text-[10px] text-gray-500">{m.dosage} • {m.frequency}</div>
                            </div>
                            <span className="text-[10px] text-gray-400">{m.duration}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-[10px]">No active prescriptions.</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Visit History Log */}
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-950 dark:text-white text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-500" />
                    Consultation History Log
                  </h4>
                  <div className="divide-y divide-gray-100 dark:divide-zinc-800/80 border border-gray-100 dark:border-zinc-800/80 rounded-2xl overflow-hidden bg-white dark:bg-zinc-950/10">
                    {selectedPatient.visits.map((visit) => (
                      <div key={visit.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{visit.diagnosis}</div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                            Consulted by {visit.doctor} • {visit.notes}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-start md:self-auto text-[10px] text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDate(visit.date)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
