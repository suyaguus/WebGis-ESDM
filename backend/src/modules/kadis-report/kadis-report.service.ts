import prisma from "../../config/prisma";
import { CreateKadisReportInput } from "./kadis-report.type";

const SELECT = {
  id: true,
  title: true,
  companyId: true,
  companyName: true,
  totalWells: true,
  avgWaterLevel: true,
  notes: true,
  pdfContent: true,
  sentAt: true,
  sender: { select: { id: true, name: true } },
};

export const createKadisReport = async (
  data: CreateKadisReportInput,
  user: any,
) => {
  return prisma.kadisReport.create({
    data: {
      title: data.title,
      companyId: data.companyId ?? null,
      companyName: data.companyName,
      totalWells: data.totalWells,
      avgWaterLevel: data.avgWaterLevel ?? null,
      notes: data.notes ?? null,
      pdfContent: data.pdfContent ?? null,
      sentBy: user.id,
    },
    select: SELECT,
  });
};

export const getKadisReports = async () => {
  return prisma.kadisReport.findMany({
    orderBy: { sentAt: "desc" },
    select: SELECT,
  });
};
