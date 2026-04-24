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
  quota: true,
  quotaUsed: true,
  createdAt: true,
  updatedAt: true,

  businesses: {
    select: {
      id: true,
      name: true,
      address: true,
      phone: true,
      createdAt: true,
      _count: {
        select: {
          wells: true,
        },
      },
    },
  },

  wells: {
    select: {
      staticWaterLevel: true,
      waterLevelTrend: true,
    },
  },

  _count: {
    select: {
      wells: true,
      users: true,
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
