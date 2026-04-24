import prisma from "../../config/prisma";
import {
  COMPANY_SELECT,
  COMPANY_SELECT_DELETE,
} from "../../constants/company/company.select";
import { COMPANY_MESSAGES } from "../../constants/company/company.message";
import { CreateCompanyInput, UpdateCompanyInput } from "./company.type";
import { resolveCompanyId } from "../../utils/company-access";
import {
  parsePaginationParams,
  formatPaginationResult,
  calculateSkip,
  PaginationParams,
} from "../../utils/pagination";

// CREATE
export const createCompany = async (
  data: CreateCompanyInput,
  userId: string,
) => {
  return prisma.company.create({
    data: {
      ...data,
      createdBy: userId,
    },
  });
};

// GET ALL (ONLY ACTIVE)
export const getCompanies = async (
  user: any,
  paginationParams?: PaginationParams,
) => {
  const { page, limit } = parsePaginationParams(paginationParams || {});
  const skip = calculateSkip(page, limit);

  if (user.role === "super_admin") {
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where: {},
        select: COMPANY_SELECT,
        skip,
        take: limit,
      }),
      prisma.company.count({ where: {} }),
    ]);
    return formatPaginationResult(companies, total, page, limit);
  }

  if (user.role === "admin_perusahaan") {
    const companyId = await resolveCompanyId(user);
    if (!companyId) return formatPaginationResult([], 0, page, limit);
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where: { id: companyId, isActive: true },
        select: COMPANY_SELECT,
        skip,
        take: limit,
      }),
      prisma.company.count({ where: { id: companyId, isActive: true } }),
    ]);
    return formatPaginationResult(companies, total, page, limit);
  }

  // role lain: hanya tampilkan company aktif yang terkait
  const [companies, total] = await Promise.all([
    prisma.company.findMany({
      where: { isActive: true },
      select: COMPANY_SELECT,
      skip,
      take: limit,
    }),
    prisma.company.count({ where: { isActive: true } }),
  ]);
  return formatPaginationResult(companies, total, page, limit);
};

// GET BY ID
export const getCompanyById = async (id: string, user: any) => {
  const company = await prisma.company.findUnique({
    where: { id },
    select: COMPANY_SELECT,
  });

  if (!company) throw new Error(COMPANY_MESSAGES.NOT_FOUND);

  if (user.role !== "super_admin") {
    const companyId = await resolveCompanyId(user);
    if (companyId !== id) {
      throw new Error(COMPANY_MESSAGES.FORBIDDEN.VIEW);
    }
  }
  return company;
};

// UPDATE
export const updateCompany = async (
  id: string,
  data: UpdateCompanyInput,
  user: any,
) => {
  const company = await prisma.company.findUnique({
    where: { id },
  });

  if (!company) throw new Error(COMPANY_MESSAGES.NOT_FOUND);

  if (user.role !== "super_admin") {
    const companyId = await resolveCompanyId(user);
    if (companyId !== id) {
      throw new Error(COMPANY_MESSAGES.FORBIDDEN.UPDATE);
    }
  }

  return prisma.company.update({
    where: { id },
    data,
  });
};

// DELETE (WITH VALIDATION)
export const deleteCompany = async (id: string, user: any) => {
  const company = await prisma.company.findUnique({
    where: { id },
    select: COMPANY_SELECT_DELETE,
  });

  if (!company) throw new Error(COMPANY_MESSAGES.NOT_FOUND);

  if (user.role !== "super_admin" && company.createdBy !== user.id) {
    throw new Error(COMPANY_MESSAGES.FORBIDDEN.DELETE);
  }

  await prisma.company.delete({
    where: { id },
  });

  return company;
};

// DEACTIVATE
export const deactivateCompany = async (id: string) => {
  return prisma.company.update({
    where: { id },
    data: { isActive: false },
  });
};

// ACTIVATE
export const activateCompany = async (id: string) => {
  return prisma.company.update({
    where: { id },
    data: { isActive: true },
  });
};
