
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShipmentTableRow } from "./ShipmentTableRow";
import { useRecentShipments, getDemoShipments } from "@/hooks/useRecentShipments";

export function ShipmentTable() {
  const { data: shipments = [], isLoading } = useRecentShipments();

  // Fallback to demo data if no shipments are available yet
  const displayShipments = shipments.length > 0 ? shipments : getDemoShipments();

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active Shipments</CardTitle>
          <CardDescription>Monitor your cold chain shipments in real-time</CardDescription>
        </div>
        <Button asChild>
          <Link to="/shipments">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Temp (°C)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayShipments.map((shipment) => (
              <ShipmentTableRow 
                key={shipment.shipment_id} 
                shipment={shipment} 
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
