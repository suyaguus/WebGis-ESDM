import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import { CreateUserInput, UpdateUserInput } from "./user.type";

export const createUser = async (data: CreateUserInput, creatorId: string) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      createdBy: creatorId,
    },
  });
};

export const getUsers = async () => {
  return prisma.user.findMany({
    include: {
      company: true,
    },
  });
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      company: true,
    },
  });
};

export const updateUser = async (id: string, data: UpdateUserInput) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const deactivateUser = async (id: string) => {
  return prisma.user.update({
    where: { id },
    data: {
      isActive: false,
    },
  });
};
