/**
 * SENSOR SERVICE
 *
 * "Sensor" di frontend = "Well" (sumur) di backend.
 * Endpoint: /api/wells
 */
import api from "@/lib/api";
import { MOCK_SENSORS, COMPANY_SENSORS } from "@/constants/mockData";
import type { Sensor } from "@/types";
import type {
  SensorFilter,
  CreateSensorRequest,
  UpdateSensorRequest,
  BackendWell,
  PaginationParams,
  PaginatedResponse,
} from "@/types/api";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const mockDelay = () => new Promise((r) => setTimeout(r, 300));

/** Petakan BackendWell → Sensor (tipe yang dipakai halaman frontend) */
function mapWellToSensor(w: BackendWell): Sensor {
  return {
    id: w.id,
    code: w.name,
    type: w.wellType === "perusahaan" ? "water" : "water",
    location: w.locationDescription ?? w.company.name,
    lat: w.latitude ?? null,
    lng: w.longitude ?? null,
    status: w.isActive ? "online" : "offline",
    staticWaterLevel: w.staticWaterLevel ?? null,
    waterLevelTrend: w.waterLevelTrend,
    isActive: w.isActive,
    isVerified: w.isVerified,
    companyId: w.company.id,
    lastUpdate:
      new Date(w.updatedAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB",
  };
}

export const sensorService = {
  getAll: async (
    filter?: SensorFilter,
    pagination?: PaginationParams,
  ): Promise<PaginatedResponse<Sensor>> => {
    if (USE_MOCK) {
      await mockDelay();
      let result = [...MOCK_SENSORS];
      if (filter?.status)
        result = result.filter((s) => s.status === filter.status);
      if (filter?.type) result = result.filter((s) => s.type === filter.type);
      if (filter?.companyId)
        result = result.filter((s) => s.companyId === filter.companyId);
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        result = result.filter(
          (s) =>
            s.code.toLowerCase().includes(q) ||
            s.location.toLowerCase().includes(q),
        );
      }
      const limit = pagination?.limit ?? 10;
      const page = pagination?.page ?? 1;
      const start = (page - 1) * limit;
      const data = result.slice(start, start + limit);
      return {
        data,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalRecords: result.length,
          totalPages: Math.ceil(result.length / limit),
          hasNextPage: page < Math.ceil(result.length / limit),
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
      data: PaginatedResponse<BackendWell>;
    }>(`/wells?${params.toString()}`);

    let result = response.data.data.map(mapWellToSensor);
    if (filter?.companyId)
      result = result.filter((s) => s.companyId === filter.companyId);
    if (filter?.status)
      result = result.filter((s) => s.status === filter.status);
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q),
      );
    }
    return {
      data: result,
      pagination: response.data.pagination,
    };
  },

  getByCompany: async (companyId: string): Promise<Sensor[]> => {
    if (USE_MOCK) {
      await mockDelay();
      return companyId === "c1"
        ? COMPANY_SENSORS
        : MOCK_SENSORS.filter((s) => s.companyId === companyId);
    }
    const { data: response } = await api.get<{
      success: boolean;
      message: string;
      metadata: any;
      data: BackendWell[];
    }>("/wells");
    return response.data
      .filter((w) => w.company.id === companyId)
      .map(mapWellToSensor);
  },

  getById: async (id: string): Promise<Sensor> => {
    if (USE_MOCK) {
      await mockDelay();
      const s =
        MOCK_SENSORS.find((s) => s.id === id) ??
        COMPANY_SENSORS.find((s) => s.id === id);
      if (!s) throw new Error(`Sensor ${id} tidak ditemukan`);
      return s;
    }
    const { data: response } = await api.get<{
      success: boolean;
      message: string;
      metadata: any;
      data: BackendWell;
    }>(`/wells/${id}`);
    return mapWellToSensor(response.data);
  },

  create: async (payload: CreateSensorRequest): Promise<Sensor> => {
    const { data: response } = await api.post<{
      success: boolean;
      message: string;
      metadata: any;
      data: BackendWell;
    }>("/wells", payload);
    return mapWellToSensor(response.data);
  },

  update: async (id: string, payload: UpdateSensorRequest): Promise<Sensor> => {
    const { data: response } = await api.patch<{
      success: boolean;
      message: string;
      metadata: any;
      data: BackendWell;
    }>(`/wells/${id}`, payload);
    return mapWellToSensor(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/wells/${id}`);
  },

  verify: async (id: string): Promise<Sensor> => {
    const { data: response } = await api.patch<{
      success: boolean;
      message: string;
      metadata: any;
      data: BackendWell;
    }>(`/wells/${id}/verify`);
    return mapWellToSensor(response.data);
  },
};
