
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { ShipmentType } from "@/types/shipment";
import { getTemperatureClass, getStatusColor, getETADisplay } from "./utils/shipmentTableUtils";

interface ShipmentTableRowProps {
  shipment: ShipmentType | any;
}

export function ShipmentTableRow({ shipment }: ShipmentTableRowProps) {
  return (
    <TableRow key={shipment.shipment_id}>
      <TableCell className="font-medium">{shipment.shipment_id}</TableCell>
      <TableCell>{shipment.destination}</TableCell>
      <TableCell>{shipment.product}</TableCell>
      <TableCell>
        <span className={getTemperatureClass(shipment.current_temperature, shipment.target_temperature)}>
          {shipment.current_temperature !== null ? `${shipment.current_temperature}°C` : 'N/A'}
        </span>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={getStatusColor(shipment.status)}
        >
          {shipment.status}
        </Badge>
      </TableCell>
      <TableCell>{getETADisplay(shipment)}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/shipments?id=${shipment.shipment_id || ''}`}>
            Details
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}
