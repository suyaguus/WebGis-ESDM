import api from "@/lib/api";

export interface KadisReportPayload {
  title: string;
  companyId?: string | null;
  companyName: string;
  totalWells: number;
  avgWaterLevel?: number | null;
  notes?: string | null;
  pdfContent?: string | null;
}

export interface KadisReport {
  id: string;
  title: string;
  companyId: string | null;
  companyName: string;
  totalWells: number;
  avgWaterLevel: number | null;
  notes: string | null;
  pdfContent: string | null;
  sentAt: string;
  sender: { id: string; name: string };
}

export const kadisReportService = {
  send: async (payload: KadisReportPayload): Promise<KadisReport> => {
    const { data: response } = await api.post<{
      success: boolean;
      message: string;
      data: KadisReport;
    }>("/kadis-reports", payload);
    return response.data;
  },

  getAll: async (): Promise<KadisReport[]> => {
    const { data: response } = await api.get<{
      success: boolean;
      data: KadisReport[];
    }>("/kadis-reports");
    return response.data ?? [];
  },
};
