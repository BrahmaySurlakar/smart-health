'use client';
// ============================================================
// Arogya AI Command Center — Main Dashboard Shell
// ============================================================
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Stethoscope, Pill, ClipboardList, Activity,
  Users, UserCheck, ShieldCheck, HeartPulse, LogOut, Sun, Moon,
  Bell, AlertTriangle, Menu, X, ChevronLeft, ChevronRight,
  LayoutDashboard, Bed, Clock, Radio, Truck, FileBarChart2, Settings, AlertCircle, Check
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useThemeStore } from '@/stores/theme-store';
import { useNotificationStore } from '@/stores/notification-store';
import { UserRole, ROLE_LABELS, Alert } from '@/types';
import { getGreeting, getRelativeTime, getSeverityColor } from '@/lib/utils';
import { generateAlerts } from '@/data/generators';

// Import all Tab Components
import OverviewTab from './overview-tab';
import PatientsTab from './patients-tab';
import DoctorsTab from './doctors-tab';
import PharmacyTab from './pharmacy-tab';
import BedsTab from './beds-tab';
import QueueTab from './queue-tab';
import SurveillanceTab from './surveillance-tab';
import VaccinationTab from './vaccination-tab';
import AmbulanceTab from './ambulance-tab';
import ReportsTab from './reports-tab';
import SettingsTab from './settings-tab';
import AICopilot from '@/components/copilot/ai-copilot';

const NAV_ITEMS = [
  { id: 'Overview', label: 'Command Overview', icon: LayoutDashboard, component: OverviewTab },
  { id: 'Patients', label: 'Patient Registry', icon: Users, component: PatientsTab },
  { id: 'Doctors', label: 'Doctors & Staff', icon: Stethoscope, component: DoctorsTab },
  { id: 'Pharmacy', label: 'Dispensary Stock', icon: Pill, component: PharmacyTab },
  { id: 'Wards & Beds', label: 'Bed Wards Twin', icon: Bed, component: BedsTab },
  { id: 'Queue', label: 'Live OPD Queue', icon: Clock, component: QueueTab },
  { id: 'Surveillance', label: 'Catchment Twin', icon: Radio, component: SurveillanceTab },
  { id: 'Vaccinations', label: 'Vaccine Gaps', icon: ClipboardList, component: VaccinationTab },
  { id: 'Ambulances', label: 'Active Fleet', icon: Truck, component: AmbulanceTab },
  { id: 'Reports', label: 'Report Vault', icon: FileBarChart2, component: ReportsTab },
  { id: 'Settings', label: 'Alert Settings', icon: Settings, component: SettingsTab },
];

export default function DashboardShell() {
  const { user, logout, login } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const {
    notifications,
    unreadCount,
    setNotifications,
    markAsRead,
    markAllAsRead,
    sidebarCollapsed,
    toggleSidebar,
    copilotOpen,
    toggleCopilot
  } = useNotificationStore();

  const [activeTab, setActiveTab] = useState('Overview');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  // Initialize notifications from mock generator
  useEffect(() => {
    setNotifications(generateAlerts());
  }, [setNotifications]);

  const activeItem = NAV_ITEMS.find((item) => item.id === activeTab) || NAV_ITEMS[0];
  const ActiveComponent = activeItem.component;

  const handleRoleSwitch = (role: UserRole) => {
    login(role);
    setRoleSwitcherOpen(false);
  };

  const handleActionNotification = (id: string, alertText: string) => {
    markAsRead(id);
    alert(`AI Action Processed: ${alertText}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-black font-sans transition-colors duration-200">
      
      {/* Sidebar Navigation */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 240 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="hidden md:flex flex-col bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-900 shrink-0 h-full select-none"
      >
        {/* Sidebar Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-zinc-900">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shrink-0 shadow-md shadow-teal-500/10">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Arogya AI
              </span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-400 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/10 to-emerald-500/10 dark:from-teal-500/20 dark:to-emerald-500/10 text-teal-600 dark:text-teal-400 font-bold border border-teal-500/20'
                    : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-teal-600 dark:text-teal-400' : ''}`} />
                {!sidebarCollapsed && <span className="text-xs">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Logout */}
        <div className="p-3 border-t border-gray-100 dark:border-zinc-900">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left cursor-pointer hover:bg-rose-500/10 text-rose-500 transition-all font-semibold"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {!sidebarCollapsed && <span className="text-xs">Exit Command Center</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-900 z-50">
          <div className="flex items-center gap-3">
            {/* Hamburger button for mobile layouts */}
            <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-500">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-extrabold text-sm tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
                {activeItem.label}
              </h2>
              <p className="text-[10px] text-gray-400 font-medium">
                {getGreeting()}, {user?.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            
            {/* On-the-Fly Role Switcher Button */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-[10px] font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 cursor-pointer flex items-center gap-1.5"
              >
                <span>Role: {ROLE_LABELS[user?.role || 'doctor']}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              </button>
              
              <AnimatePresence>
                {roleSwitcherOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-xl p-1.5 z-[100] text-[10px]"
                  >
                    {(Object.keys(ROLE_LABELS) as UserRole[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => handleRoleSwitch(role)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-zinc-800 cursor-pointer ${
                          user?.role === role ? 'text-teal-600 dark:text-teal-400 font-bold bg-teal-500/5' : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {ROLE_LABELS[role]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center justify-center cursor-pointer text-gray-500 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Notification Bell with Badge dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserDropdown(false);
                }}
                className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center justify-center cursor-pointer text-gray-500 transition-colors relative"
              >
                <Bell className="w-4.5 h-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[8px] font-bold text-white flex items-center justify-center ring-2 ring-white dark:ring-zinc-950">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-2xl p-4 space-y-3 z-[100] text-xs text-gray-800 dark:text-gray-200"
                  >
                    <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-2">
                      <h4 className="font-extrabold text-xs text-gray-950 dark:text-white">Facility Alerts</h4>
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                      >
                        Read All
                      </button>
                    </div>

                    <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                      {notifications.map((alert) => {
                        const sevColor = getSeverityColor(alert.severity);
                        return (
                          <div
                            key={alert.id}
                            className={`p-3 rounded-xl border border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-950/20 flex flex-col gap-2 relative ${
                              !alert.isRead ? 'border-l-2 border-l-teal-500' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${sevColor}`}>
                                {alert.severity}
                              </span>
                              <span className="text-[8px] text-gray-400">{getRelativeTime(alert.timestamp)}</span>
                            </div>
                            <div>
                              <h5 className="font-bold text-[10px] text-gray-900 dark:text-white">{alert.title}</h5>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal mt-0.5">{alert.description}</p>
                            </div>
                            {alert.aiRecommendation && !alert.isRead && (
                              <button
                                onClick={() => handleActionNotification(alert.id, alert.aiRecommendation || '')}
                                className="w-fit py-1 px-2.5 rounded bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[9px] flex items-center gap-1 transition-colors cursor-pointer mt-1"
                              >
                                <Sparkles className="w-3 h-3 text-slate-950" />
                                <span>Resolve via AI recommendation</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Copilot toggle button */}
            <button
              onClick={toggleCopilot}
              className="h-8 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 hover:from-teal-400 hover:to-emerald-400 font-bold text-[10px] flex items-center gap-1.5 transition-all shadow-md shadow-teal-500/10 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950 stroke-none animate-pulse" />
              <span>AI Copilot</span>
            </button>

          </div>
        </header>

        {/* Main Dashboard Screen Viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-black/40">
          <ActiveComponent onTabChange={setActiveTab} />
        </main>
      </div>

      {/* AI Copilot Side Drawer panel component */}
      <AICopilot />
    </div>
  );
}
