'use client';
// ============================================================
// Arogya AI Command Center — Notification Store (Zustand)
// ============================================================
import { create } from 'zustand';
import { Alert } from '@/types';

interface NotificationState {
  notifications: Alert[];
  unreadCount: number;
  sidebarCollapsed: boolean;
  copilotOpen: boolean;
  setNotifications: (alerts: Alert[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleCopilot: () => void;
  setCopilotOpen: (open: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  sidebarCollapsed: false,
  copilotOpen: false,
  setNotifications: (alerts) => set({ notifications: alerts, unreadCount: alerts.filter(a => !a.isRead).length }),
  markAsRead: (id) => set((state) => {
    const updated = state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
    return { notifications: updated, unreadCount: updated.filter(a => !a.isRead).length };
  }),
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, isRead: true })),
    unreadCount: 0,
  })),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleCopilot: () => set((state) => ({ copilotOpen: !state.copilotOpen })),
  setCopilotOpen: (open) => set({ copilotOpen: open }),
}));
