/**
 * USER SERVICE
 *
 * Endpoint yang dibutuhkan backend:
 *   GET    /users         → User[]    (superadmin only)
 *   GET    /users/:id     → User
 *   POST   /users         → User      (superadmin only)
 *   PUT    /users/:id     → User      (superadmin only)
 *   DELETE /users/:id     → { success: true }  (superadmin only)
 */
import api from '@/lib/api';
import { MOCK_USERS } from '@/constants/mockData';
import type { User as MockUser } from '@/constants/mockData';
import type { CreateUserRequest, UpdateUserRequest } from '@/types/api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const mockDelay = () => new Promise(r => setTimeout(r, 300));

export const userService = {
  getAll: async (): Promise<MockUser[]> => {
    if (USE_MOCK) { await mockDelay(); return MOCK_USERS; }
    const { data } = await api.get<MockUser[]>('/users');
    return data;
  },

  getById: async (id: string): Promise<MockUser> => {
    if (USE_MOCK) {
      await mockDelay();
      const u = MOCK_USERS.find(u => u.id === id);
      if (!u) throw new Error(`User ${id} tidak ditemukan`);
      return u;
    }
    const { data } = await api.get<MockUser>(`/users/${id}`);
    return data;
  },

  create: async (payload: CreateUserRequest): Promise<MockUser> => {
    const { data } = await api.post<MockUser>('/users', payload);
    return data;
  },

  update: async (id: string, payload: UpdateUserRequest): Promise<MockUser> => {
    const { data } = await api.put<MockUser>(`/users/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
