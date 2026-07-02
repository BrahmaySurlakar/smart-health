// ============================================================
// Arogya AI Command Center — Utility Functions
// ============================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN');
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function getRiskColor(score: number): string {
  if (score >= 80) return 'text-red-500';
  if (score >= 60) return 'text-orange-500';
  if (score >= 40) return 'text-yellow-500';
  return 'text-green-500';
}

export function getRiskBgColor(score: number): string {
  if (score >= 80) return 'bg-red-500/10 border-red-500/20';
  if (score >= 60) return 'bg-orange-500/10 border-orange-500/20';
  if (score >= 40) return 'bg-yellow-500/10 border-yellow-500/20';
  return 'bg-green-500/10 border-green-500/20';
}

export function getSeverityColor(severity: 'critical' | 'warning' | 'info'): string {
  switch (severity) {
    case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
    case 'warning': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
    case 'info': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'available':
    case 'active':
    case 'completed':
    case 'normal':
      return 'text-emerald-600 bg-emerald-500/10';
    case 'busy':
    case 'en route':
    case 'in progress':
    case 'in consultation':
      return 'text-blue-600 bg-blue-500/10';
    case 'on leave':
    case 'off duty':
    case 'maintenance':
    case 'cleaning':
      return 'text-amber-600 bg-amber-500/10';
    case 'occupied':
    case 'critical':
    case 'emergency':
      return 'text-red-600 bg-red-500/10';
    default:
      return 'text-gray-600 bg-gray-500/10';
  }
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateSparkline(length: number, min: number, max: number): number[] {
  const data: number[] = [];
  let current = randomBetween(min, max);
  for (let i = 0; i < length; i++) {
    current += randomBetween(-3, 3);
    current = Math.max(min, Math.min(max, current));
    data.push(current);
  }
  return data;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getDaysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function getDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}
