export interface CreateKadisReportInput {
  title: string;
  companyId?: string | null;
  companyName: string;
  totalWells: number;
  avgWaterLevel?: number | null;
  notes?: string | null;
  pdfContent?: string | null;
}
