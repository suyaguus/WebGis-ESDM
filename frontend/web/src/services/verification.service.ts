/**
 * VERIFICATION SERVICE — memanggil /api/reports untuk keperluan verifikasi super_admin
 */
import api from "@/lib/api";
import type { BackendReport } from "@/types/api";

export interface VerificationReport {
  id: string;
  wellId: string;
  wellName: string;
  companyId: string;
  companyName: string;
  surveyorId: string;
  surveyorName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  waterDepth: number;
  waterUsage: number | null;
  waterQuality: "BAIK" | "SEDANG" | "BURUK" | null;
  description: string | null;
  photos: string[];
  createdAt: string;
  approvedAt: string | null;
}

function mapReport(r: BackendReport): VerificationReport {
  return {
    id: r.id,
    wellId: r.well.id,
    wellName: r.well.name,
    companyId: r.well.company.id,
    companyName: r.well.company.name,
    surveyorId: r.user.id,
    surveyorName: r.user.name,
    status: r.status,
    waterDepth: r.waterDepth,
    waterUsage: r.waterUsage,
    waterQuality: r.waterQuality,
    description: r.description,
    photos: r.photos ?? [],
    createdAt: r.createdAt,
    approvedAt: r.approvedAt,
  };
}

export const verificationService = {
  getAll: async (): Promise<VerificationReport[]> => {
    const { data } = await api.get<{ data: BackendReport[] }>("/reports");
    return (data.data ?? []).map(mapReport);
  },

  getById: async (id: string): Promise<VerificationReport> => {
    const { data } = await api.get<{ data: BackendReport }>(`/reports/${id}`);
    return mapReport(data.data);
  },

  approve: async (id: string): Promise<VerificationReport> => {
    const { data } = await api.patch<{ data: BackendReport }>(
      `/reports/${id}/approve`,
    );
    return mapReport(data.data);
  },

  reject: async (id: string, reason: string): Promise<VerificationReport> => {
    const { data } = await api.patch<{ data: BackendReport }>(
      `/reports/${id}/reject`,
      { reason },
    );
    return mapReport(data.data);
  },
};
