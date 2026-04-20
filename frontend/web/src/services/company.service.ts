/**
 * COMPANY SERVICE
 *
 * Endpoint yang dibutuhkan backend:
 *   GET    /companies        → Company[]
 *   GET    /companies/:id    → Company
 *   POST   /companies        → Company   (superadmin only)
 *   PUT    /companies/:id    → Company   (superadmin only)
 *   DELETE /companies/:id    → { success: true }  (superadmin only)
 */
import api from '@/lib/api';
import { MOCK_COMPANIES } from '@/constants/mockData';
import type { Company } from '@/types';
import type { CreateCompanyRequest, UpdateCompanyRequest } from '@/types/api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const mockDelay = () => new Promise(r => setTimeout(r, 300));

export const companyService = {
  getAll: async (): Promise<Company[]> => {
    if (USE_MOCK) { await mockDelay(); return MOCK_COMPANIES; }
    const { data } = await api.get<Company[]>('/companies');
    return data;
  },

  getById: async (id: string): Promise<Company> => {
    if (USE_MOCK) {
      await mockDelay();
      const c = MOCK_COMPANIES.find(c => c.id === id);
      if (!c) throw new Error(`Perusahaan ${id} tidak ditemukan`);
      return c;
    }
    const { data } = await api.get<Company>(`/companies/${id}`);
    return data;
  },

  create: async (payload: CreateCompanyRequest): Promise<Company> => {
    const { data } = await api.post<Company>('/companies', payload);
    return data;
  },

  update: async (id: string, payload: UpdateCompanyRequest): Promise<Company> => {
    const { data } = await api.put<Company>(`/companies/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },
};
