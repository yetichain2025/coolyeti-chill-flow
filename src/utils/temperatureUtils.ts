
/**
 * Utility functions for temperature-related functionality
 */

// Helper function for temperature class styling
export function getTemperatureClass(current: number | null, target: number) {
  if (current === null) return "text-gray-400";
  
  // Calculate acceptable range (±2 degrees from target)
  const diff = Math.abs(current - target);
  if (diff <= 2) {
    return "text-green-600";
  } else if (diff <= 4) {
    return "text-amber-500";
  } else {
    return "text-red-500";
  }
}

// Helper function to check if temperature is in alert range
export function isTemperatureAlert(current: number | null, target: number): boolean {
  if (current === null) return false;
  return Math.abs(current - target) > 3;
}

// Helper function to format temperature for display
export function formatTemperature(temp: number | null): string {
  return temp !== null ? `${temp}°C` : 'N/A';
}
