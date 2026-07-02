'use client';
// ============================================================
// Arogya AI Command Center — Login Screen
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth-store';
import { UserRole, ROLE_LABELS } from '@/types';
import {
  Sparkles, Stethoscope, Pill, ClipboardList, Activity,
  Users, UserCheck, ShieldCheck, HeartPulse, ChevronRight, Fingerprint, ChevronLeft
} from 'lucide-react';

import { LucideIcon } from 'lucide-react';

const ROLE_ICONS: Record<UserRole, LucideIcon> = {
  medical_officer: ShieldCheck,
  doctor: Stethoscope,
  nurse: HeartPulse,
  pharmacist: Pill,
  lab_technician: Activity,
  anm: ClipboardList,
  asha_worker: Users,
  administrator: UserCheck,
};

const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  medical_officer: 'Manage facility operations, outbreaks, and logistics.',
  doctor: 'Conduct consultations, diagnose patients, and prescribe treatments.',
  nurse: 'Monitor patient vitals, manage ward status, and execute treatments.',
  pharmacist: 'Manage medicine inventory, dispense drugs, and coordinate stock transfers.',
  lab_technician: 'Analyze diagnostic lab samples and report clinical test results.',
  anm: 'Organize vaccination outreach and maternal-child health campaigns.',
  asha_worker: 'Conduct village community visits and report local health status.',
  administrator: 'Configure system settings, monitor security logs, and control thresholds.',
};

export default function LoginScreen({ onBack }: { onBack?: () => void }) {
  const login = useAuthStore((state) => state.login);
  const [selectedRole, setSelectedRole] = useState<UserRole>('medical_officer');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      login(selectedRole);
      setIsLoggingIn(false);
    }, 1000);
  };

  const ActiveIcon = ROLE_ICONS[selectedRole];

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 via-gray-950 to-black text-white p-4 relative overflow-hidden font-sans">
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 px-4 py-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer z-50 text-gray-300 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Website</span>
        </button>
      )}
      {/* Dynamic Background Accents */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-700" />
      
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      <div className="w-full max-w-5xl grid md:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side: Brand & Value Prop */}
        <div className="md:col-span-5 flex flex-col gap-6 text-center md:text-left pr-0 md:pr-6">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Sparkles className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">
                Arogya AI
              </h1>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-500/70">
                Command Center v2.0
              </p>
            </div>
          </div>

          <h2 className="text-4xl font-bold leading-tight">
            Smart intelligence for rural healthcare.
          </h2>

          <p className="text-gray-400 text-sm leading-relaxed max-w-md mx-auto md:mx-0">
            Connecting medical officers, clinicians, frontline workers, and community health centers through a real-time clinical twin and predictive surveillance system.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800/60 max-w-sm mx-auto md:mx-0">
            <div>
              <div className="text-xl font-bold text-teal-400">91%</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">OPD Accuracy</div>
            </div>
            <div>
              <div className="text-xl font-bold text-emerald-400">1.2s</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Sync Latency</div>
            </div>
            <div>
              <div className="text-xl font-bold text-teal-400">100%</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Uptime SLA</div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Interactive Container */}
        <div className="md:col-span-7 bg-gray-900/60 border border-gray-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 relative">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold">Select Duty Role</h3>
            <p className="text-gray-400 text-sm">Choose your official capacity to initialize your session.</p>
          </div>

          {/* Grid of Roles */}
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(ROLE_ICONS) as UserRole[]).map((role) => {
              const Icon = ROLE_ICONS[role];
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-br from-teal-500/20 to-emerald-500/10 border-teal-500/50 shadow-lg shadow-teal-500/5'
                      : 'bg-gray-950/40 border-gray-800/40 hover:bg-gray-800/20 hover:border-gray-800'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-teal-500 text-slate-950' : 'bg-gray-900 text-gray-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-semibold ${isSelected ? 'text-teal-400' : 'text-gray-300'}`}>
                      {ROLE_LABELS[role]}
                    </h4>
                    <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{ROLE_DESCRIPTIONS[role]}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Role Preview Summary */}
          <div className="bg-gray-950/60 border border-gray-800/40 rounded-2xl p-4 flex gap-4 items-center">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0 text-teal-400">
              <ActiveIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-300">Active Permissions: {ROLE_LABELS[selectedRole]}</div>
              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{ROLE_DESCRIPTIONS[selectedRole]}</p>
            </div>
          </div>

          {/* Login Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold transition-all duration-300 shadow-xl shadow-teal-500/10 hover:shadow-teal-400/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Access Command Center</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-gray-500 px-1 mt-1">
              <span>Secure connection established</span>
              <button 
                onClick={() => setShowBiometric(!showBiometric)}
                className="hover:text-teal-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Simulate Biometrics</span>
              </button>
            </div>
          </div>

          {/* Mock Biometric Modal */}
          {showBiometric && (
            <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center gap-4 p-8 z-20">
              <div className="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 animate-pulse border border-teal-500/30">
                <Fingerprint className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h4 className="font-bold text-sm text-gray-200">Scanning Biometric Credentials</h4>
                <p className="text-xs text-gray-500 mt-1">Verify touch ID to authenticate role permissions.</p>
              </div>
              <button
                onClick={() => {
                  setShowBiometric(false);
                  login(selectedRole);
                }}
                className="py-1.5 px-4 rounded-lg bg-teal-500 text-slate-950 text-xs font-bold hover:bg-teal-400 transition-colors cursor-pointer"
              >
                Authorize Fingerprint
              </button>
              <button
                onClick={() => setShowBiometric(false)}
                className="text-xs text-gray-500 hover:text-gray-400 underline cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
