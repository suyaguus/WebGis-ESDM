/**
 * Utility untuk konversi satuan groundwater level
 */

/**
 * Convert staticWaterLevelCm (input dari frontend dalam CM) ke M untuk database
 * @param staticWaterLevelCm - Kedalaman muka air tanah dalam centimeter
 * @returns Kedalaman muka air tanah dalam meter (atau undefined jika input falsy)
 */
export const convertCmToM = (
  staticWaterLevelCm: number | undefined,
): number | undefined => {
  if (staticWaterLevelCm === undefined || staticWaterLevelCm === null) {
    return undefined;
  }
  return staticWaterLevelCm / 100;
};

/**
 * Convert staticWaterLevel (dalam M dari database) ke CM untuk display frontend
 * @param staticWaterLevelM - Kedalaman muka air tanah dalam meter
 * @returns Kedalaman muka air tanah dalam centimeter (atau undefined jika input falsy)
 */
export const convertMToCm = (
  staticWaterLevelM: number | null | undefined,
): number | undefined => {
  if (staticWaterLevelM === undefined || staticWaterLevelM === null) {
    return undefined;
  }
  return staticWaterLevelM * 100;
};
