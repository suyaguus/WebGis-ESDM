import { WellType, WaterLevelTrend } from "@prisma/client";

export type CreateWellInput = {
  name: string;
  businessId: string;
  latitude?: number;
  longitude?: number;
  locationDescription?: string;
  wellType: WellType;

  depthMeter?: number;
  diameterInch?: number;
  casingDiameter?: number;
  pumpCapacity?: number;
  pumpDepth?: number;
  pipeDiameter?: number;

  // Groundwater level measurement (input dalam CM, akan dikonversi ke M di backend)
  staticWaterLevelCm?: number;
  waterLevelTrend?: WaterLevelTrend;
  lastWaterLevelMeasurement?: Date | string;
};

export type UpdateWellInput = Partial<CreateWellInput>;
