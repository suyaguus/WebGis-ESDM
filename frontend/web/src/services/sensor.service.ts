/**
 * SENSOR SERVICE
 *
 * Endpoint yang dibutuhkan backend:
 *   GET    /sensors              → Sensor[]         (filter: status, type, companyId, search)
 *   GET    /sensors/:id          → Sensor
 *   POST   /sensors              → Sensor           (superadmin only)
 *   PUT    /sensors/:id          → Sensor           (superadmin only)
 *   DELETE /sensors/:id          → { success: true }  (superadmin only)
 *   GET    /sensors/:id/history  → MeasurementHistory[]
 */
import api from '@/lib/api';
import { MOCK_SENSORS, COMPANY_SENSORS } from '@/constants/mockData';
import type { Sensor } from '@/types';
import type { SensorFilter, CreateSensorRequest, UpdateSensorRequest } from '@/types/api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const mockDelay = () => new Promise(r => setTimeout(r, 300));

export const sensorService = {
  /**
   * Ambil semua sensor. Mendukung filter status, tipe, companyId, dan pencarian.
   */
  getAll: async (filter?: SensorFilter): Promise<Sensor[]> => {
    if (USE_MOCK) {
      await mockDelay();
      let result = [...MOCK_SENSORS];
      if (filter?.status)    result = result.filter(s => s.status    === filter.status);
      if (filter?.type)      result = result.filter(s => s.type      === filter.type);
      if (filter?.companyId) result = result.filter(s => s.companyId === filter.companyId);
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        result = result.filter(s =>
          s.code.toLowerCase().includes(q) || s.location.toLowerCase().includes(q),
        );
      }
      return result;
    }
    const { data } = await api.get<Sensor[]>('/sensors', { params: filter });
    return data;
  },

  /**
   * Ambil sensor milik satu perusahaan (untuk Admin Perusahaan).
   */
  getByCompany: async (companyId: string): Promise<Sensor[]> => {
    if (USE_MOCK) {
      await mockDelay();
      return companyId === 'c1' ? COMPANY_SENSORS : MOCK_SENSORS.filter(s => s.companyId === companyId);
    }
    const { data } = await api.get<Sensor[]>('/sensors', { params: { companyId } });
    return data;
  },

  /**
   * Ambil detail satu sensor.
   */
  getById: async (id: string): Promise<Sensor> => {
    if (USE_MOCK) {
      await mockDelay();
      const s = MOCK_SENSORS.find(s => s.id === id) ?? COMPANY_SENSORS.find(s => s.id === id);
      if (!s) throw new Error(`Sensor ${id} tidak ditemukan`);
      return s;
    }
    const { data } = await api.get<Sensor>(`/sensors/${id}`);
    return data;
  },

  create: async (payload: CreateSensorRequest): Promise<Sensor> => {
    const { data } = await api.post<Sensor>('/sensors', payload);
    return data;
  },

  update: async (id: string, payload: UpdateSensorRequest): Promise<Sensor> => {
    const { data } = await api.put<Sensor>(`/sensors/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/sensors/${id}`);
  },
};
