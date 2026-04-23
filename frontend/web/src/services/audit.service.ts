import api from "@/lib/api";

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  userName: string;
  action: string;
  target: string;
  ip: string | null;
  severity: "info" | "warning" | "critical";
  createdAt: string;
}

export interface AuditFilter {
  severity?: string;
  search?: string;
  days?: number;
  page?: number;
}

export interface AuditMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuditResult {
  data: AuditLogEntry[];
  metadata: AuditMeta;
}

export const auditService = {
  getAll: async (filter?: AuditFilter): Promise<AuditResult> => {
    const params = new URLSearchParams();
    if (filter?.severity && filter.severity !== "all")
      params.set("severity", filter.severity);
    if (filter?.search) params.set("search", filter.search);
    if (filter?.days) params.set("days", String(filter.days));
    if (filter?.page) params.set("page", String(filter.page));

    const res = await api.get(`/audit?${params.toString()}`);
    return {
      data: res.data.data as AuditLogEntry[],
      metadata: res.data.metadata as AuditMeta,
    };
  },
};
