/**
 * REPORT SERVICE
 *
 * Endpoint yang dibutuhkan backend:
 *   GET    /reports              → ReportFile[]
 *   POST   /reports/generate     → { jobId: string }  (async, polling /reports/status/:jobId)
 *   GET    /reports/status/:jobId → { status: 'generating'|'done'|'error', reportId?: string }
 *   GET    /reports/:id/download → File stream (Content-Disposition: attachment)
 */
import api from '@/lib/api';
import { KADIS_RECENT_REPORTS } from '@/constants/mockData';

const ADMIN_RECENT_REPORTS = [
  { id: 'r1', name: 'Laporan Subsidence Q1 2026',   type: 'Subsidence', date: '15 Apr 2026', size: '2.4 MB', format: 'PDF',  status: 'done'       },
  { id: 'r2', name: 'Laporan Kuota Maret 2026',     type: 'Kuota',      date: '01 Apr 2026', size: '0.8 MB', format: 'XLSX', status: 'done'       },
  { id: 'r3', name: 'Laporan Muka Air Q1 2026',     type: 'Muka Air',   date: '31 Mar 2026', size: '1.9 MB', format: 'PDF',  status: 'done'       },
  { id: 'r4', name: 'Laporan Kepatuhan Feb 2026',   type: 'Kepatuhan',  date: '28 Feb 2026', size: '1.1 MB', format: 'PDF',  status: 'done'       },
  { id: 'r5', name: 'Ekspor Data Sensor Bulanan',   type: 'Custom',     date: '16 Apr 2026', size: '-',      format: 'CSV',  status: 'generating' },
];
import type { GenerateReportRequest } from '@/types/api';

export interface ReportFile {
  id:     string;
  name:   string;
  type:   string;
  date:   string;
  size:   string;
  format: string;
  status: 'done' | 'generating' | 'error';
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const mockDelay = (ms = 2000) => new Promise(r => setTimeout(r, ms));

export const reportService = {
  getAll: async (scope: 'kadis' | 'admin' = 'admin'): Promise<ReportFile[]> => {
    if (USE_MOCK) {
      await mockDelay(300);
      return (scope === 'kadis' ? KADIS_RECENT_REPORTS : RECENT_REPORTS_ADMIN) as ReportFile[];
    }
    const { data } = await api.get<ReportFile[]>('/reports');
    return data;
  },

  /**
   * Memulai pembuatan laporan (async di backend).
   * Backend bisa mengembalikan jobId untuk polling, atau langsung URL download.
   */
  generate: async (payload: GenerateReportRequest): Promise<{ jobId: string }> => {
    if (USE_MOCK) {
      await mockDelay();
      return { jobId: `mock_job_${Date.now()}` };
    }
    const { data } = await api.post<{ jobId: string }>('/reports/generate', payload);
    return data;
  },

  checkStatus: async (jobId: string): Promise<{ status: string; reportId?: string }> => {
    if (USE_MOCK) {
      await mockDelay(500);
      return { status: 'done', reportId: `report_${jobId}` };
    }
    const { data } = await api.get(`/reports/status/${jobId}`);
    return data;
  },

  downloadUrl: (reportId: string): string =>
    `${import.meta.env.VITE_API_URL}/reports/${reportId}/download`,
};
