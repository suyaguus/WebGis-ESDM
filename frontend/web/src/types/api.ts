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
  businessId: string | null;
  latitude: number | null;
  longitude: number | null;
  locationDescription: string | null;
  wellType: "sumur_pantau" | "sumur_gali" | "sumur_bor";
  depthMeter: number | null;
  diameterInch: number | null;
  casingDiameter: number | null;
  pumpCapacity: number | null;
  pumpDepth: number | null;
  pipeDiameter: number | null;
  staticWaterLevel: number | null; // Kedalaman muka air tanah (m dari permukaan)
  waterLevelTrend: "rising" | "falling" | "stable" | "unknown" | null;
  lastWaterLevelMeasurement: string | null; // ISO datetime
  isActive: boolean;
  isVerified: boolean;
  status: "draft" | "pending_approval" | "reviewed" | "approved" | "rejected";
  supervisorNote: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
  };
  business: {
    id: string;
    name: string;
    companyId: string;
  } | null;
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
  wellStatus?: string;
  type?: string;
  companyId?: string;
  search?: string;
}

export interface CreateSensorRequest {
  name: string;
  businessId?: string;
  wellType: "sumur_pantau" | "sumur_gali" | "sumur_bor";
  latitude?: number;
  longitude?: number;
  locationDescription?: string;
  depthMeter?: number;
  diameterInch?: number;
  casingDiameter?: number;
  pumpCapacity?: number;
  pumpDepth?: number;
  pipeDiameter?: number;
  staticWaterLevelCm?: number; // Input dari frontend dalam CM, akan dikonversi ke M di backend
  waterLevelTrend?: "rising" | "falling" | "stable" | "unknown";
  lastWaterLevelMeasurement?: string; // ISO datetime
  isActive?: boolean; // Active/inactive status for visibility on maps
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

/** Response dari GET /api/businesses */
export interface BackendBusiness {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    name: string;
    email: string | null;
    type: string | null;
    isVerified: boolean;
    createdBy: string | null;
  };
}

export interface CreateBusinessRequest {
  name: string;
  address?: string;
  phone?: string;
  companyId?: string; // auto-filled on backend for admin_perusahaan
}

export interface UpdateBusinessRequest {
  name?: string;
  address?: string;
  phone?: string;
  companyId?: string;
}

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

/* ─────────────────────────────────────────────
   Pagination types
───────────────────────────────────────────── */

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
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
