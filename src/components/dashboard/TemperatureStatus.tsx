
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TemperatureStatusItemProps {
  name: string;
  currentTemp: number;
  minTemp: number;
  maxTemp: number;
  status: "normal" | "warning" | "critical";
}

function TemperatureStatusItem({ 
  name, 
  currentTemp, 
  minTemp,
  maxTemp,
  status
}: TemperatureStatusItemProps) {
  // Calculate the percentage position of the current temperature in the range
  const range = maxTemp - minTemp;
  const position = ((currentTemp - minTemp) / range) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium">{name}</div>
        <div
          className={cn(
            "text-sm font-medium",
            status === "normal" && "text-green-600",
            status === "warning" && "text-amber-600",
            status === "critical" && "text-red-600"
          )}
        >
          {currentTemp}°C
        </div>
      </div>
      <div className="relative">
        <Progress value={position} className="h-2" />
        <div className="absolute flex w-full justify-between -mt-2 text-xs text-muted-foreground">
          <span>{minTemp}°C</span>
          <span>{maxTemp}°C</span>
        </div>
      </div>
    </div>
  );
}

export function TemperatureStatus() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Temperature Status</CardTitle>
        <CardDescription>Current readings from cold storage units</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TemperatureStatusItem
            name="Freezer 1"
            currentTemp={-18.2}
            minTemp={-25}
            maxTemp={-15}
            status="normal"
          />
          <TemperatureStatusItem
            name="Freezer 2"
            currentTemp={-17.3}
            minTemp={-25}
            maxTemp={-15}
            status="normal"
          />
          <TemperatureStatusItem
            name="Cooler 1"
            currentTemp={3.8}
            minTemp={2}
            maxTemp={4}
            status="warning"
          />
          <TemperatureStatusItem
            name="Cooler 2"
            currentTemp={3.1}
            minTemp={2}
            maxTemp={4}
            status="normal"
          />
          <TemperatureStatusItem
            name="Delivery Truck #103"
            currentTemp={2.4}
            minTemp={2}
            maxTemp={4}
            status="normal"
          />
        </div>
      </CardContent>
    </Card>
  );
}
