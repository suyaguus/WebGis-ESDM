import api from "@/lib/api";
import type {
  BackendBusiness,
  CreateBusinessRequest,
  UpdateBusinessRequest,
  PaginationParams,
  PaginatedResponse,
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
  getAll: async (
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Business>> => {
    const params = new URLSearchParams();
    if (pagination?.page) params.append("page", String(pagination.page));
    if (pagination?.limit) params.append("limit", String(pagination.limit));

    const { data: response } = await api.get<{
      success: boolean;
      message: string;
      metadata: any;
      data: PaginatedResponse<BackendBusiness>;
    }>(`/businesses?${params.toString()}`);
    return {
      data: response.data.data.map(mapBusiness),
      pagination: response.data.pagination,
    };
  },

  getById: async (id: string): Promise<Business> => {
    const { data: response } = await api.get<{
      success: boolean;
      message: string;
      metadata: any;
      data: BackendBusiness;
    }>(`/businesses/${id}`);
    return mapBusiness(response.data);
  },

  create: async (payload: CreateBusinessRequest): Promise<Business> => {
    const { data: response } = await api.post<{
      success: boolean;
      message: string;
      metadata: any;
      data: BackendBusiness;
    }>("/businesses", payload);
    return mapBusiness(response.data);
  },

  update: async (
    id: string,
    payload: UpdateBusinessRequest,
  ): Promise<Business> => {
    const { data: response } = await api.patch<{
      success: boolean;
      message: string;
      metadata: any;
      data: BackendBusiness;
    }>(`/businesses/${id}`, payload);
    return mapBusiness(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/businesses/${id}`);
  },
};
