import { Prisma } from "@prisma/client";

export const WELL_SELECT: Prisma.WellSelect = {
  id: true,
  name: true,
  latitude: true,
  longitude: true,
  locationDescription: true,
  wellType: true,

  depthMeter: true,
  diameterInch: true,
  casingDiameter: true,
  pumpCapacity: true,
  pumpDepth: true,
  pipeDiameter: true,

  subsidenceRate: true,
  verticalValue: true,

  createdAt: true,
  updatedAt: true,
  isActive: true,

  company: {
    select: {
      id: true,
      name: true,
      createdBy: true,
    },
  },

  creator: {
    select: {
      id: true,
      name: true,
      role: true,
    },
  },
};
