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
    subsidence: w.subsidenceRate ?? 0,
    waterLevel: w.depthMeter ?? undefined,
    verticalValue: w.verticalValue ?? undefined,
    companyId: w.company.id,
    lastUpdate:
      new Date(w.updatedAt).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB",
  };
}

export const sensorService = {
  getAll: async (filter?: SensorFilter): Promise<Sensor[]> => {
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
      return result;
    }
    const { data } = await api.get<{ data: BackendWell[] }>("/wells");
    let result = data.data.map(mapWellToSensor);
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
    return result;
  },

  getByCompany: async (companyId: string): Promise<Sensor[]> => {
    if (USE_MOCK) {
      await mockDelay();
      return companyId === "c1"
        ? COMPANY_SENSORS
        : MOCK_SENSORS.filter((s) => s.companyId === companyId);
    }
    const { data } = await api.get<{ data: BackendWell[] }>("/wells");
    return data.data
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
    const { data } = await api.get<{ data: BackendWell }>(`/wells/${id}`);
    return mapWellToSensor(data.data);
  },

  create: async (payload: CreateSensorRequest): Promise<Sensor> => {
    const { data } = await api.post<{ data: BackendWell }>("/wells", payload);
    return mapWellToSensor(data.data);
  },

  update: async (id: string, payload: UpdateSensorRequest): Promise<Sensor> => {
    const { data } = await api.patch<{ data: BackendWell }>(
      `/wells/${id}`,
      payload,
    );
    return mapWellToSensor(data.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/wells/${id}`);
  },
};
