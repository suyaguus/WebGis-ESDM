import api from "@/lib/api";
import type {
  BackendBusiness,
  CreateBusinessRequest,
  UpdateBusinessRequest,
} from "@/types/api";

export interface Business {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  companyId: string;
  companyName: string;
}

function mapBusiness(b: BackendBusiness): Business {
  return {
    id: b.id,
    name: b.name,
    address: b.address,
    phone: b.phone,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    companyId: b.company.id,
    companyName: b.company.name,
  };
}

export const businessService = {
  getAll: async (): Promise<Business[]> => {
    const { data } = await api.get<{ data: BackendBusiness[] }>("/businesses");
    return data.data.map(mapBusiness);
  },

  getById: async (id: string): Promise<Business> => {
    const { data } = await api.get<{ data: BackendBusiness }>(
      `/businesses/${id}`,
    );
    return mapBusiness(data.data);
  },

  create: async (payload: CreateBusinessRequest): Promise<Business> => {
    const { data } = await api.post<{ data: BackendBusiness }>(
      "/businesses",
      payload,
    );
    return mapBusiness(data.data);
  },

  update: async (
    id: string,
    payload: UpdateBusinessRequest,
  ): Promise<Business> => {
    const { data } = await api.patch<{ data: BackendBusiness }>(
      `/businesses/${id}`,
      payload,
    );
    return mapBusiness(data.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/businesses/${id}`);
  },
};
