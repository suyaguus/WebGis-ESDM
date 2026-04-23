import prisma from "../../config/prisma";
import {
  COMPANY_SELECT,
  COMPANY_SELECT_DELETE,
} from "../../constants/company/company.select";
import { COMPANY_MESSAGES } from "../../constants/company/company.message";
import { CreateCompanyInput, UpdateCompanyInput } from "./company.type";

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
export const getCompanies = async (user: any) => {
  if (user.role === "super_admin") {
    return prisma.company.findMany({
      where: {},
      select: COMPANY_SELECT,
    });
  }

  if (user.role === "admin_perusahaan") {
    // Ambil companyId dari data user
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { companyId: true },
    });
    if (!dbUser?.companyId) return [];
    return prisma.company.findMany({
      where: { id: dbUser.companyId, isActive: true },
      select: COMPANY_SELECT,
    });
  }

  // role lain: hanya tampilkan company aktif yang terkait
  return prisma.company.findMany({
    where: { isActive: true },
    select: COMPANY_SELECT,
  });
};

// GET BY ID
export const getCompanyById = async (id: string, user: any) => {
  const company = await prisma.company.findUnique({
    where: { id },
    select: COMPANY_SELECT,
  });

  if (!company) throw new Error(COMPANY_MESSAGES.NOT_FOUND);

  if (user.role !== "super_admin") {
    // admin_perusahaan hanya boleh akses company miliknya
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { companyId: true },
    });
    if (dbUser?.companyId !== id) {
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
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { companyId: true },
    });
    if (dbUser?.companyId !== id) {
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
