
import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShipmentType } from "@/types/shipment";

interface TemperatureAlertsProps {
  alerts: ShipmentType[];
  onDismiss: (shipmentId: string) => void;
}

export function TemperatureAlerts({ alerts, onDismiss }: TemperatureAlertsProps) {
  if (alerts.length === 0) return null;
  
  return (
    <div className="space-y-3">
      {alerts.map(shipment => (
        <Alert key={shipment.shipment_id} variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Temperature Alert</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <div>
              Shipment {shipment.shipment_id} temperature is {shipment.current_temperature}°C, 
              which is outside the target of {shipment.target_temperature}°C (±3°C)
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onDismiss(shipment.shipment_id)}
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
