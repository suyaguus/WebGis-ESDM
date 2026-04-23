import bcrypt from "bcrypt";
import prisma from "../../config/prisma";
import {
  CreateAdminPerusahaanInput,
  CreateUserInput,
  UpdateMeInput,
  UpdateUserInput,
} from "./user.type";
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

// service untuk get semua data user dengan pagination
export const getUsers = async (page: number = 1, limit: number = 5) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      select: USER_SELECT,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count(),
  ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
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
      isVerified: true,
    },
    select: USER_ACTIVATE_SELECT,
  });
};

// service untuk membuat admin_perusahaan beserta perusahaannya dalam 1 transaksi
export const createAdminPerusahaan = async (
  data: CreateAdminPerusahaanInput,
  creatorId: string,
) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new Error("Email sudah digunakan");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.$transaction(async (tx) => {
    // 1. Buat perusahaan
    const company = await tx.company.create({
      data: {
        name: data.companyName,
        address: data.companyAddress,
        email: data.companyEmail,
        phone: data.companyPhone,
        type: data.companyType,
        createdBy: creatorId,
        isVerified: true,
        isActive: true,
      },
    });

    // 2. Buat user admin_perusahaan dan langsung tautkan ke perusahaan
    const user = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        role: "admin_perusahaan",
        companyId: company.id,
        createdBy: creatorId,
        isVerified: true,
        isActive: true,
      },
      select: USER_SELECT,
    });

    return { user, company };
  });
};

// service untuk user update data dirinya sendiri (termasuk password)
export const updateMe = async (id: string, data: UpdateMeInput) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User tidak ditemukan");

  // Jika ingin ganti password, validasi currentPassword dulu
  if (data.newPassword) {
    if (!data.currentPassword) throw new Error("Password lama wajib diisi");
    const match = await bcrypt.compare(data.currentPassword, user.password);
    if (!match) throw new Error("Password lama tidak sesuai");
    if (data.newPassword.length < 8)
      throw new Error("Password baru minimal 8 karakter");
  }

  const updateData: Record<string, any> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.phone !== undefined) updateData.phone = data.phone;
  if (data.newPassword)
    updateData.password = await bcrypt.hash(data.newPassword, 10);

  return prisma.user.update({
    where: { id },
    data: updateData,
    select: USER_SELECT,
  });
};
