import { Prisma } from "@prisma/client";

export const REPORT_SELECT = Prisma.validator<Prisma.ReportSelect>()({
  id: true,
  waterDepth: true,
  waterUsage: true,
  waterQuality: true,
  description: true,
  photos: true,
  status: true,

  createdAt: true,
  approvedAt: true,

  well: {
    select: {
      id: true,
      name: true,
      company: {
        select: {
          id: true,
          name: true,
          createdBy: true,
        },
      },
    },
  },

  user: {
    select: {
      id: true,
      name: true,
      role: true,
    },
  },

  approver: {
    select: {
      id: true,
      name: true,
      role: true,
    },
  },
});
