/**
 * USER SERVICE
 *
 * Endpoint backend:
 *   GET    /users         -> BackendUser[]   (semua role)
 *   GET    /users/:id     -> BackendUser
 *   POST   /users         -> BackendUser     (super_admin only)
 *   PATCH  /users/:id     -> BackendUser
 *   DELETE /users/:id     -> void            (super_admin only)
 */
import api from '@/lib/api';
import type { BackendUser, CreateUserRequest, UpdateUserRequest } from '@/types/api';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  company: string;
  companyId: string | null;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  avatar: string;
}

function mapUser(u: BackendUser): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    company: u.company?.name ?? '-',
    companyId: u.companyId,
    status: !u.isActive ? 'inactive' : !u.isVerified ? 'pending' : 'active',
    createdAt: new Date(u.createdAt).toLocaleDateString('id-ID'),
    avatar: u.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase(),
  };
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get<{ data: BackendUser[] }>('/users');
    return data.data.map(mapUser);
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await api.get<{ data: BackendUser }>(`/users/${id}`);
    return mapUser(data.data);
  },

  create: async (payload: CreateUserRequest): Promise<User> => {
    const { data } = await api.post<{ data: BackendUser }>('/users', payload);
    return mapUser(data.data);
  },

  update: async (id: string, payload: UpdateUserRequest): Promise<User> => {
    const { data } = await api.patch<{ data: BackendUser }>(`/users/${id}`, payload);
    return mapUser(data.data);
  },

  deactivate: async (id: string): Promise<void> => {
    await api.patch(`/users/${id}/deactivate`);
  },

  activate: async (id: string): Promise<void> => {
    await api.patch(`/users/${id}/activate`);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
