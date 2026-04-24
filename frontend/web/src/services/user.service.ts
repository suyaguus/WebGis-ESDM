/**
 * USER SERVICE
 *
 * Endpoint backend:
 *   GET    /users         -> BackendUser[]   (semua role, dengan pagination)
 *   GET    /users/:id     -> BackendUser
 *   POST   /users         -> BackendUser     (super_admin only)
 *   PATCH  /users/:id     -> BackendUser
 *   DELETE /users/:id     -> void            (super_admin only)
 */
import api from "@/lib/api";
import type {
  BackendUser,
  CreateAdminPerusahaanRequest,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/api";

export interface UpdateMeRequest {
  name?: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  company: string;
  companyId: string | null;
  status: "active" | "inactive" | "pending";
  createdAt: string;
  avatar: string;
}

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function mapUser(u: BackendUser): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    company: u.company?.name ?? "-",
    companyId: u.companyId,
    status: !u.isActive ? "inactive" : !u.isVerified ? "pending" : "active",
    createdAt: new Date(u.createdAt).toLocaleDateString("id-ID"),
    avatar: u.name
      .split(" ")
      .map((w: string) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),
  };
}

export const userService = {
  getAll: async (
    page: number = 1,
    limit: number = 5,
  ): Promise<PaginatedUsers> => {
    const { data: response } = await api.get<{
      success: boolean;
      message: string;
      metadata: any;
      data: {
        users: BackendUser[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>("/users", { params: { page, limit } });
    return {
      users: response.data.users.map(mapUser),
      total: response.data.total,
      page: response.data.page,
      limit: response.data.limit,
      totalPages: response.data.totalPages,
    };
  },

  getById: async (id: string): Promise<User> => {
    const { data: response } = await api.get<{
      success: boolean;
      message: string;
      metadata: any;
      data: BackendUser;
    }>(`/users/${id}`);
    return mapUser(response.data);
  },

  create: async (payload: CreateUserRequest): Promise<User> => {
    const { data: response } = await api.post<{
      success: boolean;
      message: string;
      metadata: any;
      data: BackendUser;
    }>("/users", payload);
    return mapUser(response.data);
  },

  createAdminPerusahaan: async (
    payload: CreateAdminPerusahaanRequest,
  ): Promise<{ user: User; company: { id: string; name: string } }> => {
    const { data: response } = await api.post<{
      success: boolean;
      message: string;
      metadata: any;
      data: { user: BackendUser; company: { id: string; name: string } };
    }>("/users/admin-perusahaan", payload);
    return {
      user: mapUser(response.data.user),
      company: response.data.company,
    };
  },

  update: async (id: string, payload: UpdateUserRequest): Promise<User> => {
    const { data: response } = await api.patch<{
      success: boolean;
      message: string;
      metadata: any;
      data: BackendUser;
    }>(`/users/${id}`, payload);
    return mapUser(response.data);
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

  updateMe: async (payload: UpdateMeRequest): Promise<User> => {
    const { data: response } = await api.patch<{
      success: boolean;
      message: string;
      metadata: any;
      data: BackendUser;
    }>("/users/me", payload);
    return mapUser(response.data);
  },
};
