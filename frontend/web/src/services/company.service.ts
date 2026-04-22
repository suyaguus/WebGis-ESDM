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
    sensorCount: c._count?.wells ?? 0,
    status: c.isActive ? "online" : "offline",
    quota: c.quota,
    quotaUsed: c.quotaUsed,
    avgSubsidence,
  };
}

export const companyService = {
  getAll: async (): Promise<Company[]> => {
    if (USE_MOCK) {
      await mockDelay();
      return MOCK_COMPANIES;
    }
    const { data } = await api.get<{ data: BackendCompany[] }>("/companies");
    return data.data.map(mapCompany);
  },

  getById: async (id: string): Promise<Company> => {
    if (USE_MOCK) {
      await mockDelay();
      const c = MOCK_COMPANIES.find((c) => c.id === id);
      if (!c) throw new Error(`Perusahaan ${id} tidak ditemukan`);
      return c;
    }
    const { data } = await api.get<{ data: BackendCompany }>(
      `/companies/${id}`,
    );
    return mapCompany(data.data);
  },

  create: async (payload: CreateCompanyRequest): Promise<Company> => {
    const { data } = await api.post<{ data: BackendCompany }>(
      "/companies",
      payload,
    );
    return mapCompany(data.data);
  },

  update: async (
    id: string,
    payload: Partial<CreateCompanyRequest>,
  ): Promise<Company> => {
    const { data } = await api.patch<{ data: BackendCompany }>(
      `/companies/${id}`,
      payload,
    );
    return mapCompany(data.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/companies/${id}`);
  },
};
