import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSubsidence(val: number, decimals = 2): string {
  return `${val.toFixed(decimals)} cm/thn`
}

export function getLiveTime(): string {
  return new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit',
  }) + ' WIB'
}

export function getLiveDate(): string {
  return new Date().toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).toUpperCase()
}
