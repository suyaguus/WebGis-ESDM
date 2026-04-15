import prisma from "../../config/prisma";
import { CreateWellInput } from "./well.type";

export const createWell = async (data: CreateWellInput, userId: string) => {
  return prisma.well.create({
    data: {
      ...data,
    },
  });
};

export const getWells = async () => {
  return prisma.well.findMany({
    include: {
      company: true,
      reports: true,
    },
  });
};

export const getWellById = async (id: string) => {
  return prisma.well.findUnique({
    where: { id },
    include: {
      company: true,
      reports: true,
    },
  });
};
