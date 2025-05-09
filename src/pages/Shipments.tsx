
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ShipmentsContent } from "@/components/shipments/ShipmentsContent";
import { useShipments } from "@/hooks/useShipments";
import { useTemperatureAlerts } from "@/hooks/useTemperatureAlerts";

const Shipments = () => {
  const { shipments, isLoading, refetch } = useShipments();
  const { temperatureAlerts, dismissAlert } = useTemperatureAlerts(refetch);

  return (
    <div className="min-h-screen bg-muted/40 flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 space-y-8">
          <ShipmentsContent 
            shipments={shipments || []}
            isLoading={isLoading}
            onRefetch={refetch}
            temperatureAlerts={temperatureAlerts}
            onDismissAlert={dismissAlert}
          />
        </main>
      </div>
    </div>
  );
};

export default Shipments;
