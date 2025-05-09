
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShipmentType } from "@/types/shipment";

const fetchRecentShipments = async () => {
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

export function ShipmentTable() {
  const { data: shipments = [], isLoading } = useQuery({
    queryKey: ["recent-shipments"],
    queryFn: fetchRecentShipments,
    // Only show static data if we're loading or there's an error
    placeholderData: [],
  });

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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// Helper functions
function getTemperatureClass(current: number | null, target: number) {
  if (current === null) return "";
  
  // Calculate acceptable range (±2 degrees from target)
  const diff = Math.abs((current || 0) - target);
  if (diff <= 2) {
    return "text-green-600";
  } else if (diff <= 4) {
    return "text-amber-500";
  } else {
    return "text-red-500";
  }
}

function getStatusColor(status: string) {
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
}

function getETADisplay(shipment: ShipmentType | any) {
  if (shipment.status === "Delivered") {
    return "-";
  }
  
  // For demo data
  if (shipment.eta) {
    return shipment.eta;
  }
  
  // For real data
  if (shipment.estimated_arrival) {
    const now = new Date();
    const eta = new Date(shipment.estimated_arrival);
    const diffHours = Math.round((eta.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      const days = Math.floor(diffHours / 24);
      return `${days}d`;
    }
  }
  
  return "N/A";
}

// Demo data for initial display
function getDemoShipments() {
  return [
    {
      shipment_id: 'SH-12345',
      destination: 'Jakarta Cold Storage',
      product: 'Frozen Seafood',
      target_temperature: -18,
      current_temperature: -18.2,
      departureDate: '2025-05-05',
      status: 'In Transit',
      eta: '3h 15m',
    },
    {
      shipment_id: 'SH-12346',
      destination: 'Medan Distribution',
      product: 'Dairy Products',
      target_temperature: 2,
      current_temperature: 2.1,
      departureDate: '2025-05-04',
      status: 'Delivered',
      eta: '-',
    },
    {
      shipment_id: 'SH-12347',
      destination: 'Surabaya Market',
      product: 'Vaccines',
      target_temperature: 3,
      current_temperature: 3.2,
      departureDate: '2025-05-05',
      status: 'In Transit',
      eta: '1h 45m',
    },
    {
      shipment_id: 'SH-12348',
      destination: 'Makassar Medical',
      product: 'Pharmaceuticals',
      target_temperature: 2,
      current_temperature: 2.9,
      departureDate: '2025-05-05',
      status: 'Delayed',
      eta: '5h 30m',
    },
    {
      shipment_id: 'SH-12349',
      destination: 'Batam Cold Chain',
      product: 'Fresh Produce',
      target_temperature: 3,
      current_temperature: 3.5,
      departureDate: '2025-05-03',
      status: 'Delivered',
      eta: '-',
    },
  ];
}
