'use client';
// ============================================================
// Arogya AI Command Center — Bed & Ward Management Tab
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bed as BedIcon, CheckCircle2, UserCheck, AlertTriangle, Hammer, Brush,
  ChevronRight, Users, Trash2, Calendar, FileText, Activity, ArrowUpRight
} from 'lucide-react';
import { getBeds, generateWardStats, getPatients, getDoctors } from '@/data/generators';
import { Bed, WardStats } from '@/types';
import { formatDate } from '@/lib/utils';

export default function BedsTab() {
  const [beds, setBeds] = useState<Bed[]>(getBeds());
  const [wardStats, setWardStats] = useState<WardStats[]>(generateWardStats());
  const [selectedWard, setSelectedWard] = useState<string>('ICU');
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  // Assignment states
  const [selectedPatientName, setSelectedPatientName] = useState('');
  const [selectedDoctorName, setSelectedDoctorName] = useState('');
  const [assigningDays, setAssigningDays] = useState(3);

  const patientsList = getPatients();
  const doctorsList = getDoctors();

  // Filter beds by active ward
  const filteredBeds = beds.filter((b) => b.ward === selectedWard);

  // Ward configuration details
  const activeStats = wardStats.find((w) => w.ward === selectedWard) || {
    total: 0, occupied: 0, available: 0, cleaning: 0, occupancyRate: 0, avgStay: 0
  };

  // Handle patient assignment
  const handleAssignPatient = (bedId: string) => {
    if (!selectedPatientName || !selectedDoctorName) return;

    const admissionDate = new Date();
    const predictedDischarge = new Date();
    predictedDischarge.setDate(admissionDate.getDate() + assigningDays);

    const updatedBed: Bed = {
      id: bedId,
      number: selectedBed!.number,
      ward: selectedBed!.ward,
      status: 'Occupied' as const,
      patient: selectedPatientName,
      doctor: selectedDoctorName,
      admissionDate: admissionDate.toISOString(),
      predictedDischarge: predictedDischarge.toISOString(),
    };

    setBeds((prev) =>
      prev.map((b) => (b.id === bedId ? updatedBed : b))
    );

    // Update stats
    setWardStats((prev) =>
      prev.map((w) => {
        if (w.ward === selectedWard) {
          const newOccupied = w.occupied + 1;
          const newAvailable = Math.max(0, w.available - 1);
          return {
            ...w,
            occupied: newOccupied,
            available: newAvailable,
            occupancyRate: Math.round((newOccupied / w.total) * 100),
          };
        }
        return w;
      })
    );

    // Reset selection values & keep the updated occupied bed active
    setSelectedPatientName('');
    setSelectedDoctorName('');
    setSelectedBed(updatedBed);
  };

  // Handle bed release (discharge patient)
  const handleDischarge = (bedId: string) => {
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? {
              ...b,
              status: 'Cleaning' as const,
              patient: undefined,
              admissionDate: undefined,
              predictedDischarge: undefined,
              doctor: undefined,
            }
          : b
      )
    );
    // Update stats
    setWardStats((prev) =>
      prev.map((w) => {
        if (w.ward === selectedWard) {
          const newOccupied = Math.max(0, w.occupied - 1);
          return {
            ...w,
            occupied: newOccupied,
            cleaning: w.cleaning + 1,
            available: w.total - newOccupied - (w.cleaning + 1),
            occupancyRate: Math.round((newOccupied / w.total) * 100),
          };
        }
        return w;
      })
    );
    setSelectedBed(null);
  };

  // Change Bed Status (e.g., set to Available after cleaning)
  const handleStatusChange = (bedId: string, newStatus: Bed['status']) => {
    setBeds((prev) =>
      prev.map((b) => (b.id === bedId ? { ...b, status: newStatus } : b))
    );
    // Update stats
    setWardStats((prev) =>
      prev.map((w) => {
        if (w.ward === selectedWard) {
          const occupiedCount = beds.filter(b => b.ward === selectedWard && b.status === 'Occupied').length;
          const cleaningCount = beds.filter(b => b.ward === selectedWard && b.status === 'Cleaning').length + (newStatus === 'Cleaning' ? 1 : 0) - (beds.find(b=>b.id === bedId)?.status === 'Cleaning' ? 1 : 0);
          
          return {
            ...w,
            occupied: occupiedCount,
            cleaning: cleaningCount,
            available: w.total - occupiedCount - cleaningCount,
            occupancyRate: Math.round((occupiedCount / w.total) * 100),
          };
        }
        return w;
      })
    );
    setSelectedBed(null);
  };

  const getBedStatusBg = (status: Bed['status'], isSelected: boolean) => {
    const border = isSelected ? 'border-teal-500 scale-[1.03] ring-2 ring-teal-500/20' : 'border-gray-100 dark:border-zinc-800';
    switch (status) {
      case 'Occupied':
        return `bg-rose-500/10 text-rose-500 hover:bg-rose-500/15 border-rose-500/30 ${border}`;
      case 'Available':
        return `bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15 border-emerald-500/30 ${border}`;
      case 'Cleaning':
        return `bg-amber-500/10 text-amber-500 hover:bg-amber-500/15 border-amber-500/30 ${border}`;
      case 'Maintenance':
        return `bg-zinc-500/10 text-gray-500 hover:bg-zinc-500/15 border-zinc-500/30 ${border}`;
      default:
        return `bg-gray-100 text-gray-400 hover:bg-gray-200/50 ${border}`;
    }
  };

  const getBedStatusIcon = (status: Bed['status']) => {
    switch (status) {
      case 'Occupied':
        return BedIcon;
      case 'Available':
        return CheckCircle2;
      case 'Cleaning':
        return Brush;
      case 'Maintenance':
        return Hammer;
      default:
        return BedIcon;
    }
  };

  return (
    <div className="space-y-6">
      {/* Ward Selector Toolbar & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Selector */}
        <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col gap-2 h-fit">
          <h4 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Hospital Wards</h4>
          {wardStats.map((ward) => {
            const isSelected = selectedWard === ward.ward;
            return (
              <button
                key={ward.ward}
                onClick={() => {
                  setSelectedWard(ward.ward);
                  setSelectedBed(null);
                }}
                className={`p-3 rounded-xl border text-left cursor-pointer flex justify-between items-center transition-all ${
                  isSelected
                    ? 'bg-teal-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400 font-bold'
                    : 'bg-transparent border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold">{ward.ward} Ward</div>
                  <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                    {ward.occupied}/{ward.total} Beds occupied
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  ward.occupancyRate > 85 ? 'bg-rose-500/15 text-rose-500' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'
                }`}>
                  {ward.occupancyRate}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Ward Visual Dashboard stats */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Occupancy Rate</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{activeStats.occupancyRate}%</span>
              <span className="text-[10px] text-gray-400">of capacity</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  activeStats.occupancyRate > 85 ? 'bg-rose-500' : activeStats.occupancyRate > 50 ? 'bg-orange-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${activeStats.occupancyRate}%` }}
              />
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Available Beds</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-500">{activeStats.available}</span>
              <span className="text-xs text-gray-500">vacant</span>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Cleaning / Offline</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-500">{activeStats.cleaning}</span>
              <span className="text-xs text-gray-500">beds</span>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Average Admission Stay</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{activeStats.avgStay} days</span>
              <span className="text-xs text-gray-500">avg duration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bed Grid Visual Layout & Details popup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bed cells mapping */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm">
          <h4 className="font-bold text-gray-950 dark:text-white text-sm mb-4">
            {selectedWard} Ward — Bed Layout Twin
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {filteredBeds.map((bed) => {
              const Icon = getBedStatusIcon(bed.status);
              const isSelected = selectedBed?.id === bed.id;
              const cellStyle = getBedStatusBg(bed.status, isSelected);

              return (
                <button
                  key={bed.id}
                  onClick={() => setSelectedBed(bed)}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${cellStyle}`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-[10px] font-bold tracking-wider">{bed.number}</div>
                  <div className="text-[8px] opacity-75 font-semibold leading-none">{bed.status}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Bed Twin Details panel */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm flex flex-col justify-between gap-4 h-[350px] lg:h-auto">
          {selectedBed ? (
            <div className="flex flex-col h-full justify-between gap-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <BedIcon className="w-5 h-5 text-teal-500" />
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Bed {selectedBed.number}</h4>
                      <p className="text-[9px] text-gray-400">Ward location: {selectedBed.ward}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    selectedBed.status === 'Occupied' ? 'bg-rose-500/15 text-rose-500' : 'bg-emerald-500/15 text-emerald-500'
                  }`}>
                    {selectedBed.status}
                  </span>
                </div>

                {selectedBed.status === 'Occupied' ? (
                  <div className="space-y-3">
                    <div>
                      <div className="text-[9px] text-gray-400 uppercase font-bold">Occupant Patient</div>
                      <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-0.5">{selectedBed.patient}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[9px] text-gray-400 uppercase font-bold">Admission Date</div>
                        <div className="text-[10px] font-bold text-gray-600 dark:text-gray-300 mt-0.5">
                          {selectedBed.admissionDate ? formatDate(selectedBed.admissionDate) : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-gray-400 uppercase font-bold">Lead Clinician</div>
                        <div className="text-[10px] font-bold text-gray-600 dark:text-gray-300 mt-0.5">{selectedBed.doctor}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gray-400 uppercase font-bold">Predicted Discharge</div>
                      <div className="text-[10px] font-bold text-teal-600 dark:text-teal-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{selectedBed.predictedDischarge ? formatDate(selectedBed.predictedDischarge) : 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                ) : selectedBed.status === 'Available' ? (
                  <div className="space-y-3 border border-gray-100 dark:border-zinc-800/80 p-3 rounded-2xl bg-gray-50/50 dark:bg-zinc-950/20">
                    <h5 className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Assign Patient to Bed</h5>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[9px] text-gray-400 uppercase font-bold">Select Patient</label>
                        <select
                          value={selectedPatientName}
                          onChange={(e) => setSelectedPatientName(e.target.value)}
                          className="w-full text-xs p-1.5 rounded-lg border border-gray-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-800 dark:text-gray-200"
                        >
                          <option value="">-- Choose Patient --</option>
                          {patientsList.map(p => (
                            <option key={p.id} value={p.name}>{p.name} ({p.gender}, Age {p.age})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 uppercase font-bold">Lead Clinician</label>
                        <select
                          value={selectedDoctorName}
                          onChange={(e) => setSelectedDoctorName(e.target.value)}
                          className="w-full text-xs p-1.5 rounded-lg border border-gray-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-800 dark:text-gray-200"
                        >
                          <option value="">-- Choose Doctor --</option>
                          {doctorsList.map(d => (
                            <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 uppercase font-bold">Est. Stay Duration</label>
                        <select
                          value={assigningDays}
                          onChange={(e) => setAssigningDays(Number(e.target.value))}
                          className="w-full text-xs p-1.5 rounded-lg border border-gray-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-800 dark:text-gray-200"
                        >
                          <option value={2}>2 Days</option>
                          <option value={3}>3 Days</option>
                          <option value={5}>5 Days</option>
                          <option value={7}>7 Days</option>
                          <option value={10}>10 Days</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAssignPatient(selectedBed.id)}
                      disabled={!selectedPatientName || !selectedDoctorName}
                      className="w-full py-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/10 cursor-pointer mt-1"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Confirm Assignment</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400 dark:text-zinc-500">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-amber-500 opacity-60 animate-pulse" />
                    <p className="text-xs font-semibold">This bed is currently {selectedBed.status.toLowerCase()}.</p>
                    <p className="text-[10px] mt-1 text-gray-400">Needs to be sanitized and marked available before assignment.</p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-zinc-800/80">
                {selectedBed.status === 'Occupied' && (
                  <button
                    onClick={() => handleDischarge(selectedBed.id)}
                    className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Discharge Patient</span>
                  </button>
                )}

                {selectedBed.status === 'Cleaning' && (
                  <button
                    onClick={() => handleStatusChange(selectedBed.id, 'Available')}
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Sanitized (Available)</span>
                  </button>
                )}

                {selectedBed.status === 'Available' && (
                  <button
                    onClick={() => handleStatusChange(selectedBed.id, 'Maintenance')}
                    className="w-full py-2 bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-700 text-gray-200 font-bold rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 border border-zinc-700"
                  >
                    <Hammer className="w-4 h-4" />
                    <span>Schedule Maintenance</span>
                  </button>
                )}

                {selectedBed.status === 'Maintenance' && (
                  <button
                    onClick={() => handleStatusChange(selectedBed.id, 'Cleaning')}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10"
                  >
                    <Brush className="w-4 h-4" />
                    <span>Completed Maintenance (Clean Bed)</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 dark:text-zinc-500">
              <BedIcon className="w-10 h-10 mb-2 opacity-30 text-teal-500" />
              <h5 className="font-bold text-xs text-gray-700 dark:text-gray-300">No Bed Selected</h5>
              <p className="text-[10px] mt-1 max-w-xs">Select any bed cell in the layout twin map to inspect admission statistics or discharge logs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
