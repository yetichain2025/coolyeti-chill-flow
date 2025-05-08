
export function getTemperatureClass(current: number, target: number) {
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
