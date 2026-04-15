import prisma from "../../config/prisma";
import { CreateBusinessInput, UpdateBusinessInput } from "./business.type";
import { BUSINESS_SELECT } from "../../constants/business/business.select";
import { BUSINESS_MESSAGES } from "../../constants/business/business.message";

// create
export const createBusiness = async (data: CreateBusinessInput, user: any) => {
  if (!data.companyId) {
    throw new Error(BUSINESS_MESSAGES.COMPANY_REQUIRED);
  }

  const company = await prisma.company.findUnique({
    where: { id: data.companyId },
  });

  if (!company) throw new Error(BUSINESS_MESSAGES.COMPANY_NOT_FOUND);

  if (user.role !== "super_admin" && company.createdBy !== user.id) {
    throw new Error(BUSINESS_MESSAGES.FORBIDDEN.ACCESS);
  }

  return prisma.business.create({
    data,
    select: BUSINESS_SELECT,
  });
};

// get all
export const getBusinesses = async (user: any) => {
  if (user.role === "super_admin") {
    return prisma.business.findMany({
      select: BUSINESS_SELECT,
    });
  }

  return prisma.business.findMany({
    where: {
      company: {
        createdBy: user.id,
      },
    },
    select: BUSINESS_SELECT,
  });
};

// get by id
export const getBusinessById = async (id: string, user: any) => {
  const business = await prisma.business.findUnique({
    where: { id },
    select: BUSINESS_SELECT,
  });

  if (!business) throw new Error(BUSINESS_MESSAGES.NOT_FOUND);

  if (user.role !== "super_admin" && business.company.createdBy !== user.id) {
    throw new Error(BUSINESS_MESSAGES.FORBIDDEN.ACCESS);
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

  if (user.role !== "super_admin" && business.company.createdBy !== user.id) {
    throw new Error(BUSINESS_MESSAGES.FORBIDDEN.UPDATE);
  }

  return prisma.business.update({
    where: { id },
    data,
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

  if (user.role !== "super_admin" && business.company.createdBy !== user.id) {
    throw new Error(BUSINESS_MESSAGES.FORBIDDEN.DELETE);
  }

  await prisma.business.delete({
    where: { id },
  });

  return business;
};
