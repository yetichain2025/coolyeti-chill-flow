
import { getTemperatureClass, formatTemperature } from "@/utils/temperatureUtils";

interface TemperatureDisplayProps {
  currentTemperature: number | null;
  targetTemperature: number;
}

export function TemperatureDisplay({ currentTemperature, targetTemperature }: TemperatureDisplayProps) {
  return (
    <>
      <span className={getTemperatureClass(currentTemperature, targetTemperature)}>
        {formatTemperature(currentTemperature)}
      </span>
      <span className="text-xs text-muted-foreground block">
        Target: {targetTemperature}°C
      </span>
    </>
  );
}
