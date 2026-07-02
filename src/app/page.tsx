'use client';

import { useAuthStore } from '@/stores/auth-store';
import LoginScreen from '@/components/auth/login-screen';
import DashboardShell from '@/components/dashboard/dashboard-shell';

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <DashboardShell />;
}
