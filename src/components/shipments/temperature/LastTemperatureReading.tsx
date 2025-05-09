
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LastTemperatureReadingProps {
  lastReading: {
    temperature: number;
    is_alert: boolean | null;
    timestamp: string;
  } | null;
}

export function LastTemperatureReading({ lastReading }: LastTemperatureReadingProps) {
  if (!lastReading) return null;
  
  return (
    <div className="mb-4">
      <p className="text-sm font-medium">Last recorded temperature:</p>
      <div className="flex items-center gap-2 mt-1">
        <span 
          className={`text-lg font-bold ${
            lastReading.is_alert 
              ? "text-red-600" 
              : "text-green-600"
          }`}
        >
          {lastReading.temperature}°C
        </span>
        <span className="text-xs text-muted-foreground">
          {new Date(lastReading.timestamp).toLocaleString()}
        </span>
      </div>
      
      {lastReading.is_alert && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Temperature Alert</AlertTitle>
          <AlertDescription>
            This reading exceeds the acceptable temperature range for this shipment.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
