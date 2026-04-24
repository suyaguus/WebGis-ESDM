import prisma from "../../config/prisma";
import { REPORT_MESSAGES } from "../../constants/report/report.message";
import { REPORT_SELECT } from "../../constants/report/report.select";
import { CreateReportInput } from "./report.type";
import { resolveCompanyId } from "../../utils/company-access";

export const createReport = async (data: CreateReportInput, user: any) => {
  const well = await prisma.well.findUnique({
    where: { id: data.wellId },
  });

  if (!well) throw new Error(REPORT_MESSAGES.WELL_NOT_FOUND);

  if (user.role !== "super_admin") {
    const companyId = await resolveCompanyId(user);
    if (!companyId || well.companyId !== companyId) {
      throw new Error(REPORT_MESSAGES.FORBIDDEN);
    }
  }

  return prisma.report.create({
    data: {
      ...data,
      userId: user.id,
      status: "PENDING",
    },
    select: REPORT_SELECT,
  });
};

export const getReports = async (user: any) => {
  if (user.role === "super_admin") {
    return prisma.report.findMany({
      select: REPORT_SELECT,
    });
  }

  const companyId = await resolveCompanyId(user);
  if (!companyId) return [];

  return prisma.report.findMany({
    where: {
      well: {
        companyId,
      },
    },
    select: REPORT_SELECT,
  });
};

export const getReportById = async (id: string, user: any) => {
  const report = await prisma.report.findUnique({
    where: { id },
    select: REPORT_SELECT,
  });

  if (!report) throw new Error(REPORT_MESSAGES.NOT_FOUND);

  if (user.role !== "super_admin") {
    const companyId = await resolveCompanyId(user);
    if (!companyId || report.well.company.id !== companyId) {
      throw new Error(REPORT_MESSAGES.FORBIDDEN);
    }
  }

  return report;
};

export const approveReport = async (id: string, user: any) => {
  const report = await prisma.report.findUnique({
    where: { id },
  });

  if (!report) throw new Error(REPORT_MESSAGES.NOT_FOUND);

  return prisma.report.update({
    where: { id },
    data: {
      status: "APPROVED",
      approvedBy: user.id,
      approvedAt: new Date(),
    },
    select: REPORT_SELECT,
  });
};

export const rejectReport = async (id: string, reason: string, user: any) => {
  const report = await prisma.report.findUnique({
    where: { id },
  });

  if (!report) throw new Error(REPORT_MESSAGES.NOT_FOUND);

  return prisma.report.update({
    where: { id },
    data: {
      status: "REJECTED",
      approvedBy: user.id,
      approvedAt: new Date(),
      rejection: {
        create: {
          reason,
          rejectedBy: user.id,
        },
      },
    },
    select: REPORT_SELECT,
  });
};
