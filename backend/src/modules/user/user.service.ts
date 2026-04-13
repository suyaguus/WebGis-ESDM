import bcrypt from "bcrypt";
import prisma from "../../config/prisma";
import { CreateUserInput, UpdateUserInput } from "./user.type";
import { USER_ACTIVATE_SELECT, USER_SELECT } from "../../constants/user.select";

// service untuk create user baru
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

// service untuk get semua data user
export const getUsers = async () => {
  return prisma.user.findMany({
    select: USER_SELECT,
  });
};

// service untuk get data user berdasarkan id
export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: USER_SELECT,
  });
};

// service untuk update data user
export const updateUser = async (id: string, data: UpdateUserInput) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

// service untuk delete data user
export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};

// service untuk menonaktifkan account user berdasarkan id
export const deactivateUser = async (id: string) => {
  return prisma.user.update({
    where: { id },
    data: {
      isActive: false,
    },
    select: USER_ACTIVATE_SELECT,
  });
};

// function untuk restore account yang sudah dinonaktifkan
export const activateUser = async (id: string) => {
  return prisma.user.update({
    where: { id },
    data: {
      isActive: true,
    },
    select: USER_ACTIVATE_SELECT,
  });
};
