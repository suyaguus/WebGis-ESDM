import prisma from "../../config/prisma";
import { CreateBusinessInput, UpdateBusinessInput } from "./business.type";
import { BUSINESS_SELECT } from "../../constants/business/business.select";
import { BUSINESS_MESSAGES } from "../../constants/business/business.message";
import { resolveCompanyId } from "../../utils/company-access";
import {
  parsePaginationParams,
  formatPaginationResult,
  calculateSkip,
  PaginationParams,
} from "../../utils/pagination";

// create
export const createBusiness = async (data: CreateBusinessInput, user: any) => {
  if (user.role === "admin_perusahaan") {
    // admin_perusahaan hanya bisa membuat business untuk perusahaannya sendiri
    const companyId = await resolveCompanyId(user);
    if (!companyId) throw new Error(BUSINESS_MESSAGES.COMPANY_REQUIRED);
    data = { ...data, companyId };
  }

  if (!data.companyId) throw new Error(BUSINESS_MESSAGES.COMPANY_REQUIRED);

  const company = await prisma.company.findUnique({
    where: { id: data.companyId },
  });

  if (!company) throw new Error(BUSINESS_MESSAGES.COMPANY_NOT_FOUND);

  return prisma.business.create({
    data,
    select: BUSINESS_SELECT,
  });
};

// get all
export const getBusinesses = async (
  user: any,
  paginationParams?: PaginationParams,
) => {
  const { page, limit } = parsePaginationParams(paginationParams || {});
  const skip = calculateSkip(page, limit);

  if (user.role === "super_admin") {
    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        select: BUSINESS_SELECT,
        skip,
        take: limit,
      }),
      prisma.business.count(),
    ]);
    return formatPaginationResult(businesses, total, page, limit);
  }

  const companyId = await resolveCompanyId(user);
  if (!companyId) return formatPaginationResult([], 0, page, limit);

  const [businesses, total] = await Promise.all([
    prisma.business.findMany({
      where: { companyId },
      select: BUSINESS_SELECT,
      skip,
      take: limit,
    }),
    prisma.business.count({ where: { companyId } }),
  ]);
  return formatPaginationResult(businesses, total, page, limit);
};

// get by id
export const getBusinessById = async (id: string, user: any) => {
  const business = await prisma.business.findUnique({
    where: { id },
    select: BUSINESS_SELECT,
  });

  if (!business) throw new Error(BUSINESS_MESSAGES.NOT_FOUND);

  if (user.role !== "super_admin") {
    const companyId = await resolveCompanyId(user);
    if (business.company.id !== companyId)
      throw new Error(BUSINESS_MESSAGES.FORBIDDEN);
  }

  return business;
};

// update
export const updateBusiness = async (
  id: string,
  data: UpdateBusinessInput,
  user: any,
) => {
  const business = await prisma.business.findUnique({
    where: { id },
    select: BUSINESS_SELECT,
  });

  if (!business) throw new Error(BUSINESS_MESSAGES.NOT_FOUND);

  if (user.role !== "super_admin") {
    const companyId = await resolveCompanyId(user);
    if (business.company.id !== companyId)
      throw new Error(BUSINESS_MESSAGES.FORBIDDEN);
  }

  // strip companyId from update payload for non-super_admin
  const { companyId: _strip, ...safeData } = data as any;
  const updateData = user.role === "super_admin" ? data : safeData;

  return prisma.business.update({
    where: { id },
    data: updateData,
    select: BUSINESS_SELECT,
  });
};

// delete
export const deleteBusiness = async (id: string, user: any) => {
  const business = await prisma.business.findUnique({
    where: { id },
    select: BUSINESS_SELECT,
  });

  if (!business) throw new Error(BUSINESS_MESSAGES.NOT_FOUND);

  if (user.role !== "super_admin") {
    const companyId = await resolveCompanyId(user);
    if (business.company.id !== companyId)
      throw new Error(BUSINESS_MESSAGES.FORBIDDEN);
  }

  await prisma.business.delete({ where: { id } });

  return {
    id: business.id,
    name: business.name,
    company: {
      id: business.company.id,
      name: business.company.name,
    },
  };
};
