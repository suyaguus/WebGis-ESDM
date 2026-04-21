/**
 * ALERT SERVICE
 *
 * Endpoint yang dibutuhkan backend:
 *   GET    /alerts               → Alert[]   (filter: severity, isRead, companyId, startDate, endDate)
 *   GET    /alerts/unread-count  → { count: number }
 *   PUT    /alerts/:id/read      → Alert
 *   PUT    /alerts/read-all      → { success: true }
 */
import api from '@/lib/api';
import { MOCK_ALERTS } from '@/constants/mockData';
import type { Alert } from '@/types';
import type { AlertFilter } from '@/types/api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const mockDelay = () => new Promise(r => setTimeout(r, 300));

export const alertService = {
  getAll: async (filter?: AlertFilter): Promise<Alert[]> => {
    if (USE_MOCK) {
      await mockDelay();
      let result = [...MOCK_ALERTS];
      if (filter?.severity !== undefined) result = result.filter(a => a.severity  === filter.severity);
      if (filter?.isRead    !== undefined) result = result.filter(a => a.isRead    === filter.isRead);
      if (filter?.companyId)               result = result.filter(a => a.companyName && a.companyName.includes(filter.companyId!));
      return result;
    }
    const { data } = await api.get<Alert[]>('/alerts', { params: filter });
    return data;
  },

  getUnreadCount: async (): Promise<number> => {
    if (USE_MOCK) return MOCK_ALERTS.filter(a => !a.isRead).length;
    const { data } = await api.get<{ count: number }>('/alerts/unread-count');
    return data.count;
  },

  markAsRead: async (id: string): Promise<Alert> => {
    if (USE_MOCK) {
      await mockDelay();
      const alert = MOCK_ALERTS.find(a => a.id === id);
      if (!alert) throw new Error('Alert tidak ditemukan');
      return { ...alert, isRead: true };
    }
    const { data } = await api.put<Alert>(`/alerts/${id}/read`);
    return data;
  },

  markAllAsRead: async (): Promise<void> => {
    if (USE_MOCK) { await mockDelay(); return; }
    await api.put('/alerts/read-all');
  },
};
