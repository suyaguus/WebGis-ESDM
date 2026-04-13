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

export const COMPANY_SELECT_DELETE: Prisma.CompanySelect = {
  id: true,
  name: true,
  email: true,
  type: true,
  createdBy: true,
};