import prisma from "../../config/prisma";
import { CreateBusinessInput, UpdateBusinessInput } from "./business.type";

// create
export const createBusiness = async (data: CreateBusinessInput, user: any) => {
  if (!data.companyId) {
    throw new Error("companyId wajib diisi");
  }

  const company = await prisma.company.findUnique({
    where: { id: data.companyId },
  });

  if (!company) throw new Error("Company tidak ditemukan");

  if (user.role !== "super_admin" && company.createdBy !== user.id) {
    throw new Error("Forbidden");
  }

  return prisma.business.create({
    data,
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
      createdAt: true,

      company: {
        select: {
          id: true,
          name: true,
          email: true,
          type: true,
        },
      },
    },
  });
};

// get all
export const getBusinesses = async (user: any) => {
  return prisma.business.findMany({
    include: {
      company: {
        select: {
          id: true,
          name: true,
          email: true,
          type: true,
        },
      },
    },
  });
};

// get by id
export const getBusinessById = async (id: string, user: any) => {
  const business = await prisma.business.findUnique({
    where: { id },
    include: {
      company: true,
    },
  });

  if (!business) throw new Error("Business tidak ditemukan");

  if (user.role !== "super_admin" && business.company.createdBy !== user.id) {
    throw new Error("Forbidden");
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
    include: { company: true },
  });

  if (!business) throw new Error("Business tidak ditemukan");

  if (user.role !== "super_admin" && business.company.createdBy !== user.id) {
    throw new Error("Forbidden");
  }

  return prisma.business.update({
    where: { id },
    data,
  });
};

// delete
export const deleteBusiness = async (id: string, user: any) => {
  const business = await prisma.business.findUnique({
    where: { id },
    include: { company: true },
  });

  if (!business) throw new Error("Business tidak ditemukan");

  if (user.role !== "super_admin" && business.company.createdBy !== user.id) {
    throw new Error("Forbidden");
  }

  return prisma.business.delete({
    where: { id },
  });
};
