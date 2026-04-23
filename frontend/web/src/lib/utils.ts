import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, decimals = 0): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatQuota(used: number, total: number): string {
  return `${formatNumber(used)} / ${formatNumber(total)} m³`;
}

export function getQuotaPercent(used: number, total: number): number {
  return Math.round((used / total) * 100);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'online': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'offline': return 'text-red-600 bg-red-50 border-red-200';
    case 'alert': return 'text-red-600 bg-red-50 border-red-200';
    case 'maintenance': return 'text-amber-600 bg-amber-50 border-amber-200';
    default: return 'text-slate-500 bg-slate-50 border-slate-200';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'online': return 'Online';
    case 'offline': return 'Offline';
    case 'alert': return 'Alert';
    case 'maintenance': return 'Maint';
    default: return status;
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'border-l-red-500';
    case 'warning': return 'border-l-amber-500';
    case 'info': return 'border-l-blue-400';
    default: return 'border-l-slate-300';
  }
}

export function getSeverityBadge(severity: string): string {
  switch (severity) {
    case 'critical': return 'bg-red-50 text-red-700 border border-red-200';
    case 'warning': return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'info': return 'bg-blue-50 text-blue-700 border border-blue-200';
    default: return 'bg-slate-50 text-slate-600 border border-slate-200';
  }
}

export function getSeverityLabel(severity: string): string {
  switch (severity) {
    case 'critical': return 'KRITIS';
    case 'warning': return 'WASPADA';
    case 'info': return 'INFO';
    default: return severity.toUpperCase();
  }
}

export function getSubsidenceColor(value: number): string {
  if (value <= -4.0) return 'text-red-600';
  if (value <= -2.5) return 'text-amber-600';
  return 'text-emerald-600';
}

export function getCurrentTime(): string {
  return new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

export function getCurrentDate(): string {
  return new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
}
