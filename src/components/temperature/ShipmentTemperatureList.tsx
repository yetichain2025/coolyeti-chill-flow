
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShipmentType } from "@/types/shipment";
import { TemperatureDisplay } from "@/components/shipments/TemperatureDisplay";
import { getTemperatureClass } from "@/utils/temperatureUtils";
import { Skeleton } from "@/components/ui/skeleton";

interface ShipmentTemperatureListProps {
  shipments: ShipmentType[];
  isLoading: boolean;
  filter: string;
}

export function ShipmentTemperatureList({ shipments, isLoading, filter }: ShipmentTemperatureListProps) {
  // Filter shipments based on temperature status
  const filteredShipments = shipments.filter(shipment => {
    if (filter === "all") return true;
    if (shipment.current_temperature === null) return false;
    
    const diff = Math.abs((shipment.current_temperature || 0) - shipment.target_temperature);
    
    if (filter === "normal" && diff <= 2) return true;
    if (filter === "warning" && diff > 2 && diff <= 4) return true;
    if (filter === "critical" && diff > 4) return true;
    
    return false;
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (filteredShipments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No shipments match the current filter
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Shipment ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Current Temp</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredShipments.map((shipment) => {
            const tempClass = getTemperatureClass(shipment.current_temperature, shipment.target_temperature);
            let status = "Normal";
            
            if (shipment.current_temperature !== null) {
              const diff = Math.abs((shipment.current_temperature || 0) - shipment.target_temperature);
              if (diff > 4) status = "Critical";
              else if (diff > 2) status = "Warning";
            }
            
            return (
              <TableRow key={shipment.id || shipment.shipment_id}>
                <TableCell className="font-medium">{shipment.shipment_id}</TableCell>
                <TableCell>{shipment.product}</TableCell>
                <TableCell>
                  <TemperatureDisplay 
                    currentTemperature={shipment.current_temperature}
                    targetTemperature={shipment.target_temperature}
                  />
                </TableCell>
                <TableCell>{shipment.target_temperature}°C</TableCell>
                <TableCell>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${status === "Normal" ? "bg-green-100 text-green-800" : ""}
                    ${status === "Warning" ? "bg-amber-100 text-amber-800" : ""}
                    ${status === "Critical" ? "bg-red-100 text-red-800" : ""}
                  `}>
                    {status}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
