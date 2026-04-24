/**
 * ANALYTICS SERVICE
 *
 * Endpoint yang dibutuhkan backend:
 *   GET  /analytics/trend             → TrendDataPoint[]   (query: period, companyId)
 *   GET  /analytics/company-summary   → CompanyAnalytics[]
 *   GET  /analytics/quota-usage       → CompanyAnalytics[]
 */
import api from "@/lib/api";
import { ANALYTICS_MONTHLY, MOCK_COMPANIES } from "@/constants/mockData";
import type {
  AnalyticsTrendFilter,
  TrendDataPoint,
  CompanyAnalytics,
} from "@/types/api";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const mockDelay = () => new Promise((r) => setTimeout(r, 350));

export const analyticsService = {
  getTrend: async (
    filter?: AnalyticsTrendFilter,
  ): Promise<TrendDataPoint[]> => {
    if (USE_MOCK) {
      await mockDelay();
      const count =
        filter?.period === "6m" ? 6 : filter?.period === "2y" ? 24 : 12;
      return ANALYTICS_MONTHLY.slice(-count).map((d) => ({
        label: d.month,
        sw: d.sw,
        gnss: d.gnss,
        threshold: d.threshold,
      }));
    }
    const { data: response } = await api.get<{
      success: boolean;
      message: string;
      metadata: any;
      data: TrendDataPoint[];
    }>("/analytics/trend", { params: filter });
    return response.data;
  },

  getCompanySummary: async (): Promise<CompanyAnalytics[]> => {
    if (USE_MOCK) {
      await mockDelay();
      return MOCK_COMPANIES.map((c) => ({
        companyId: c.id,
        companyName: c.name,
        avgSubsidence: c.avgSubsidence,
        quotaUsed: c.quotaUsed,
        quotaTotal: c.quota,
        sensorCount: c.sensorCount,
      }));
    }
    const { data: response } = await api.get<{
      success: boolean;
      message: string;
      metadata: any;
      data: CompanyAnalytics[];
    }>("/analytics/company-summary");
    return response.data;
  },
};
