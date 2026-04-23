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

/* ─────────────────────────────────────────────
   Backend entity types (response shapes dari API)
───────────────────────────────────────────── */

/** Response dari GET /api/wells */
export interface BackendWell {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  locationDescription: string | null;
  wellType: "perusahaan" | "non_perusahaan" | "rumah_tangga";
  depthMeter: number | null;
  diameterInch: number | null;
  casingDiameter: number | null;
  pumpCapacity: number | null;
  pumpDepth: number | null;
  pipeDiameter: number | null;
  subsidenceRate: number | null; // laju penurunan tanah (cm/tahun)
  verticalValue: number | null; // nilai vertikal GNSS (m)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    createdBy: string | null;
  };
  creator: {
    id: string;
    name: string;
    role: BackendRole;
  } | null;
}

/** Response dari GET /api/reports */
export interface BackendReport {
  id: string;
  waterDepth: number;
  waterUsage: number | null;
  waterQuality: "BAIK" | "SEDANG" | "BURUK" | null;
  description: string | null;
  photos: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  approvedAt: string | null;
  well: {
    id: string;
    name: string;
    company: {
      id: string;
      name: string;
      createdBy: string | null;
    };
  };
  user: {
    id: string;
    name: string;
    role: BackendRole;
  };
}

/** Response dari GET /api/companies */
export interface BackendCompany {
  id: string;
  name: string;
  address: string | null;
  email: string | null;
  phone: string | null;
  type: string | null;
  isVerified: boolean;
  isActive: boolean;
  quota: number;
  quotaUsed: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string;
    role: BackendRole;
  } | null;
  businesses: {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    createdAt: string;
  }[];
  _count?: {
    wells: number;
    users: number;
  };
  wells?: {
    subsidenceRate: number | null;
  }[];
}

/** Response dari GET /api/users */
export interface BackendUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: BackendRole;
  companyId: string | null;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  company: {
    id: string;
    name: string;
    address: string | null;
  } | null;
}

/* ─────────────────────────────────────────────
   Request types
───────────────────────────────────────────── */

export interface SensorFilter {
  status?: string;
  type?: string;
  companyId?: string;
  search?: string;
}

export interface CreateSensorRequest {
  name: string;
  companyId: string;
  wellType: "perusahaan" | "non_perusahaan" | "rumah_tangga";
  latitude?: number;
  longitude?: number;
  locationDescription?: string;
  depthMeter?: number;
  diameterInch?: number;
}

export interface UpdateSensorRequest extends Partial<CreateSensorRequest> {}

export interface CreateCompanyRequest {
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  type?: string;
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {}

export interface CreateMeasurementRequest {
  wellId: string;
  waterDepth: number;
  waterUsage?: number;
  waterQuality?: "BAIK" | "SEDANG" | "BURUK";
  description?: string;
  photos?: File[];
}

export interface VerifyMeasurementRequest {
  status: "APPROVED" | "REJECTED";
  note?: string;
}

export interface GenerateReportRequest {
  type: string;
  startDate?: string;
  endDate?: string;
  companyId?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: BackendRole;
  companyId?: string;
  phone?: string;
}

export interface CreateAdminPerusahaanRequest {
  // Data user
  name: string;
  email: string;
  password: string;
  phone?: string;
  // Data perusahaan
  companyName: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyType?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  role?: BackendRole;
  companyId?: string;
}
