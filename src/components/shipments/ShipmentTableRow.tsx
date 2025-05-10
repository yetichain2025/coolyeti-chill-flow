
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { ShipmentType } from "@/types/shipment";
import { StatusBadge } from "./StatusBadge";
import { TemperatureDisplay } from "./TemperatureDisplay";

interface ShipmentTableRowProps {
  shipment: ShipmentType;
  onSelect: (shipment: ShipmentType) => void;
  onDetailsClick: (shipment: ShipmentType) => void;
}

export function ShipmentTableRow({ 
  shipment, 
  onSelect, 
  onDetailsClick 
}: ShipmentTableRowProps) {
  return (
    <TableRow 
      key={shipment.shipment_id} 
      className="cursor-pointer hover:bg-muted" 
      onClick={() => onSelect(shipment)}
    >
      <TableCell className="font-medium">{shipment.shipment_id}</TableCell>
      <TableCell>{shipment.destination}</TableCell>
      <TableCell>{shipment.product}</TableCell>
      <TableCell>
        <TemperatureDisplay 
          currentTemperature={shipment.current_temperature}
          targetTemperature={shipment.target_temperature}
        />
      </TableCell>
      <TableCell>
        <StatusBadge status={shipment.status} />
      </TableCell>
      <TableCell>
        {format(new Date(shipment.departure_date), "MMM d, yyyy")}
      </TableCell>
      <TableCell>
        {shipment.estimated_arrival ? format(new Date(shipment.estimated_arrival), "MMM d, yyyy") : "N/A"}
      </TableCell>
      <TableCell className="text-right">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onDetailsClick(shipment);
          }}
        >
          Details
        </Button>
      </TableCell>
    </TableRow>
  );
}
