'use client';
// ============================================================
// Arogya AI Command Center — Settings Tab
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Save, Sparkles, Check, CheckCircle2, ShieldAlert,
  Bell, Eye, Sliders, Globe, AlertTriangle
} from 'lucide-react';

export default function SettingsTab() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings states
  const [facilityName, setFacilityName] = useState('PHC Varanasi');
  const [facilityType, setFacilityType] = useState('PHC');
  const [district, setDistrict] = useState('Varanasi');
  const [riskThreshold, setRiskThreshold] = useState(80);
  const [burnoutThreshold, setBurnoutThreshold] = useState(100);
  const [stockThreshold, setStockThreshold] = useState(30);

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    whatsapp: false,
    push: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-xs text-gray-800 dark:text-gray-200">
      
      {/* Visual Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card Section 1: Facility Profile */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm space-y-4">
          <h4 className="font-bold text-gray-950 dark:text-white text-xs flex items-center gap-1.5 border-b border-gray-100 dark:border-zinc-800/80 pb-2">
            <Globe className="w-4 h-4 text-teal-500" />
            Facility Profile Configuration
          </h4>

          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-gray-400">Facility Name</label>
              <input
                type="text"
                value={facilityName}
                onChange={e => setFacilityName(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500/50 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-400">Facility Type</label>
                <select
                  value={facilityType}
                  onChange={e => setFacilityType(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500/50 text-gray-900 dark:text-gray-100"
                >
                  <option value="PHC">PHC (Primary Health Center)</option>
                  <option value="CHC">CHC (Community Health Center)</option>
                  <option value="District">District Hospital</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-bold text-gray-400">Catchment District</label>
                <input
                  type="text"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:border-teal-500/50 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card Section 2: Alert Threshold limits */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm space-y-4">
          <h4 className="font-bold text-gray-950 dark:text-white text-xs flex items-center gap-1.5 border-b border-gray-100 dark:border-zinc-800/80 pb-2">
            <Sliders className="w-4 h-4 text-teal-500" />
            AI Analytical Thresholds
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-gray-800 dark:text-gray-200">Patient High-Risk Alert Limit</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Triggers notification when patient risk score exceeds value.</div>
              </div>
              <input
                type="number"
                value={riskThreshold}
                onChange={e => setRiskThreshold(Number(e.target.value))}
                className="w-16 px-2.5 py-1 text-center bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg focus:outline-none text-gray-900 dark:text-gray-100 font-bold"
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-gray-800 dark:text-gray-200">Doctor Burnout Patient Limit</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Alerts admins when physician exceeds daily OPD threshold.</div>
              </div>
              <input
                type="number"
                value={burnoutThreshold}
                onChange={e => setBurnoutThreshold(Number(e.target.value))}
                className="w-16 px-2.5 py-1 text-center bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg focus:outline-none text-gray-900 dark:text-gray-100 font-bold"
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-bold text-gray-800 dark:text-gray-200">Critical Stock Warning Period</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Calculates warnings when drug supply drops under target days.</div>
              </div>
              <input
                type="number"
                value={stockThreshold}
                onChange={e => setStockThreshold(Number(e.target.value))}
                className="w-16 px-2.5 py-1 text-center bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg focus:outline-none text-gray-900 dark:text-gray-100 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Card Section 3: Notification Channels */}
        <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-3xl shadow-sm space-y-4">
          <h4 className="font-bold text-gray-950 dark:text-white text-xs flex items-center gap-1.5 border-b border-gray-100 dark:border-zinc-800/80 pb-2">
            <Bell className="w-4 h-4 text-teal-500" />
            Communication Broadcast Channels
          </h4>

          <div className="space-y-3">
            {[
              { key: 'email', title: 'Email Alerts', desc: 'Send daily briefings to Medical Officer' },
              { key: 'sms', title: 'SMS Integration', desc: 'Broadcast immunisation notices to village guardians' },
              { key: 'whatsapp', title: 'WhatsApp Integration', desc: 'Sync alert channels with ASHA group chats' },
              { key: 'push', title: 'Command Center Push Notifications', desc: 'Display desktop alerts for critical events' },
            ].map(channel => (
              <label key={channel.key} className="flex justify-between items-center cursor-pointer select-none">
                <div>
                  <div className="font-bold text-gray-800 dark:text-gray-200">{channel.title}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{channel.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications[channel.key as keyof typeof notifications]}
                  onChange={() =>
                    setNotifications(prev => ({
                      ...prev,
                      [channel.key]: !prev[channel.key as keyof typeof notifications],
                    }))
                  }
                  className="w-4 h-4 accent-teal-500 cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Info Card Summary */}
        <div className="p-6 bg-gradient-to-r from-teal-500/[0.05] to-emerald-500/[0.05] border border-teal-500/10 rounded-3xl flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <h4 className="font-bold text-teal-800 dark:text-teal-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-500" />
              Settings Synced Real-Time
            </h4>
            <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed">
              Updates to thresholds are propagated immediately to the AI engine. Vitals risk indexing models and stock redistribution suggestions recalculate automatically.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-teal-500/10 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-emerald-500 font-bold flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-lg"
                >
                  <Check className="w-4 h-4" />
                  <span>Settings Saved</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </form>
  );
}
