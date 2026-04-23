import { WaterQuality } from "@prisma/client";

export type CreateReportInput = {
  wellId: string;
  waterDepth: number;
  waterUsage?: number;
  waterQuality?: WaterQuality;
  description?: string;
  photos?: string[];
};

export type UpdateReportInput = Partial<CreateReportInput>;
