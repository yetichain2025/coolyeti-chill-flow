
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipmentList } from "@/components/shipments/ShipmentList";
import { AddTemperatureReading } from "@/components/shipments/AddTemperatureReading";
import { ShipmentType } from "@/types/shipment";
import { TemperatureAlerts } from "@/components/shipments/alerts/TemperatureAlerts";
import { NewShipmentDialog } from "@/components/shipments/NewShipmentDialog";
import { useToast } from "@/hooks/use-toast";

interface ShipmentsContentProps {
  shipments: ShipmentType[];
  isLoading: boolean;
  onRefetch: () => void;
  temperatureAlerts: ShipmentType[];
  onDismissAlert: (shipmentId: string) => void;
}

export function ShipmentsContent({ 
  shipments, 
  isLoading, 
  onRefetch,
  temperatureAlerts,
  onDismissAlert 
}: ShipmentsContentProps) {
  const [isNewShipmentDialogOpen, setIsNewShipmentDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentType | null>(null);
  const { toast } = useToast();

  const handleShipmentAdded = () => {
    onRefetch();
    setIsNewShipmentDialogOpen(false);
    toast({
      title: "Shipment created",
      description: "Your new shipment has been created successfully.",
    });
  };

  const handleTemperatureAdded = () => {
    onRefetch();
    toast({
      title: "Temperature recorded",
      description: "The temperature reading has been recorded successfully.",
    });
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
          <p className="text-muted-foreground">
            Manage and track your cold chain shipments
          </p>
        </div>
        <Button onClick={() => setIsNewShipmentDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Shipment
        </Button>
      </div>
      
      <TemperatureAlerts 
        alerts={temperatureAlerts}
        onDismiss={onDismissAlert}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>All Shipments</CardTitle>
            <CardDescription>
              View and manage all your cold chain shipments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ShipmentList 
              shipments={shipments || []} 
              isLoading={isLoading} 
              onSelectShipment={setSelectedShipment}
            />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          {selectedShipment && (
            <AddTemperatureReading 
              shipmentId={selectedShipment.shipment_id} 
              onReadingAdded={handleTemperatureAdded}
            />
          )}
          
          {!selectedShipment && (
            <Card>
              <CardHeader>
                <CardTitle>Temperature Management</CardTitle>
                <CardDescription>
                  Select a shipment to record temperature readings
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Select a shipment from the list to record or view temperature readings
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <NewShipmentDialog 
        open={isNewShipmentDialogOpen}
        onOpenChange={setIsNewShipmentDialogOpen}
        onShipmentAdded={handleShipmentAdded}
      />
    </>
  );
}
