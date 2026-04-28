/**
 * COMPANY SERVICE — memanggil /api/companies
 */
import api from "@/lib/api";
import { MOCK_COMPANIES } from "@/constants/mockData";
import type { Company } from "@/types";
import type {
  CreateCompanyRequest,
  UpdateCompanyRequest,
  BackendCompany,
  PaginationParams,
  PaginatedResponse,
} from "@/types/api";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const mockDelay = () => new Promise((r) => setTimeout(r, 300));

function mapCompany(c: BackendCompany): Company {
  const wells = c.wells ?? [];
  const wellsWithSubsidence = wells.filter((w) => w.subsidenceRate !== null);
  const avgSubsidence =
    wellsWithSubsidence.length > 0
      ? wellsWithSubsidence.reduce(
          (sum, w) => sum + (w.subsidenceRate ?? 0),
          0,
        ) / wellsWithSubsidence.length
      : 0;

  return {
    id: c.id,
    name: c.name,
    region: c.address ?? "-",
    email: c.email ?? undefined,
    phone: c.phone ?? undefined,
    type: c.type ?? undefined,
    sensorCount: c._count?.wells ?? 0,
    status: c.isActive ? "online" : "offline",
    quota: c.quota,
    quotaUsed: c.quotaUsed,
    avgSubsidence,
    businesses: (c.businesses ?? []).map((b) => ({
      id: b.id,
      name: b.name,
      address: b.address,
    })),
  };
}

export const companyService = {
  getAll: async (
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Company>> => {
    if (USE_MOCK) {
      await mockDelay();
      // Mock pagination
      const limit = pagination?.limit ?? 10;
      const page = pagination?.page ?? 1;
      const start = (page - 1) * limit;
      const data = MOCK_COMPANIES.slice(start, start + limit);
      return {
        data,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalRecords: MOCK_COMPANIES.length,
          totalPages: Math.ceil(MOCK_COMPANIES.length / limit),
          hasNextPage: page < Math.ceil(MOCK_COMPANIES.length / limit),
          hasPrevPage: page > 1,
        },
      };
    }
    const params = new URLSearchParams();
    if (pagination?.page) params.append("page", String(pagination.page));
    if (pagination?.limit) params.append("limit", String(pagination.limit));

    const { data: response } = await api.get<{
      success: boolean;
      message: string;
      metadata: any;
      data: PaginatedResponse<BackendCompany>;
    }>(`/companies?${params.toString()}`);

    return {
      data: response.data.data.map(mapCompany),
      pagination: response.data.pagination,
    };
  },

  getById: async (id: string): Promise<Company> => {
    if (USE_MOCK) {
      await mockDelay();
      const c = MOCK_COMPANIES.find((c) => c.id === id);
      if (!c) throw new Error(`Perusahaan ${id} tidak ditemukan`);
      return c;
    }
    const { data: response } = await api.get<{
      success: boolean;
      message: string;
      metadata: any;
      data: BackendCompany;
    }>(`/companies/${id}`);
    return mapCompany(response.data);
  },

  create: async (payload: CreateCompanyRequest): Promise<Company> => {
    const { data: response } = await api.post<{
      success: boolean;
      message: string;
      metadata: any;
      data: BackendCompany;
    }>("/companies", payload);
    return mapCompany(response.data);
  },

  update: async (
    id: string,
    payload: Partial<CreateCompanyRequest>,
  ): Promise<Company> => {
    const { data: response } = await api.patch<{
      success: boolean;
      message: string;
      metadata: any;
      data: BackendCompany;
    }>(`/companies/${id}`, payload);
    return mapCompany(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },
};
