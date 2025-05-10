
/**
 * Formats a temperature value with the degree symbol
 */
export function formatTemperature(temperature: number | null): string {
  if (temperature === null) return "N/A";
  return `${temperature.toFixed(1)}°C`;
}

/**
 * Determines if a temperature is outside the acceptable range
 */
export function isTemperatureAlert(
  currentTemperature: number,
  targetTemperature: number,
  threshold: number = 3
): boolean {
  if (currentTemperature === null) return false;
  const diff = Math.abs(currentTemperature - targetTemperature);
  return diff > threshold;
}

/**
 * Returns the appropriate CSS class for temperature display based on deviation from target
 */
export function getTemperatureClass(
  currentTemperature: number | null,
  targetTemperature: number
): string {
  if (currentTemperature === null) return "text-gray-400";

  const diff = Math.abs(currentTemperature - targetTemperature);

  if (diff <= 2) return "text-green-600 font-medium";
  if (diff <= 4) return "text-amber-600 font-medium";
  return "text-red-600 font-medium";
}

/**
 * Returns the temperature status based on deviation from target
 */
export function getTemperatureStatus(
  currentTemperature: number | null,
  targetTemperature: number
): "normal" | "warning" | "critical" | "unknown" {
  if (currentTemperature === null) return "unknown";

  const diff = Math.abs(currentTemperature - targetTemperature);

  if (diff <= 2) return "normal";
  if (diff <= 4) return "warning";
  return "critical";
}
