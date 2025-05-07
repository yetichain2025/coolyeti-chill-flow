
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ShipmentType } from "@/types/shipment";
import { Skeleton } from "@/components/ui/skeleton";
import { ShipmentDetails } from "@/components/shipments/ShipmentDetails";
import { useState } from "react";

interface ShipmentListProps {
  shipments: ShipmentType[];
  isLoading: boolean;
  onSelectShipment?: (shipment: ShipmentType) => void;
}

export function ShipmentList({ shipments, isLoading, onSelectShipment }: ShipmentListProps) {
  const [detailsShipment, setDetailsShipment] = useState<ShipmentType | null>(null);

  if (isLoading) {
    return <ShipmentListSkeleton />;
  }

  if (shipments.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No shipments found. Create your first shipment to get started.</p>
      </div>
    );
  }

  const handleShipmentSelect = (shipment: ShipmentType) => {
    if (onSelectShipment) {
      onSelectShipment(shipment);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Transit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Delayed":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getTemperatureClass = (current: number | null, target: number) => {
    if (current === null) return "";
    
    // Calculate acceptable range (±2 degrees from target)
    const diff = Math.abs(current - target);
    if (diff <= 2) {
      return "text-green-600";
    } else if (diff <= 4) {
      return "text-amber-500";
    } else {
      return "text-red-500";
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Temp (°C)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shipments.map((shipment) => (
              <TableRow 
                key={shipment.id} 
                className="cursor-pointer hover:bg-muted" 
                onClick={() => handleShipmentSelect(shipment)}
              >
                <TableCell className="font-medium">{shipment.shipment_id}</TableCell>
                <TableCell>{shipment.destination}</TableCell>
                <TableCell>{shipment.product}</TableCell>
                <TableCell>
                  <span className={getTemperatureClass(shipment.current_temperature, shipment.target_temperature)}>
                    {shipment.current_temperature !== null ? `${shipment.current_temperature}°C` : 'N/A'}
                  </span>
                  <span className="text-xs text-muted-foreground block">
                    Target: {shipment.target_temperature}°C
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(shipment.status)}>
                    {shipment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(shipment.departure_date), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  {shipment.estimated_arrival ? format(new Date(shipment.estimated_arrival), "MMM d, yyyy") : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    setDetailsShipment(shipment);
                  }}>
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <ShipmentDetails 
        shipment={detailsShipment} 
        open={!!detailsShipment} 
        onOpenChange={(open) => !open && setDetailsShipment(null)} 
      />
    </>
  );
}

function ShipmentListSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
}
