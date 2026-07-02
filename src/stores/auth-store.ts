'use client';
// ============================================================
// Arogya AI Command Center — Auth Store (Zustand)
// ============================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const DEMO_USERS: Record<UserRole, User> = {
  medical_officer: { id: 'U001', name: 'Dr. Rajendra Sharma', email: 'dr.sharma@phc.gov.in', role: 'medical_officer', department: 'Administration', phone: '+91 98765 43210' },
  doctor: { id: 'U002', name: 'Dr. Priya Patel', email: 'dr.patel@phc.gov.in', role: 'doctor', department: 'General Medicine', phone: '+91 98765 43211' },
  nurse: { id: 'U003', name: 'Sunita Verma', email: 'sunita.v@phc.gov.in', role: 'nurse', department: 'Nursing', phone: '+91 98765 43212' },
  pharmacist: { id: 'U004', name: 'Amit Kumar', email: 'amit.k@phc.gov.in', role: 'pharmacist', department: 'Pharmacy', phone: '+91 98765 43213' },
  lab_technician: { id: 'U005', name: 'Deepak Mishra', email: 'deepak.m@phc.gov.in', role: 'lab_technician', department: 'Laboratory', phone: '+91 98765 43214' },
  anm: { id: 'U006', name: 'Kavita Singh', email: 'kavita.s@phc.gov.in', role: 'anm', department: 'MCH', phone: '+91 98765 43215' },
  asha_worker: { id: 'U007', name: 'Meena Devi', email: 'meena.d@phc.gov.in', role: 'asha_worker', department: 'Community Health', phone: '+91 98765 43216' },
  administrator: { id: 'U008', name: 'Vikram Gupta', email: 'vikram.g@phc.gov.in', role: 'administrator', department: 'Administration', phone: '+91 98765 43217' },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (role: UserRole) => {
        set({ user: DEMO_USERS[role], isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    { name: 'arogya-auth' }
  )
);
