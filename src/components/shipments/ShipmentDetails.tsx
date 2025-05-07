
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTabs,
  DialogTab,
  TabsContent,
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ShipmentType } from "@/types/shipment";
import { Thermometer, MapPin, Package, Calendar, Clock } from "lucide-react";
import { TemperatureLogs } from "./TemperatureLogs";

interface ShipmentDetailsProps {
  shipment: ShipmentType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShipmentDetails({ shipment, open, onOpenChange }: ShipmentDetailsProps) {
  if (!shipment) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Shipment {shipment.shipment_id}</DialogTitle>
          <DialogDescription>
            Details for this cold chain shipment
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Shipment Details</TabsTrigger>
            <TabsTrigger value="temperature">Temperature Logs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Destination</p>
                <p className="text-muted-foreground">{shipment.destination}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Product</p>
                <p className="text-muted-foreground">{shipment.product}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Thermometer className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Temperature</p>
                <p className="text-muted-foreground">
                  Current: {shipment.current_temperature !== null ? `${shipment.current_temperature}°C` : 'Not available'}
                  <br />
                  Target: {shipment.target_temperature}°C
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Departure Date</p>
                <p className="text-muted-foreground">
                  {format(new Date(shipment.departure_date), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
            
            {shipment.estimated_arrival && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Estimated Arrival</p>
                  <p className="text-muted-foreground">
                    {format(new Date(shipment.estimated_arrival), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            )}
            
            <div className="border-t pt-3 mt-3">
              <p className="text-xs text-muted-foreground">
                Created: {format(new Date(shipment.created_at), "MMM d, yyyy 'at' h:mm a")}
                <br />
                Last updated: {format(new Date(shipment.updated_at), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="temperature">
            <div className="py-4">
              <TemperatureLogs 
                shipmentId={shipment.shipment_id} 
                targetTemperature={shipment.target_temperature}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
