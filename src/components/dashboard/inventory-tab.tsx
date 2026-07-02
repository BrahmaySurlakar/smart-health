'use client';
import { useState, useMemo } from 'react';
import {
  Package, FileText, Activity, TrendingDown, TrendingUp, X,
  AlertTriangle, CheckCircle2, Truck, RefreshCw, Send,
  ChevronLeft, ChevronRight, ShieldCheck, Sparkles,
  ArrowRight, Download, Printer, Info
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, Cell, Legend
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────
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
  batchNo: string;
  supplier: string;
  lastRestocked: string;
  location: string;
  minReorderLevel: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const MEDICINES: MedicineItem[] = [
  {
    id: '1', name: 'ORS Packets', sku: '#ORS-2024-XP', category: 'Essential',
    onHand: 1240, unit: 'pkts', percentage: 85, usagePerDay: 180, trend: 'down',
    shelfLife: 'Oct 2025', aiPrediction: 'Surplus likely', status: 'in-stock',
    batchNo: 'B-ORS-0891', supplier: 'MedLife Pharma Ltd', lastRestocked: '18 Jun 2025',
    location: 'Rack A2, Store 1', minReorderLevel: 400,
  },
  {
    id: '2', name: 'Amoxicillin 250mg', sku: '#AMX-SYP-02', category: 'Antibiotic',
    onHand: 42, unit: 'vials', percentage: 12, usagePerDay: 8, trend: 'surge',
    shelfLife: '14 Days left', aiPrediction: 'Stockout Warning', status: 'critical',
    batchNo: 'B-AMX-0234', supplier: 'CureMax Healthcare', lastRestocked: '2 May 2025',
    location: 'Cold Storage B1', minReorderLevel: 200,
  },
  {
    id: '3', name: 'Covaxin Vial (5ml)', sku: '#CVX-009-MH', category: 'Vaccine',
    onHand: 85, unit: 'units', percentage: 42, usagePerDay: 12, trend: 'stable',
    shelfLife: 'Jan 2026', aiPrediction: 'Scheduled Restock', status: 'low',
    batchNo: 'B-CVX-1102', supplier: 'Bharat Biotech', lastRestocked: '10 Jun 2025',
    location: 'Cold Storage A3', minReorderLevel: 100,
  },
  {
    id: '4', name: 'Paracetamol 500mg', sku: '#PCM-500-GP', category: 'Analgesic',
    onHand: 420, unit: 'tabs', percentage: 24, usagePerDay: 110, trend: 'surge',
    shelfLife: 'Aug 2025', aiPrediction: 'Depletion Alert', status: 'critical',
    batchNo: 'B-PCM-0567', supplier: 'GenPharma India', lastRestocked: '25 May 2025',
    location: 'Rack C1, Store 2', minReorderLevel: 1000,
  },
  {
    id: '5', name: 'Azithromycin 500mg', sku: '#AZI-500-XP', category: 'Antibiotic',
    onHand: 600, unit: 'tabs', percentage: 75, usagePerDay: 34, trend: 'stable',
    shelfLife: 'Nov 2025', aiPrediction: 'Optimal Stock', status: 'in-stock',
    batchNo: 'B-AZI-0445', supplier: 'MedLife Pharma Ltd', lastRestocked: '5 Jun 2025',
    location: 'Rack B3, Store 1', minReorderLevel: 200,
  },
  {
    id: '6', name: 'Metformin 500mg', sku: '#MET-500-DM', category: 'Antidiabetic',
    onHand: 320, unit: 'tabs', percentage: 55, usagePerDay: 22, trend: 'stable',
    shelfLife: 'Mar 2026', aiPrediction: 'Optimal Stock', status: 'in-stock',
    batchNo: 'B-MET-0312', supplier: 'SunPharma', lastRestocked: '12 Jun 2025',
    location: 'Rack D2, Store 2', minReorderLevel: 150,
  },
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
    progress: 30, remaining: null, statusColor: 'orange',
  },
  {
    id: 'tr441', batch: 'Batch #TR-441 - Delivered', status: 'DELIVERED',
    desc: 'General antibiotics and gauze. Received by Dr. Mehra yesterday.',
    progress: 100, remaining: null, statusColor: 'gray',
  },
];

const FACILITIES = [
  { id: 'phc-rampur', name: 'PHC Rampur (Main)' },
  { id: 'phc-shajahanpur', name: 'PHC Shajahanpur' },
  { id: 'chc-district', name: 'CHC District Center' },
  { id: 'sub-center-1', name: 'Sub-center Lalpur' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function statusColor(s: MedicineItem['status']) {
  return s === 'critical' ? 'bg-red-500' : s === 'low' ? 'bg-amber-500' : 'bg-emerald-500';
}
function badgeColor(s: MedicineItem['status']) {
  return s === 'critical'
    ? 'bg-red-500/10 text-red-500'
    : s === 'low'
    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800 sticky top-0 bg-white dark:bg-zinc-900 z-10">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Batch Detail Modal ───────────────────────────────────────────────────────
function BatchModal({ med, onClose }: { med: MedicineItem; onClose: () => void }) {
  const daysLeft = Math.floor(med.onHand / med.usagePerDay);
  return (
    <Modal title={`Batch Details — ${med.name}`} onClose={onClose}>
      <div className="space-y-5">
        {/* Status pill */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${badgeColor(med.status)}`}>
          <span className={`w-2 h-2 rounded-full ${statusColor(med.status)}`} />
          {med.status === 'critical' ? 'Critical Stock' : med.status === 'low' ? 'Low Stock' : 'In Stock'}
        </div>

        {/* Key stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Batch No.', value: med.batchNo },
            { label: 'SKU', value: med.sku },
            { label: 'Supplier', value: med.supplier },
            { label: 'Category', value: med.category },
            { label: 'On Hand', value: `${med.onHand.toLocaleString()} ${med.unit}` },
            { label: 'Daily Usage', value: `${med.usagePerDay} ${med.unit}/day` },
            { label: 'Days Remaining', value: `${daysLeft} days`, highlight: daysLeft < 7 ? 'text-red-500' : daysLeft < 14 ? 'text-amber-500' : '' },
            { label: 'Stock Level', value: `${med.percentage}%`, highlight: med.percentage < 20 ? 'text-red-500' : med.percentage < 50 ? 'text-amber-500' : 'text-emerald-500' },
            { label: 'Shelf Life', value: med.shelfLife, highlight: med.status === 'critical' ? 'text-red-500 font-bold' : '' },
            { label: 'Storage Location', value: med.location },
            { label: 'Last Restocked', value: med.lastRestocked },
            { label: 'Min. Reorder Level', value: `${med.minReorderLevel} ${med.unit}` },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="bg-gray-50 dark:bg-zinc-950 rounded-xl p-3">
              <p className="text-[9px] font-bold uppercase text-gray-400 mb-0.5">{label}</p>
              <p className={`text-xs font-bold text-gray-900 dark:text-white ${highlight ?? ''}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Stock bar */}
        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Stock Level</span>
            <span className="text-[10px] font-bold text-gray-500">{med.percentage}% of capacity</span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${statusColor(med.status)}`} style={{ width: `${med.percentage}%` }} />
          </div>
        </div>

        {/* AI prediction */}
        <div className="flex gap-3 p-3 bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 rounded-xl">
          <Sparkles className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase mb-0.5">AI Prediction</p>
            <p className="text-xs text-gray-600 dark:text-gray-300">{med.aiPrediction}</p>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
            Close
          </button>
          <button className="flex-1 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5">
            <Printer className="w-3.5 h-3.5" /> Print Batch Report
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Emergency Order Modal ────────────────────────────────────────────────────
function EmergencyOrderModal({ med, onClose }: { med: MedicineItem; onClose: () => void }) {
  const [qty, setQty] = useState(med.minReorderLevel);
  const [priority, setPriority] = useState<'urgent' | 'critical' | 'normal'>('critical');
  const [supplier, setSupplier] = useState(med.supplier);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  const handleSubmit = () => {
    setOrderRef(`EMG-${String(Date.now()).slice(-6)}`);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Modal title="Emergency Order Placed" onClose={onClose}>
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg">Order Confirmed!</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Emergency order for <strong>{qty} {med.unit}</strong> of <strong>{med.name}</strong> has been placed with <strong>{supplier}</strong>.
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-zinc-950 rounded-xl p-4 text-left space-y-2">
            {[
              ['Order Ref', orderRef],
              ['Medicine', med.name],
              ['Quantity', `${qty} ${med.unit}`],
              ['Priority', priority.toUpperCase()],
              ['Supplier', supplier],
              ['ETA', priority === 'critical' ? '2–4 hours' : '24 hours'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase">{k}</span>
                <span className="text-[10px] text-gray-900 dark:text-white font-bold">{v}</span>
              </div>
            ))}
          </div>
          <button onClick={onClose} className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer">
            Done
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={`Emergency Order — ${med.name}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 dark:text-red-300">
            Current stock of <strong>{med.onHand} {med.unit}</strong> is at <strong>{med.percentage}%</strong> capacity. Minimum reorder level is <strong>{med.minReorderLevel} {med.unit}</strong>.
          </p>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Order Priority</label>
          <div className="grid grid-cols-3 gap-2">
            {(['normal', 'urgent', 'critical'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`py-2 rounded-xl text-[10px] font-bold uppercase border transition-all cursor-pointer ${
                  priority === p
                    ? p === 'critical' ? 'bg-red-500 border-red-500 text-white'
                      : p === 'urgent' ? 'bg-amber-500 border-amber-500 text-white'
                      : 'bg-teal-500 border-teal-500 text-white'
                    : 'bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-500'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
            Order Quantity ({med.unit})
          </label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors"
          />
          <p className="text-[9px] text-gray-400 mt-1">Suggested: {med.minReorderLevel} {med.unit} (min. reorder level)</p>
        </div>

        {/* Supplier */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Supplier</label>
          <select
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500 transition-colors cursor-pointer"
          >
            {[med.supplier, 'MedLife Pharma Ltd', 'CureMax Healthcare', 'GenPharma India', 'SunPharma', 'Bharat Biotech'].filter((v, i, a) => a.indexOf(v) === i).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. Deliver to Cold Storage B1, contact Dr. Sharma on arrival"
            className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-teal-500 resize-none transition-colors"
          />
        </div>

        {/* ETA */}
        <div className="flex gap-3 p-3 bg-gray-50 dark:bg-zinc-950 rounded-xl">
          <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-gray-500">
            Estimated delivery: <strong className="text-gray-900 dark:text-white">{priority === 'critical' ? '2–4 hours' : priority === 'urgent' ? '12 hours' : '24–48 hours'}</strong>
          </p>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 bg-red-500 hover:bg-red-400 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5">
            <Send className="w-3.5 h-3.5" /> Place Emergency Order
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Redistribution Modal ─────────────────────────────────────────────────────
function RedistributionModal({ onClose }: { onClose: () => void }) {
  const [from, setFrom] = useState(FACILITIES[1].id);
  const [to, setTo] = useState(FACILITIES[0].id);
  const [medicine, setMedicine] = useState(MEDICINES[0].id);
  const [qty, setQty] = useState(100);
  const [submitted, setSubmitted] = useState(false);

  const selectedMed = MEDICINES.find((m) => m.id === medicine)!;
  const fromFacility = FACILITIES.find((f) => f.id === from)!;
  const toFacility = FACILITIES.find((f) => f.id === to)!;

  if (submitted) {
    return (
      <Modal title="Redistribution Initiated" onClose={onClose}>
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto">
            <Truck className="w-8 h-8 text-teal-500" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-lg">Redistribution Scheduled!</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Transfer of <strong>{qty} {selectedMed.unit}</strong> of <strong>{selectedMed.name}</strong> from <strong>{fromFacility.name}</strong> to <strong>{toFacility.name}</strong> has been initiated.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 py-3 bg-gray-50 dark:bg-zinc-950 rounded-xl">
            <div className="text-center">
              <p className="text-[9px] text-gray-400 uppercase font-bold">From</p>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{fromFacility.name}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-teal-500" />
            <div className="text-center">
              <p className="text-[9px] text-gray-400 uppercase font-bold">To</p>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{toFacility.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">Done</button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Initiate Stock Redistribution" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">Transfer surplus stock from one facility to another based on AI demand signals.</p>

        {/* Medicine */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Select Medicine</label>
          <select value={medicine} onChange={(e) => setMedicine(e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-teal-500 cursor-pointer">
            {MEDICINES.map((m) => (
              <option key={m.id} value={m.id}>{m.name} ({m.onHand} {m.unit} on hand)</option>
            ))}
          </select>
        </div>

        {/* From / To */}
        <div className="grid grid-cols-5 gap-2 items-center">
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">From Facility</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-teal-500 cursor-pointer">
              {FACILITIES.filter((f) => f.id !== to).map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-center pt-5">
            <ArrowRight className="w-5 h-5 text-teal-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">To Facility</label>
            <select value={to} onChange={(e) => setTo(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-teal-500 cursor-pointer">
              {FACILITIES.filter((f) => f.id !== from).map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">Transfer Quantity ({selectedMed.unit})</label>
          <input type="number" min={1} max={selectedMed.onHand} value={qty} onChange={(e) => setQty(Number(e.target.value))}
            className="w-full bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-teal-500" />
          <p className="text-[9px] text-gray-400 mt-1">Available at source: {selectedMed.onHand} {selectedMed.unit}</p>
        </div>

        {/* AI Suggestion */}
        <div className="flex gap-3 p-3 bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 rounded-xl">
          <Sparkles className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-teal-700 dark:text-teal-300">
            <strong>AI Recommendation:</strong> PHC Shajahanpur has 300% ORS surplus. Transferring 40 cases to Rampur addresses the 15% shortfall and prevents expiry waste.
          </p>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer">Cancel</button>
          <button onClick={() => setSubmitted(true)} className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> Confirm Transfer
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Audit Report Modal ───────────────────────────────────────────────────────
function AuditReportModal({ onClose }: { onClose: () => void }) {
  const [exported, setExported] = useState(false);
  const now = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const criticalMeds = MEDICINES.filter((m) => m.status === 'critical');
  const lowMeds = MEDICINES.filter((m) => m.status === 'low');
  const okMeds = MEDICINES.filter((m) => m.status === 'in-stock');

  return (
    <Modal title="Full Stock Audit Report" onClose={onClose}>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">PHC Rampur Network</p>
            <p className="text-[10px] text-gray-400">Generated: {now}</p>
          </div>
          <button
            onClick={() => setExported(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
              exported ? 'bg-emerald-500/10 text-emerald-600' : 'bg-teal-500 text-slate-950 hover:bg-teal-400'
            }`}
          >
            <Download className="w-3 h-3" />
            {exported ? 'Exported!' : 'Export CSV'}
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Critical', count: criticalMeds.length, color: 'text-red-500', bg: 'bg-red-500/10' },
            { label: 'Low Stock', count: lowMeds.length, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'In Stock', count: okMeds.length, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
              <p className={`text-2xl font-bold ${color}`}>{count}</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Full Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-zinc-800">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800">
              <tr>
                {['Medicine', 'Batch', 'Stock', 'Level', 'Shelf Life', 'Status'].map((h) => (
                  <th key={h} className="px-3 py-2.5 text-[9px] font-bold uppercase text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
              {MEDICINES.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-3 py-2.5">
                    <p className="text-[10px] font-bold text-gray-900 dark:text-white">{m.name}</p>
                    <p className="text-[8px] font-mono text-gray-400">{m.sku}</p>
                  </td>
                  <td className="px-3 py-2.5 text-[9px] text-gray-500 font-mono">{m.batchNo}</td>
                  <td className="px-3 py-2.5 text-[10px] font-bold text-gray-900 dark:text-white">{m.onHand} {m.unit}</td>
                  <td className="px-3 py-2.5">
                    <div className="w-16 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${statusColor(m.status)}`} style={{ width: `${m.percentage}%` }} />
                    </div>
                    <span className="text-[8px] text-gray-400">{m.percentage}%</span>
                  </td>
                  <td className={`px-3 py-2.5 text-[9px] font-medium ${m.status === 'critical' ? 'text-red-500 font-bold' : 'text-gray-500'}`}>{m.shelfLife}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase ${badgeColor(m.status)}`}>
                      {m.status === 'in-stock' ? 'OK' : m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={onClose} className="w-full py-2.5 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer">
          Close Report
        </button>
      </div>
    </Modal>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function InventoryTab() {
  const [query, setQuery] = useState('');
  const [aiAccepted, setAiAccepted] = useState(false);

  // Modal state
  const [batchModal, setBatchModal] = useState<MedicineItem | null>(null);
  const [emergencyModal, setEmergencyModal] = useState<MedicineItem | null>(null);
  const [showRedistribution, setShowRedistribution] = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  // Dynamic forecast chart: derived from actual MEDICINES data
  // Project each medicine's weekly demand = usagePerDay * 7, with surge weeks doubled
  const forecastData = useMemo(() => {
    return ['WK 1', 'WK 2 (Forecast)', 'WK 3', 'WK 4'].map((week, i) => {
      const multiplier = i === 1 ? 1.4 : i === 2 ? 2.1 : i === 3 ? 1.2 : 1.0;
      const entry: Record<string, number | string> = { week };
      MEDICINES.forEach((m) => {
        entry[m.name.split(' ')[0]] = Math.round(m.usagePerDay * 7 * multiplier);
      });
      entry['isSurge'] = i === 1 ? 1 : 0;
      return entry;
    });
  }, []);

  // Simple aggregate bar data from medicine onHand values
  const stockChartData = useMemo(() =>
    MEDICINES.map((m) => ({
      name: m.name.split(' ')[0],
      stock: m.onHand,
      demand: m.usagePerDay * 30,
      isCritical: m.status === 'critical',
    })), []);

  const filtered = MEDICINES.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.sku.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Modals */}
      {batchModal && <BatchModal med={batchModal} onClose={() => setBatchModal(null)} />}
      {emergencyModal && <EmergencyOrderModal med={emergencyModal} onClose={() => setEmergencyModal(null)} />}
      {showRedistribution && <RedistributionModal onClose={() => setShowRedistribution(false)} />}
      {showAudit && <AuditReportModal onClose={() => setShowAudit(false)} />}

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
          <button
            onClick={() => setShowRedistribution(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-teal-500/20 cursor-pointer"
          >
            <Truck className="w-3.5 h-3.5" />
            Initiate Redistribution
          </button>
          <button
            onClick={() => setShowAudit(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-xs hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
          >
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
            Unusually high demand in 3 satellite clinics due to Dengue cluster. Projected deficit: 1,400 units by Friday.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Current Stock', value: '420', unit: 'units', color: 'text-gray-900 dark:text-white' },
              { label: 'Usage Rate', value: '+142%', unit: 'vs avg', color: 'text-red-500' },
              { label: 'In Transit', value: '800', unit: 'ETA 4h', color: 'text-teal-500' },
            ].map((s) => (
              <div key={s.label} className="bg-gray-50 dark:bg-zinc-950 rounded-xl p-3 border border-gray-100 dark:border-zinc-800">
                <p className="text-[9px] font-bold uppercase text-gray-400 mb-1">{s.label}</p>
                <p className={`text-lg font-bold ${s.color}`}>
                  {s.value} <span className="text-[10px] font-normal opacity-70">{s.unit}</span>
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl">
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
              <button
                onClick={() => setEmergencyModal(MEDICINES.find((m) => m.id === '4')!)}
                className="mt-2 text-[10px] font-bold text-red-500 hover:text-red-400 underline cursor-pointer"
              >
                Place Emergency Order →
              </button>
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
            <div className="bg-white/10 rounded-xl p-3 border border-white/15">
              <p className="text-[9px] font-black uppercase text-teal-200 tracking-wider mb-1">Path Optimization</p>
              <p className="text-[11px] leading-relaxed opacity-90">
                PHC Shajahanpur has <strong>300% surplus</strong> of ORS. Transferring 40 cases to Rampur avoids waste & covers 15% shortfall.
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 border border-white/15">
              <p className="text-[9px] font-black uppercase text-teal-200 tracking-wider mb-1">Expiry Forecast</p>
              <p className="text-[11px] leading-relaxed opacity-90">
                240 Amoxicillin units expiring in{' '}
                <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">14 DAYS</span>.
                Priority dispatch recommended.
              </p>
            </div>
          </div>
          <button
            onClick={() => { setAiAccepted(true); setShowRedistribution(true); }}
            className={`mt-4 w-full py-2.5 font-bold rounded-xl text-xs transition-all cursor-pointer ${
              aiAccepted ? 'bg-white/20 text-white cursor-default' : 'bg-white text-teal-700 hover:bg-teal-50'
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
              className="bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs w-44 focus:outline-none focus:border-teal-500 text-gray-800 dark:text-zinc-200"
            />
            <div className="hidden sm:flex gap-2">
              {[{ l: 'In Stock', c: 'bg-emerald-500' }, { l: 'Low', c: 'bg-amber-500' }, { l: 'Critical', c: 'bg-red-500' }].map((s) => (
                <span key={s.l} className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400">
                  <span className={`w-2 h-2 rounded-full ${s.c}`} /> {s.l}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-950/60 border-b border-gray-100 dark:border-zinc-800">
                {['Medicine / SKU', 'Category', 'On Hand', 'Usage/day', 'Shelf Life', 'AI Prediction', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">{h}</th>
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
                    <div className="w-20 h-1.5 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden mt-1.5">
                      <div className={`h-full rounded-full ${statusColor(med.status)}`} style={{ width: `${med.percentage}%` }} />
                    </div>
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
                    {med.status === 'critical' ? (
                      <button
                        onClick={() => setEmergencyModal(med)}
                        className="text-red-500 hover:text-red-400 font-bold text-[10px] uppercase tracking-tight cursor-pointer flex items-center gap-0.5"
                      >
                        <AlertTriangle className="w-2.5 h-2.5" /> Emergency Order
                      </button>
                    ) : (
                      <button
                        onClick={() => setBatchModal(med)}
                        className="text-teal-500 hover:text-teal-400 font-bold text-[10px] uppercase tracking-tight cursor-pointer"
                      >
                        View Batch
                      </button>
                    )}
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
            <button className="p-1 border border-gray-200 dark:border-zinc-800 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer">
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
        {/* Demand Forecast Chart (driven by MEDICINES data) */}
        <div className="col-span-12 lg:col-span-7 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">Inventory Demand Forecast</h4>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">30-Day AI Projection · Stock vs Projected Monthly Demand</p>
            </div>
          </div>

          {/* Stock vs 30-day demand bar chart */}
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className="dark:stroke-zinc-800/60" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                  cursor={{ fill: 'rgba(20,184,166,0.05)' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '8px' }} />
                <Bar dataKey="stock" name="Current Stock" radius={[4, 4, 0, 0]} fill="#14b8a6" />
                <Bar dataKey="demand" name="30-Day Demand" radius={[4, 4, 0, 0]}>
                  {stockChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.isCritical ? '#ef4444' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-4 mt-2 text-[9px] font-bold text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-teal-500 inline-block" /> Current Stock</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-amber-500 inline-block" /> Monthly Demand</span>
            <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-red-500 inline-block" /> Critical Item Demand</span>
            <span className="ml-auto text-gray-300">Bars where demand &gt; stock = reorder needed</span>
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
                    {isDelivered ? <CheckCircle2 className="w-4 h-4 text-gray-400" />
                      : item.status === 'PACKING' ? <Package className="w-4 h-4 text-amber-500" />
                      : <Truck className="w-4 h-4 text-teal-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <p className="font-bold text-xs text-gray-900 dark:text-white truncate">{item.batch}</p>
                      <span className={`shrink-0 text-[8px] font-black px-2 py-0.5 rounded uppercase ${
                        item.statusColor === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : item.statusColor === 'orange' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'
                      }`}>{item.status}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed">{item.desc}</p>
                    {item.progress !== null && item.status !== 'DELIVERED' && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex-1 h-1 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${item.progress}%` }} />
                        </div>
                        {item.remaining && <span className="text-[8px] font-bold text-gray-400 shrink-0">{item.remaining}</span>}
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
          { Icon: Activity, label: 'Predict Problems', sub: 'Before they happen' },
          { Icon: RefreshCw, label: 'Optimize Resources', sub: 'Reduce waste' },
          { Icon: ShieldCheck, label: 'Improve Outcomes', sub: 'Better patient care' },
          { Icon: Sparkles, label: 'Powered by AI', sub: 'Backed by data' },
        ].map(({ Icon, label, sub }) => (
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
