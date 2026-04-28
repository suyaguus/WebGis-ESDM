import prisma from "../../config/prisma";
import { WELL_SELECT } from "../../constants/well/well.select";
import { WELL_MESSAGES } from "../../constants/well/well.message";
import { CreateWellInput, UpdateWellInput } from "./well.type";
import { resolveCompanyId } from "../../utils/company-access";
import { convertCmToM } from "../../utils/groundwater";
import { Prisma } from "@prisma/client";
import {
  parsePaginationParams,
  formatPaginationResult,
  calculateSkip,
  PaginationParams,
} from "../../utils/pagination";

type WellRecord = Prisma.WellGetPayload<{
  select: typeof WELL_SELECT;
}>;

const findBusinessForUser = async (businessId: string, user: any) => {
  console.log(
    "[findBusinessForUser] Looking for businessId:",
    businessId,
    "User role:",
    user.role,
  );

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      id: true,
      name: true,
      companyId: true,
      company: {
        select: {
          id: true,
          name: true,
          createdBy: true,
        },
      },
    },
  });

  if (!business) {
    console.error("[findBusinessForUser] Business not found:", businessId);
    throw new Error(WELL_MESSAGES.BUSINESS_NOT_FOUND);
  }

  console.log(
    "[findBusinessForUser] Found business:",
    business.id,
    "Company:",
    business.companyId,
  );

  if (user.role === "super_admin") {
    console.log("[findBusinessForUser] User is super_admin, allowing access");
    return business;
  }

  const companyId = await resolveCompanyId(user);
  console.log(
    "[findBusinessForUser] Resolved company ID:",
    companyId,
    "Business companyId:",
    business.companyId,
  );

  if (!companyId || business.companyId !== companyId) {
    console.error(
      "[findBusinessForUser] Forbidden: user company does not match business company",
    );
    throw new Error(WELL_MESSAGES.FORBIDDEN);
  }

  return business;
};

export const createWell = async (data: CreateWellInput, user: any) => {
  console.log("[createWell] Input data:", JSON.stringify(data, null, 2));
  console.log("[createWell] User:", user);

  // Validate required fields
  if (!data.name || !data.name.trim()) {
    throw new Error("Nama sumur (name) wajib diisi");
  }
  if (!data.businessId) {
    throw new Error("Unit bisnis (businessId) wajib dipilih");
  }
  if (data.latitude === undefined || data.latitude === null) {
    throw new Error("Latitude wajib diisi");
  }
  if (data.longitude === undefined || data.longitude === null) {
    throw new Error("Longitude wajib diisi");
  }
  if (!data.wellType) {
    throw new Error(
      "Tipe sumur (wellType) wajib dipilih - harus salah satu: sumur_pantau, sumur_gali, sumur_bor",
    );
  }

  // Validate wellType enum values
  const validWellTypes = ["sumur_pantau", "sumur_gali", "sumur_bor"];
  if (!validWellTypes.includes(data.wellType)) {
    throw new Error(
      `Tipe sumur (wellType) tidak valid. Harus salah satu dari: ${validWellTypes.join(", ")}. Dikirim: ${data.wellType}`,
    );
  }

  // Validate lastWaterLevelMeasurement format if provided
  if (data.lastWaterLevelMeasurement) {
    const dateValue = data.lastWaterLevelMeasurement;
    const dateStr =
      typeof dateValue === "string" ? dateValue : dateValue.toString();
    // Check if it's a valid ISO-8601 datetime with timezone
    // Must have T and timezone info (Z or ±HH:mm) and be at least 20 chars
    if (!dateStr.includes("T") || dateStr.length < 20) {
      throw new Error(
        `Tanggal pengukuran harus dalam format ISO-8601 dengan timezone (YYYY-MM-DDTHH:mm:ssZ atau YYYY-MM-DDTHH:mm:ss+HH:mm). Dikirim: ${dateStr}`,
      );
    }
    // Check for timezone suffix (Z or ±HH:mm)
    const hasTimezone =
      dateStr.endsWith("Z") || dateStr.includes("+") || dateStr.includes("-");
    if (!hasTimezone) {
      throw new Error(
        `Tanggal pengukuran harus memiliki timezone (Z untuk UTC, atau ±HH:mm). Dikirim: ${dateStr}`,
      );
    }
  }

  console.log("[createWell] businessId:", data.businessId);
  const business = await findBusinessForUser(data.businessId, user);
  console.log("[createWell] Found business:", business);

  // Konversi staticWaterLevelCm (dari frontend) ke staticWaterLevel dalam meter
  const wellData = {
    ...data,
    companyId: business.companyId,
    createdBy: user.id,
    staticWaterLevel: convertCmToM(data.staticWaterLevelCm),
    status: "draft" as const,
  };

  console.log(
    "[createWell] Well data before removing staticWaterLevelCm:",
    JSON.stringify(wellData, null, 2),
  );

  // Remove staticWaterLevelCm karena sudah dikonversi
  const { staticWaterLevelCm, ...createData } = wellData;

  console.log(
    "[createWell] Create data (final):",
    JSON.stringify(createData, null, 2),
  );

  const result = await prisma.well.create({
    data: createData,
    select: WELL_SELECT,
  });

  console.log("[createWell] Successfully created well:", result.id);
  return result;
};

export const getWells = async (
  user: any,
  paginationParams?: PaginationParams,
  statusFilter?: string,
) => {
  const { page, limit } = parsePaginationParams(paginationParams || {});
  const skip = calculateSkip(page, limit);

  const validStatuses = ["draft", "pending_approval", "reviewed", "approved", "rejected"];
  const where = statusFilter && validStatuses.includes(statusFilter)
    ? { status: statusFilter as any }
    : undefined;

  if (user.role === "super_admin") {
    const [wells, total] = await Promise.all([
      prisma.well.findMany({
        where,
        select: WELL_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.well.count({ where }),
    ]);
    return formatPaginationResult(wells, total, page, limit);
  }

  if (user.role === "supervisor") {
    const [wells, total] = await Promise.all([
      prisma.well.findMany({
        where,
        select: WELL_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.well.count({ where }),
    ]);
    return formatPaginationResult(wells, total, page, limit);
  }

  // admin_perusahaan: see all their company's wells (all statuses)
  const companyId = await resolveCompanyId(user);
  if (!companyId) return formatPaginationResult([], 0, page, limit);

  const [wells, total] = await Promise.all([
    prisma.well.findMany({
      where: { companyId },
      select: WELL_SELECT,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.well.count({ where: { companyId } }),
  ]);
  return formatPaginationResult(wells, total, page, limit);
};

export const getWellById = async (id: string, user: any) => {
  const well = await prisma.well.findUnique({
    where: { id },
    select: WELL_SELECT,
  });

  if (!well) throw new Error(WELL_MESSAGES.NOT_FOUND);

  if (user.role !== "super_admin") {
    const companyId = await resolveCompanyId(user);
    if (!companyId || well.company.id !== companyId) {
      throw new Error(WELL_MESSAGES.FORBIDDEN);
    }
  }

  return well;
};

const buildWellUpdateData = async (
  well: WellRecord,
  data: UpdateWellInput,
  user: any,
) => {
  const updateData: UpdateWellInput & {
    companyId?: string;
    staticWaterLevel?: number;
  } = { ...data };

  if (data.businessId) {
    const business = await findBusinessForUser(data.businessId, user);
    updateData.companyId = business.companyId;
  }

  if (!data.businessId && well?.businessId) {
    updateData.businessId = well.businessId;
  }

  // Konversi staticWaterLevelCm (dari frontend) ke staticWaterLevel dalam meter
  if (data.staticWaterLevelCm !== undefined) {
    updateData.staticWaterLevel = convertCmToM(data.staticWaterLevelCm);
  }

  // Remove staticWaterLevelCm karena sudah dikonversi
  const { staticWaterLevelCm, ...finalUpdateData } = updateData as any;

  return finalUpdateData;
};

export const updateWell = async (
  id: string,
  data: UpdateWellInput,
  user: any,
) => {
  const well = await prisma.well.findUnique({
    where: { id },
    select: WELL_SELECT,
  });

  if (!well) throw new Error(WELL_MESSAGES.NOT_FOUND);

  if (user.role !== "super_admin") {
    const companyId = await resolveCompanyId(user);
    if (!companyId || well.company.id !== companyId) {
      throw new Error(WELL_MESSAGES.FORBIDDEN);
    }
  }

  const updateData = await buildWellUpdateData(well, data, user);

  return prisma.well.update({
    where: { id },
    data: updateData,
    select: WELL_SELECT,
  });
};

export const deleteWell = async (id: string, user: any) => {
  const well = await prisma.well.findUnique({
    where: { id },
    select: WELL_SELECT,
  });

  if (!well) throw new Error(WELL_MESSAGES.NOT_FOUND);

  if (user.role !== "super_admin") {
    const companyId = await resolveCompanyId(user);
    if (!companyId || well.company.id !== companyId) {
      throw new Error(WELL_MESSAGES.FORBIDDEN);
    }
  }

  await prisma.well.delete({
    where: { id },
  });

  return {
    id: well.id,
    name: well.name,
    business: well.business
      ? {
          id: well.business.id,
          name: well.business.name,
        }
      : null,
    company: {
      id: well.company.id,
      name: well.company.name,
    },
  };
};

export const verifyWell = async (id: string, user: any) => {
  // Only super_admin can verify wells
  if (user.role !== "super_admin") {
    throw new Error(WELL_MESSAGES.FORBIDDEN);
  }

  const well = await prisma.well.findUnique({
    where: { id },
    select: WELL_SELECT,
  });

  if (!well) throw new Error(WELL_MESSAGES.NOT_FOUND);

  return prisma.well.update({
    where: { id },
    data: {
      isVerified: true,
    },
    select: WELL_SELECT,
  });
};

// Get pending wells for super_admin approval
export const getPendingWells = async (
  user: any,
  paginationParams?: PaginationParams,
) => {
  // Only super_admin can view pending wells
  if (user.role !== "super_admin") {
    throw new Error(WELL_MESSAGES.FORBIDDEN);
  }

  const { page, limit } = parsePaginationParams(paginationParams || {});
  const skip = calculateSkip(page, limit);

  // Super admin sees all non-approved wells for management
  const nonApprovedWhere = { status: { notIn: ["approved"] as any } };
  const [wells, total] = await Promise.all([
    prisma.well.findMany({
      where: nonApprovedWhere,
      select: WELL_SELECT,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.well.count({ where: nonApprovedWhere }),
  ]);

  return formatPaginationResult(wells, total, page, limit);
};

// Approve a pending well submission
export const approvePendingWell = async (id: string, user: any) => {
  if (user.role !== "super_admin") {
    throw new Error(WELL_MESSAGES.FORBIDDEN);
  }

  const well = await prisma.well.findUnique({
    where: { id },
    select: WELL_SELECT,
  });

  if (!well) throw new Error(WELL_MESSAGES.NOT_FOUND);
  if (well.status !== "reviewed") {
    throw new Error("Sumur harus sudah ditinjau supervisor sebelum dapat disetujui");
  }

  const updated = await prisma.well.update({
    where: { id },
    data: { status: "approved", isVerified: true, supervisorNote: null },
    select: WELL_SELECT,
  });

  // Log audit trail
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name || "Unknown",
      action: "approve",
      target: "well",
      targetId: id,
      details: `Approved well: ${well.name}`,
      ip: "",
      severity: "info",
    },
  });

  return updated;
};

// Reject a pending well submission
export const rejectPendingWell = async (
  id: string,
  reason: string,
  user: any,
) => {
  if (user.role !== "super_admin") {
    throw new Error(WELL_MESSAGES.FORBIDDEN);
  }

  const well = await prisma.well.findUnique({
    where: { id },
    select: WELL_SELECT,
  });

  if (!well) throw new Error(WELL_MESSAGES.NOT_FOUND);
  if (!["draft", "pending_approval", "reviewed"].includes(well.status)) {
    throw new Error("Sumur hanya dapat ditolak saat berstatus pengajuan, sedang ditinjau, atau sudah ditinjau");
  }

  const updated = await prisma.well.update({
    where: { id },
    data: {
      status: "rejected",
      supervisorNote: reason || null,
    },
    select: WELL_SELECT,
  });

  // Log audit trail
  await prisma.auditLog.create({
    data: {
      userId: user.id,
      userName: user.name || "Unknown",
      action: "reject",
      target: "well",
      targetId: id,
      details: `Rejected well: ${well.name} - Reason: ${reason}`,
      oldData: JSON.stringify(well),
      ip: "",
      severity: "warning",
    },
  });

  return updated;
};

// Super admin sends a draft well to supervisor for review (draft → pending_approval)
export const processWell = async (id: string, user: any) => {
  if (user.role !== "super_admin") {
    throw new Error(WELL_MESSAGES.FORBIDDEN);
  }

  const well = await prisma.well.findUnique({
    where: { id },
    select: WELL_SELECT,
  });

  if (!well) throw new Error(WELL_MESSAGES.NOT_FOUND);
  if (well.status !== "draft") {
    throw new Error("Sumur harus berstatus pengajuan (draft) untuk dikirim ke supervisor");
  }

  return prisma.well.update({
    where: { id },
    data: { status: "pending_approval" },
    select: WELL_SELECT,
  });
};

// Supervisor fetches wells assigned for review (pending_approval)
export const getSupervisorWells = async (
  user: any,
  paginationParams?: PaginationParams,
) => {
  if (user.role !== "supervisor" && user.role !== "super_admin") {
    throw new Error(WELL_MESSAGES.FORBIDDEN);
  }

  const { page, limit } = parsePaginationParams(paginationParams || {});
  const skip = calculateSkip(page, limit);

  const [wells, total] = await Promise.all([
    prisma.well.findMany({
      where: { status: "pending_approval" },
      select: WELL_SELECT,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.well.count({ where: { status: "pending_approval" } }),
  ]);

  return formatPaginationResult(wells, total, page, limit);
};

// Supervisor flags a well with a note (data tidak sesuai) — stays pending_approval
export const flagWell = async (id: string, note: string, user: any) => {
  if (user.role !== "supervisor" && user.role !== "super_admin") {
    throw new Error(WELL_MESSAGES.FORBIDDEN);
  }

  const well = await prisma.well.findUnique({ where: { id }, select: WELL_SELECT });
  if (!well) throw new Error(WELL_MESSAGES.NOT_FOUND);
  if (well.status !== "pending_approval") {
    throw new Error("Hanya sumur yang sedang ditinjau yang dapat dilaporkan ketidaksesuaiannya");
  }

  return prisma.well.update({
    where: { id },
    data: { supervisorNote: note },
    select: WELL_SELECT,
  });
};

// Supervisor marks a well as reviewed and sends back to super_admin (pending_approval → reviewed)
export const reviewWell = async (id: string, user: any) => {
  if (user.role !== "supervisor" && user.role !== "super_admin") {
    throw new Error(WELL_MESSAGES.FORBIDDEN);
  }

  const well = await prisma.well.findUnique({
    where: { id },
    select: WELL_SELECT,
  });

  if (!well) throw new Error(WELL_MESSAGES.NOT_FOUND);
  if (well.status !== "pending_approval") {
    throw new Error("Sumur harus berstatus sedang ditinjau untuk dapat dikirim kembali ke super admin");
  }

  return prisma.well.update({
    where: { id },
    data: { status: "reviewed" },
    select: WELL_SELECT,
  });
};
