
import { AlertCircle, Check, ArrowRightCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Sample alerts data
const alerts = [
  {
    id: 1,
    title: "Temperature Alert: Freezer 1",
    description: "Temperature increased above threshold (-15°C)",
    severity: "high",
    time: "15 minutes ago",
    isNew: true,
  },
  {
    id: 2,
    title: "Shipment SH-12348 Delayed",
    description: "Delivery estimated to be delayed by 2 hours",
    severity: "medium",
    time: "1 hour ago",
    isNew: true,
  },
  {
    id: 3,
    title: "Battery Low: Sensor GT-45",
    description: "Sensor battery at 15%, needs replacement",
    severity: "low",
    time: "3 hours ago",
    isNew: false,
  },
  {
    id: 4,
    title: "Shipment SH-12346 Delivered",
    description: "Successfully delivered to Detroit Distribution",
    severity: "info",
    time: "5 hours ago",
    isNew: false,
  },
];

interface AlertItemProps {
  title: string;
  description: string;
  severity: "high" | "medium" | "low" | "info";
  time: string;
  isNew: boolean;
}

function AlertItem({ title, description, severity, time, isNew }: AlertItemProps) {
  return (
    <div className={cn(
      "flex items-start gap-4 rounded-lg border p-3", 
      isNew && "bg-accent bg-opacity-50"
    )}>
      <div className="mt-1">
        {severity === "high" && <AlertCircle className="h-5 w-5 text-red-500" />}
        {severity === "medium" && <AlertCircle className="h-5 w-5 text-amber-500" />}
        {severity === "low" && <AlertCircle className="h-5 w-5 text-blue-500" />}
        {severity === "info" && <Check className="h-5 w-5 text-green-500" />}
      </div>
      <div className="flex-1 space-y-1">
        <p className="font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
      <Button size="icon" variant="ghost" className="mt-1">
        <ArrowRightCircle className="h-4 w-4" />
        <span className="sr-only">View alert</span>
      </Button>
    </div>
  );
}

export function AlertsList() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Alerts</CardTitle>
          <Button variant="outline" size="sm">Mark All Read</Button>
        </div>
        <CardDescription>System alerts and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertItem
              key={alert.id}
              title={alert.title}
              description={alert.description}
              severity={alert.severity as "high" | "medium" | "low" | "info"}
              time={alert.time}
              isNew={alert.isNew}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
