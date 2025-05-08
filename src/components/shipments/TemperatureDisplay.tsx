
import { ShipmentType } from "@/types/shipment";

interface TemperatureDisplayProps {
  currentTemperature: number | null;
  targetTemperature: number;
}

export function TemperatureDisplay({ currentTemperature, targetTemperature }: TemperatureDisplayProps) {
  const getTemperatureClass = (current: number | null, target: number) => {
    if (current === null) return "";
    
    // Calculate acceptable range (±2 degrees from target)
    const diff = Math.abs(current - target);
    if (diff <= 2) {
      return "text-green-600";
    } else if (diff <= 4) {
      return "text-amber-500";
    } else {
      return "text-red-500";
    }
  };

  return (
    <>
      <span className={getTemperatureClass(currentTemperature, targetTemperature)}>
        {currentTemperature !== null ? `${currentTemperature}°C` : 'N/A'}
      </span>
      <span className="text-xs text-muted-foreground block">
        Target: {targetTemperature}°C
      </span>
    </>
  );
}
