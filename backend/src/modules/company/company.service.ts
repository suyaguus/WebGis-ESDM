import prisma from "../../config/prisma";
import { COMPANY_SELECT } from "../../constants/company/company.select";
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
  const where =
    user.role === "super_admin" ? {} : { isActive: true, createdBy: user.id };

  return prisma.company.findMany({
    where,
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

  if (user.role !== "super_admin" && company.creator?.id !== user.id) {
    throw new Error(COMPANY_MESSAGES.FORBIDDEN.VIEW);
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

  if (user.role !== "super_admin" && company.createdBy !== user.id) {
    throw new Error(COMPANY_MESSAGES.FORBIDDEN.UPDATE);
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
    select: {
      id: true,
      name: true,
      email: true,
      type: true,
      createdBy: true,
    },
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
