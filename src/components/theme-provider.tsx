'use client';
// ============================================================
// Arogya AI Command Center — Theme Provider
// ============================================================
import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme-store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  // Return a wrapper that sets standard text and background colors based on theme
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-black dark:text-gray-100 transition-colors duration-200 flex flex-col flex-1">
      {children}
    </div>
  );
}
