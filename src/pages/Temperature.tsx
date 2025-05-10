
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TemperatureFilters } from "@/components/temperature/TemperatureFilters";
import { TemperatureOverview } from "@/components/temperature/TemperatureOverview";
import { ShipmentTemperatureList } from "@/components/temperature/ShipmentTemperatureList";
import { useShipments } from "@/hooks/useShipments";

function Temperature() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { shipments, isLoading } = useShipments();

  return (
    <div className="min-h-screen bg-muted/40 flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Temperature Monitoring</h1>
            <p className="text-muted-foreground">
              Monitor temperature across all shipments and storage units
            </p>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Temperature Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <TemperatureFilters 
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />
              <div className="mt-6">
                <TemperatureOverview />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Shipment Temperature Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ShipmentTemperatureList 
                shipments={shipments || []} 
                isLoading={isLoading}
                filter={activeFilter}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

export default Temperature;
