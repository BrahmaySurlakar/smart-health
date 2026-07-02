'use client';
// ============================================================
// Arogya AI Command Center — OPD Queue Tab
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserCheck, Stethoscope, Clock, ShieldAlert, Sparkles, Plus, Check,
  Play, Ban, ArrowRight, UserPlus, Trash2, Calendar
} from 'lucide-react';
import { generateQueueEntries } from '@/data/generators';
import { QueueEntry } from '@/types';
import { formatTime } from '@/lib/utils';

export default function QueueTab() {
  const [queue, setQueue] = useState<QueueEntry[]>(generateQueueEntries(16));
  const [showAddModal, setShowAddModal] = useState(false);

  // New token fields
  const [newName, setNewName] = useState('');
  const [newPriority, setNewPriority] = useState<QueueEntry['priority']>('Normal');
  const [newDept, setNewDept] = useState('General OPD');

  const activeConsultations = queue.filter(q => q.status === 'In Consultation');
  const waitingPatients = queue.filter(q => q.status === 'Waiting');
  const completedPatients = queue.filter(q => q.status === 'Completed' || q.status === 'No Show');

  // Trigger next patient (Waiting -> Consultation)
  const handleCallPatient = (id: string) => {
    setQueue(prev =>
      prev.map(q => {
        if (q.id === id) {
          return { ...q, status: 'In Consultation' as const, estimatedWaitTime: 0 };
        }
        return q;
      })
    );
  };

  // Complete consultation
  const handleCompletePatient = (id: string) => {
    setQueue(prev =>
      prev.map(q => {
        if (q.id === id) {
          return { ...q, status: 'Completed' as const, actualWaitTime: Math.round((Date.now() - new Date(q.checkInTime).getTime()) / 60000) };
        }
        return q;
      })
    );
  };

  // Mark patient as No Show
  const handleNoShowPatient = (id: string) => {
    setQueue(prev =>
      prev.map(q => (q.id === id ? { ...q, status: 'No Show' as const } : q))
    );
  };

  // Register a new patient in the queue
  const handleAddToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const nextToken = Math.max(...queue.map(q => q.tokenNumber), 100) + 1;
    const newEntry: QueueEntry = {
      id: Math.random().toString(36).substring(2, 9),
      tokenNumber: nextToken,
      patientName: newName,
      patientId: `P${Math.floor(10000 + Math.random() * 90000)}`,
      priority: newPriority,
      department: newDept,
      doctor: 'Dr. Priya Patel',
      status: 'Waiting',
      checkInTime: new Date().toISOString(),
      estimatedWaitTime: waitingPatients.length * 10 + 10,
    };

    setQueue(prev => [...prev, newEntry]);
    setNewName('');
    setShowAddModal(false);
  };

  const getPriorityBadgeClass = (priority: QueueEntry['priority']) => {
    switch (priority) {
      case 'Emergency': return 'bg-rose-500/10 border-rose-500/30 text-rose-500 font-extrabold';
      case 'Pregnant': return 'bg-pink-500/10 border-pink-500/30 text-pink-500';
      case 'Senior': return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
      case 'Child': return 'bg-purple-500/10 border-purple-500/30 text-purple-500';
      case 'Normal': return 'bg-gray-100 dark:bg-zinc-800 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Queue Toolbar Stats & Add Token trigger */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-500" />
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
              Avg OPD Wait Time: <span className="text-teal-600 dark:text-teal-400">32 minutes</span>
            </span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-500" />
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
              Queue Load: <span className="text-teal-600 dark:text-teal-400">{waitingPatients.length} Waiting</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-teal-500/10 cursor-pointer self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Intake New Patient</span>
        </button>
      </div>

      {/* Tri-Column Queue Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Active Consultations (In Progress) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800/85 pb-2">
            <h4 className="font-bold text-gray-950 dark:text-white text-xs flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              In Consultation ({activeConsultations.length})
            </h4>
          </div>
          <div className="space-y-3">
            {activeConsultations.length > 0 ? (
              activeConsultations.map(entry => (
                <motion.div
                  layoutId={entry.id}
                  key={entry.id}
                  className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-teal-500">Token #{entry.tokenNumber}</span>
                      <h5 className="font-bold text-xs text-gray-950 dark:text-white mt-0.5">{entry.patientName}</h5>
                      <p className="text-[10px] text-gray-400 mt-0.5">{entry.department} • {entry.doctor}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded border text-[9px] font-semibold ${getPriorityBadgeClass(entry.priority)}`}>
                      {entry.priority}
                    </span>
                  </div>
                  <div className="flex gap-2 border-t border-gray-100 dark:border-zinc-800/60 pt-2.5">
                    <button
                      onClick={() => handleCompletePatient(entry.id)}
                      className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-md shadow-emerald-500/5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Consultation Done</span>
                    </button>
                    <button
                      onClick={() => handleNoShowPatient(entry.id)}
                      className="py-1.5 px-3 bg-gray-100 dark:bg-zinc-800 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg text-[10px] font-semibold text-gray-500 transition-colors cursor-pointer"
                    >
                      No Show
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl text-gray-400">
                No active doctor consultations.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Waiting Queue */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800/85 pb-2">
            <h4 className="font-bold text-gray-950 dark:text-white text-xs flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Waiting Lobby ({waitingPatients.length})
            </h4>
          </div>
          <div className="space-y-3">
            {waitingPatients.length > 0 ? (
              waitingPatients.map(entry => (
                <motion.div
                  layoutId={entry.id}
                  key={entry.id}
                  className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm flex flex-col gap-3 hover:border-teal-500/20 transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-gray-400 dark:text-zinc-500">Token #{entry.tokenNumber}</span>
                      <h5 className="font-bold text-xs text-gray-950 dark:text-white mt-0.5">{entry.patientName}</h5>
                      <p className="text-[10px] text-gray-400 mt-0.5">{entry.department}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-semibold ${getPriorityBadgeClass(entry.priority)}`}>
                        {entry.priority}
                      </span>
                      <span className="text-[9px] font-semibold text-teal-600 dark:text-teal-400">
                        Wait: ~{entry.estimatedWaitTime}m
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 border-t border-gray-100 dark:border-zinc-800/60 pt-2.5 items-center justify-between text-[10px]">
                    <span className="text-gray-400">Arrived: {formatTime(entry.checkInTime)}</span>
                    <button
                      onClick={() => handleCallPatient(entry.id)}
                      className="py-1 px-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-md shadow-teal-500/5"
                    >
                      <span>Call Patient</span>
                      <Play className="w-3 h-3 fill-slate-950 stroke-none" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl text-gray-400">
                Lobby is empty. All patients served!
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Completed / Archive */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800/85 pb-2">
            <h4 className="font-bold text-gray-950 dark:text-white text-xs flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Served / No Show ({completedPatients.length})
            </h4>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {completedPatients.length > 0 ? (
              completedPatients.map(entry => (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-950/20 border border-gray-100 dark:border-zinc-800/85 flex justify-between items-center"
                >
                  <div>
                    <span className="text-[9px] font-mono text-gray-400">Token #{entry.tokenNumber}</span>
                    <h5 className="font-bold text-xs text-gray-800 dark:text-gray-300 mt-0.5 line-clamp-1">{entry.patientName}</h5>
                    <p className="text-[9px] text-gray-400 mt-0.5">{entry.department}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                    entry.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {entry.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl text-gray-400">
                No history log for today yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Token Slide-over Intake dialog modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed inset-0 m-auto w-full max-w-md h-fit bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-2xl p-6 z-[90] flex flex-col gap-5 text-xs text-gray-800 dark:text-gray-200"
            >
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800/80 pb-3">
                <h4 className="font-bold text-gray-950 dark:text-white text-sm">Register New Queue Intake</h4>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <Ban className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleAddToken} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-400">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Enter name (e.g. Ramesh Kumar)"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 focus:outline-none focus:border-teal-500/50 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-400">Triage Priority</label>
                    <select
                      value={newPriority}
                      onChange={e => setNewPriority(e.target.value as QueueEntry['priority'])}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 focus:outline-none focus:border-teal-500/50 text-gray-900 dark:text-gray-100"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Child">Child / Pediatric</option>
                      <option value="Senior">Senior Citizen</option>
                      <option value="Pregnant">Maternity / Pregnant</option>
                      <option value="Emergency">Emergency Triage</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-400">OPD Department</label>
                    <select
                      value={newDept}
                      onChange={e => setNewDept(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 focus:outline-none focus:border-teal-500/50 text-gray-900 dark:text-gray-100"
                    >
                      <option value="General OPD">General OPD</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Gynecology">Gynecology</option>
                      <option value="Dental">Dental Care</option>
                      <option value="Eye">Ophthalmology</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-teal-500/10 cursor-pointer"
                >
                  Generate Queue Token
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
