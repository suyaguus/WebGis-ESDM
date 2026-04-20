import prisma from "../../config/prisma";
import { WELL_SELECT } from "../../constants/well/well.select";
import { WELL_MESSAGES } from "../../constants/well/well.message";
import { CreateWellInput, UpdateWellInput } from "./well.type";

export const createWell = async (data: CreateWellInput, user: any) => {
  const company = await prisma.company.findUnique({
    where: { id: data.companyId },
  });

  if (!company) throw new Error(WELL_MESSAGES.COMPANY_NOT_FOUND);

  if (user.role === "admin_perusahaan") {
    if (company.createdBy !== user.id) {
      throw new Error(WELL_MESSAGES.FORBIDDEN);
    }
  }

  return prisma.well.create({
    data: {
      ...data,
      createdBy: user.id,
    },
    select: WELL_SELECT,
  });
};

export const getWells = async (user: any) => {
  if (user.role === "super_admin") {
    return prisma.well.findMany({
      select: WELL_SELECT,
    });
  }

  return prisma.well.findMany({
    where: {
      company: {
        createdBy: user.id,
      },
    },
    select: WELL_SELECT,
  });
};

export const getWellById = async (id: string, user: any) => {
  const well = await prisma.well.findUnique({
    where: { id },
    select: WELL_SELECT,
  });

  if (!well) throw new Error(WELL_MESSAGES.NOT_FOUND);

  if (user.role !== "super_admin" && well.company.createdBy !== user.id) {
    throw new Error(WELL_MESSAGES.FORBIDDEN);
  }

  return well;
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

  if (user.role !== "super_admin" && well.company.createdBy !== user.id) {
    throw new Error(WELL_MESSAGES.FORBIDDEN);
  }

  return prisma.well.update({
    where: { id },
    data,
    select: WELL_SELECT,
  });
};

export const deleteWell = async (id: string, user: any) => {
  const well = await prisma.well.findUnique({
    where: { id },
    select: WELL_SELECT,
  });

  if (!well) throw new Error(WELL_MESSAGES.NOT_FOUND);

  if (user.role !== "super_admin" && well.company.createdBy !== user.id) {
    throw new Error(WELL_MESSAGES.FORBIDDEN);
  }

  await prisma.well.delete({
    where: { id },
  });

  return {
    id: well.id,
    name: well.name,
    company: {
      id: well.company.id,
      name: well.company.name,
    },
  };
};
