
import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TemperatureStatus } from "@/components/dashboard/TemperatureStatus";
import { TemperatureFilters } from "@/components/temperature/TemperatureFilters";
import { TemperatureOverview } from "@/components/temperature/TemperatureOverview";
import { ShipmentTemperatureList } from "@/components/temperature/ShipmentTemperatureList";
import { useTemperatureAlerts } from "@/hooks/useTemperatureAlerts";
import { useShipments } from "@/hooks/useShipments";

export default function Temperature() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { shipments, isLoading, refetch } = useShipments();
  const { temperatureAlerts, dismissAlert } = useTemperatureAlerts(refetch);

  return (
    <div className="min-h-screen bg-muted/40 flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Temperature Monitoring</h1>
            <p className="text-muted-foreground">
              Monitor and manage temperature across all shipments and storage units
            </p>
          </div>

          {temperatureAlerts.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-red-600">Active Temperature Alerts</h2>
              {temperatureAlerts.map((alert) => (
                <Card key={alert.id} className="border-red-300 bg-red-50 dark:bg-red-900/20">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">Shipment {alert.shipment_id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Current: {alert.current_temperature}°C | Target: {alert.target_temperature}°C
                        </p>
                      </div>
                      <button 
                        onClick={() => dismissAlert(alert.shipment_id)}
                        className="px-3 py-1 rounded border border-red-300 text-sm hover:bg-red-100"
                      >
                        Dismiss
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader className="pb-3">
                <CardTitle>Temperature Overview</CardTitle>
                <CardDescription>
                  Current temperature status across all monitored shipments
                </CardDescription>
                <TemperatureFilters 
                  activeFilter={activeFilter} 
                  setActiveFilter={setActiveFilter}
                />
              </CardHeader>
              <CardContent className="pt-2">
                <TemperatureOverview />
              </CardContent>
            </Card>

            <TemperatureStatus />
            
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Shipment Temperatures</CardTitle>
                <CardDescription>
                  Current temperature readings for all active shipments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ShipmentTemperatureList 
                  shipments={shipments || []} 
                  isLoading={isLoading}
                  filter={activeFilter}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
