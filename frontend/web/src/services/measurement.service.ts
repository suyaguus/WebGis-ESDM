/**
 * MEASUREMENT SERVICE
 *
 * Endpoint yang dibutuhkan backend:
 *   GET    /measurements                → Measurement[]  (filter: companyId, status, startDate, endDate)
 *   GET    /measurements/:id            → Measurement
 *   POST   /measurements                → Measurement    (supervisor only)
 *   PUT    /measurements/:id/verify     → Measurement    (admin perusahaan only)
 *   PUT    /measurements/:id/reject     → Measurement    (admin perusahaan only)
 */
import api from '@/lib/api';
import { COMPANY_MEASUREMENTS } from '@/constants/mockData';
import type { Measurement } from '@/constants/mockData';
import type { CreateMeasurementRequest, VerifyMeasurementRequest } from '@/types/api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const mockDelay = () => new Promise(r => setTimeout(r, 300));

export interface MeasurementFilter {
  companyId?: string;
  status?:    'pending' | 'verified' | 'rejected' | 'draft';
  startDate?: string;
  endDate?:   string;
}

export const measurementService = {
  getAll: async (filter?: MeasurementFilter): Promise<Measurement[]> => {
    if (USE_MOCK) {
      await mockDelay();
      let result = [...COMPANY_MEASUREMENTS];
      if (filter?.status) result = result.filter(m => m.status === filter.status);
      return result;
    }
    const { data } = await api.get<Measurement[]>('/measurements', { params: filter });
    return data;
  },

  getById: async (id: string): Promise<Measurement> => {
    if (USE_MOCK) {
      await mockDelay();
      const m = COMPANY_MEASUREMENTS.find(m => m.id === id);
      if (!m) throw new Error(`Pengukuran ${id} tidak ditemukan`);
      return m;
    }
    const { data } = await api.get<Measurement>(`/measurements/${id}`);
    return data;
  },

  /**
   * Submit pengukuran lapangan (dari Supervisor).
   * Gunakan FormData jika ada upload foto.
   */
  submit: async (payload: CreateMeasurementRequest): Promise<Measurement> => {
    const formData = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (k === 'photos' && Array.isArray(v)) {
        v.forEach((f: File) => formData.append('photos', f));
      } else {
        formData.append(k, String(v));
      }
    });
    const { data } = await api.post<Measurement>('/measurements', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  verify: async (id: string, payload: VerifyMeasurementRequest): Promise<Measurement> => {
    if (USE_MOCK) {
      await mockDelay();
      const m = COMPANY_MEASUREMENTS.find(m => m.id === id);
      if (!m) throw new Error('Tidak ditemukan');
      return { ...m, status: payload.status };
    }
    const { data } = await api.put<Measurement>(`/measurements/${id}/verify`, payload);
    return data;
  },
};
