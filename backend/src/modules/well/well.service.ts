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

  if (!business) throw new Error(WELL_MESSAGES.BUSINESS_NOT_FOUND);

  if (user.role === "super_admin") return business;

  const companyId = await resolveCompanyId(user);
  if (!companyId || business.companyId !== companyId) {
    throw new Error(WELL_MESSAGES.FORBIDDEN);
  }

  return business;
};

export const createWell = async (data: CreateWellInput, user: any) => {
  if (!data.businessId) throw new Error(WELL_MESSAGES.BUSINESS_REQUIRED);

  const business = await findBusinessForUser(data.businessId, user);

  // Konversi staticWaterLevelCm (dari frontend) ke staticWaterLevel dalam meter
  const wellData = {
    ...data,
    companyId: business.companyId,
    createdBy: user.id,
    staticWaterLevel: convertCmToM(data.staticWaterLevelCm),
  };

  // Remove staticWaterLevelCm karena sudah dikonversi
  const { staticWaterLevelCm, ...createData } = wellData;

  return prisma.well.create({
    data: createData,
    select: WELL_SELECT,
  });
};

export const getWells = async (
  user: any,
  paginationParams?: PaginationParams,
) => {
  const { page, limit } = parsePaginationParams(paginationParams || {});
  const skip = calculateSkip(page, limit);

  if (user.role === "super_admin") {
    const [wells, total] = await Promise.all([
      prisma.well.findMany({
        select: WELL_SELECT,
        skip,
        take: limit,
      }),
      prisma.well.count(),
    ]);
    return formatPaginationResult(wells, total, page, limit);
  }

  const companyId = await resolveCompanyId(user);
  if (!companyId) return formatPaginationResult([], 0, page, limit);

  const [wells, total] = await Promise.all([
    prisma.well.findMany({
      where: {
        companyId,
      },
      select: WELL_SELECT,
      skip,
      take: limit,
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
