
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ShipmentType } from "@/types/shipment";
import { Skeleton } from "@/components/ui/skeleton";
import { ShipmentDetails } from "@/components/shipments/ShipmentDetails";
import { useState } from "react";
import { ShipmentTableRow } from "./ShipmentTableRow";
import { EmptyShipmentState } from "./EmptyShipmentState";

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
    return <EmptyShipmentState />;
  }

  const handleShipmentSelect = (shipment: ShipmentType) => {
    if (onSelectShipment) {
      onSelectShipment(shipment);
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
              <ShipmentTableRow
                key={shipment.id}
                shipment={shipment}
                onSelect={handleShipmentSelect}
                onDetailsClick={setDetailsShipment}
              />
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
