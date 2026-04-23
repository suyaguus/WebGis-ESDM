import prisma from "../../config/prisma";
import { CreateBusinessInput, UpdateBusinessInput } from "./business.type";
import { BUSINESS_SELECT } from "../../constants/business/business.select";
import { BUSINESS_MESSAGES } from "../../constants/business/business.message";

/** Resolve companyId untuk admin_perusahaan dari DB user record */
async function resolveCompanyId(user: any): Promise<string | null> {
  if (user.role === "super_admin") return null; // super_admin tidak perlu filter
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { companyId: true },
  });
  return dbUser?.companyId ?? null;
}

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
export const getBusinesses = async (user: any) => {
  if (user.role === "super_admin") {
    return prisma.business.findMany({ select: BUSINESS_SELECT });
  }

  const companyId = await resolveCompanyId(user);
  if (!companyId) return [];

  return prisma.business.findMany({
    where: { companyId },
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
