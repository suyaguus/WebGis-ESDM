import { Prisma } from "@prisma/client";

export const COMPANY_SELECT: Prisma.CompanySelect = {
  id: true,
  name: true,
  address: true,
  email: true,
  phone: true,
  type: true,
  isVerified: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,

  creator: {
    select: {
      id: true,
      name: true,
      role: true,
    },
  },
};

export const COMPANY_MESSAGES = {
  NOT_FOUND: "Company tidak ditemukan",

  FORBIDDEN: {
    VIEW: "Forbidden: Anda tidak memiliki akses ke company ini",
    UPDATE: "Forbidden: Anda tidak memiliki akses untuk mengupdate company ini",
    DELETE: "Forbidden: Anda tidak memiliki akses untuk menghapus company ini",
  },
};