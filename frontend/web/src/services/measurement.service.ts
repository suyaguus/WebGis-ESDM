/**
 * MEASUREMENT SERVICE
 *
 * "Measurement" di frontend = "Report" (laporan) di backend.
 * Endpoint: /api/reports
 */
import api from "@/lib/api";
import { COMPANY_MEASUREMENTS } from "@/constants/mockData";
import type { Measurement } from "@/constants/mockData";
import type {
  CreateMeasurementRequest,
  VerifyMeasurementRequest,
  BackendReport,
} from "@/types/api";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const mockDelay = () => new Promise((r) => setTimeout(r, 300));

export interface MeasurementFilter {
  companyId?: string;
  status?: "pending" | "verified" | "rejected" | "draft";
  startDate?: string;
  endDate?: string;
}

/** Petakan BackendReport → Measurement (tipe yang dipakai halaman frontend) */
function mapReportToMeasurement(r: BackendReport): Measurement {
  return {
    id: r.id,
    sensorCode: r.well.name,
    sensorId: r.well.id,
    surveyorName: r.user.name,
    surveyorAvatar: r.user.name.slice(0, 2).toUpperCase(),
    waterLevel: r.waterDepth,
    subsidence: 0,
    verticalValue: 0,
    kondisiFisik: "baik",
    catatan: r.description ?? "",
    status:
      r.status === "PENDING"
        ? "pending"
        : r.status === "APPROVED"
          ? "verified"
          : "rejected",
    submittedAt: new Date(r.createdAt).toLocaleDateString("id-ID"),
    approvedAt: r.approvedAt
      ? new Date(r.approvedAt).toLocaleDateString("id-ID")
      : undefined,
    photos: r.photos ?? [],
  };
}

export const measurementService = {
  getAll: async (filter?: MeasurementFilter): Promise<Measurement[]> => {
    if (USE_MOCK) {
      await mockDelay();
      let result = [...COMPANY_MEASUREMENTS];
      if (filter?.status)
        result = result.filter((m) => m.status === filter.status);
      return result;
    }
    const { data } = await api.get<{ data: BackendReport[] }>("/reports");
    let result = data.data.map(mapReportToMeasurement);
    if (filter?.status)
      result = result.filter((m) => m.status === filter.status);
    return result;
  },

  getById: async (id: string): Promise<Measurement> => {
    if (USE_MOCK) {
      await mockDelay();
      const m = COMPANY_MEASUREMENTS.find((m) => m.id === id);
      if (!m) throw new Error(`Pengukuran ${id} tidak ditemukan`);
      return m;
    }
    const { data } = await api.get<{ data: BackendReport }>(`/reports/${id}`);
    return mapReportToMeasurement(data.data);
  },

  submit: async (payload: CreateMeasurementRequest): Promise<Measurement> => {
    const formData = new FormData();
    formData.append("wellId", payload.wellId);
    formData.append("waterDepth", String(payload.waterDepth));
    if (payload.waterUsage)
      formData.append("waterUsage", String(payload.waterUsage));
    if (payload.waterQuality)
      formData.append("waterQuality", payload.waterQuality);
    if (payload.description)
      formData.append("description", payload.description);
    if (payload.photos) {
      payload.photos.forEach((f: File) => formData.append("photos", f));
    }
    const { data } = await api.post<{ data: BackendReport }>(
      "/reports",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return mapReportToMeasurement(data.data);
  },

  verify: async (
    id: string,
    payload: VerifyMeasurementRequest,
  ): Promise<Measurement> => {
    if (USE_MOCK) {
      await mockDelay();
      const m = COMPANY_MEASUREMENTS.find((m) => m.id === id);
      if (!m) throw new Error("Tidak ditemukan");
      return {
        ...m,
        status: payload.status === "APPROVED" ? "verified" : "rejected",
      };
    }
    const { data } = await api.patch<{ data: BackendReport }>(
      `/reports/${id}`,
      {
        status: payload.status,
      },
    );
    return mapReportToMeasurement(data.data);
  },
};
