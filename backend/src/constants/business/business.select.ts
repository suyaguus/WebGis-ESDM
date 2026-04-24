import { Prisma } from "@prisma/client";

export const BUSINESS_SELECT: Prisma.BusinessSelect = {
  id: true,
  name: true,
  address: true,
  phone: true,
  createdAt: true,
  updatedAt: true,

  company: {
    select: {
      id: true,
      name: true,
      email: true,
      type: true,
      isVerified: true,
      createdBy: true,
    },
  },

  _count: {
    select: {
      wells: true,
    },
  },
};

export const BUSINESS_SELECT_DELETE = {
  id: true,
  name: true,

  company: {
    select: {
      id: true,
      name: true,
    },
  },
};
