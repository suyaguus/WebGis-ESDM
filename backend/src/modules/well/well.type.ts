import { WellType } from "@prisma/client";

export type CreateWellInput = {
  name: string;
  companyId: string;
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
};

export type UpdateWellInput = Partial<CreateWellInput>;
