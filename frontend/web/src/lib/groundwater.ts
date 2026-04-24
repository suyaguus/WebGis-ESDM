/**
 * Utility untuk konversi satuan groundwater level di frontend
 */

/**
 * Convert staticWaterLevel (dari API dalam M) ke CM untuk display
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

/**
 * Format groundwater level untuk display dengan unit CM
 * @param staticWaterLevelM - Kedalaman dalam meter
 * @returns String format "123.45 cm" atau "-" jika undefined
 */
export const formatGroundwaterLevel = (
  staticWaterLevelM: number | null | undefined,
): string => {
  const cm = convertMToCm(staticWaterLevelM);
  if (cm === undefined) return "-";
  return `${cm.toFixed(2)} cm`;
};

/**
 * Get color untuk water level trend
 */
export const getWaterLevelTrendColor = (
  trend: "rising" | "falling" | "stable" | "unknown" | null | undefined,
): string => {
  switch (trend) {
    case "rising":
      return "text-emerald-600"; // Naik = bagus
    case "falling":
      return "text-amber-600"; // Turun = perlu perhatian
    case "stable":
      return "text-blue-600"; // Stabil = normal
    case "unknown":
    default:
      return "text-slate-400";
  }
};

/**
 * Get label untuk water level trend
 */
export const getWaterLevelTrendLabel = (
  trend: "rising" | "falling" | "stable" | "unknown" | null | undefined,
): string => {
  switch (trend) {
    case "rising":
      return "Naik";
    case "falling":
      return "Turun";
    case "stable":
      return "Stabil";
    case "unknown":
    default:
      return "Tidak Diketahui";
  }
};
