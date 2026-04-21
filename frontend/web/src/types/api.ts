/**
 * Tipe-tipe yang sesuai dengan response dari backend API.
 * Role backend: super_admin | admin_perusahaan | kepala_instansi | supervisor
 */
import type { Role } from ".";

export type BackendRole =
  | "super_admin"
  | "admin_perusahaan"
  | "kepala_instansi"
  | "supervisor";

/**
 * Map BackendRole → Role frontend.
 * Dipakai saat login agar store.setRole bekerja dengan benar.
 */
export const toFrontendRole = (backendRole: BackendRole): Role => {
  const map: Record<BackendRole, Role> = {
    super_admin: "superadmin",
    admin_perusahaan: "admin",
    kepala_instansi: "kadis",
    supervisor: "surveyor",
  };
  return map[backendRole] ?? "superadmin";
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: BackendRole;
  companyId?: string | null;
  phone?: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: AuthUser;
}
