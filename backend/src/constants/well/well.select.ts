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

  supervisorNote: true,
  createdAt: true,
  updatedAt: true,
  isActive: true,
  isVerified: true,
  status: true,
  createdBy: true,

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

// Optimized select untuk map/peta - minimal fields needed
export const WELL_SELECT_MINIMAL: Prisma.WellSelect = {
  id: true,
  name: true,
  businessId: true,
  latitude: true,
  longitude: true,
  locationDescription: true,
  wellType: true,
  staticWaterLevel: true,
  waterLevelTrend: true,
  lastWaterLevelMeasurement: true,
  isActive: true,
  isVerified: true,
  status: true,
  createdAt: true,
  updatedAt: true,

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
    },
  },
};
