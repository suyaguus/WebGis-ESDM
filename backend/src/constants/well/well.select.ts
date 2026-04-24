import { Prisma } from "@prisma/client";

export const WELL_SELECT: Prisma.WellSelect = {
  id: true,
  name: true,
  businessId: true,
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

  staticWaterLevel: true,
  waterLevelTrend: true,
  lastWaterLevelMeasurement: true,

  createdAt: true,
  updatedAt: true,
  isActive: true,
  isVerified: true,

  company: {
    select: {
      id: true,
      name: true,
    },
  },
  business: {
    select: {
      id: true,
      name: true,
      companyId: true,
    },
  },
};
