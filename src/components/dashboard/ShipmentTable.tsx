
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Sample shipment data
const shipments = [
  {
    id: 'SH-12345',
    destination: 'Jakarta Cold Storage',
    product: 'Frozen Seafood',
    temperature: -18.2,
    departureDate: '2025-05-05',
    status: 'In Transit',
    eta: '3h 15m',
  },
  {
    id: 'SH-12346',
    destination: 'Medan Distribution',
    product: 'Dairy Products',
    temperature: 2.1,
    departureDate: '2025-05-04',
    status: 'Delivered',
    eta: '-',
  },
  {
    id: 'SH-12347',
    destination: 'Surabaya Market',
    product: 'Vaccines',
    temperature: 3.2,
    departureDate: '2025-05-05',
    status: 'In Transit',
    eta: '1h 45m',
  },
  {
    id: 'SH-12348',
    destination: 'Makassar Medical',
    product: 'Pharmaceuticals',
    temperature: 2.9,
    departureDate: '2025-05-05',
    status: 'Delayed',
    eta: '5h 30m',
  },
  {
    id: 'SH-12349',
    destination: 'Batam Cold Chain',
    product: 'Fresh Produce',
    temperature: 3.5,
    departureDate: '2025-05-03',
    status: 'Delivered',
    eta: '-',
  },
];

export function ShipmentTable() {
  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active Shipments</CardTitle>
          <CardDescription>Monitor your cold chain shipments in real-time</CardDescription>
        </div>
        <Button>View All</Button>
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
            {shipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">{shipment.id}</TableCell>
                <TableCell>{shipment.destination}</TableCell>
                <TableCell>{shipment.product}</TableCell>
                <TableCell>
                  <span className={shipment.temperature > 4 || shipment.temperature < -20 ? "text-red-500" : "text-green-600"}>
                    {shipment.temperature}°C
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      shipment.status === "In Transit"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : shipment.status === "Delivered"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                    }
                  >
                    {shipment.status}
                  </Badge>
                </TableCell>
                <TableCell>{shipment.eta}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    Details
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
