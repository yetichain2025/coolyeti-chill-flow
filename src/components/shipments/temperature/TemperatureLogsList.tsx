
import { format } from "date-fns";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { TemperatureLog } from "../types/temperatureTypes";
import { getTemperatureClass } from "../utils/temperatureUtils";

interface TemperatureLogsListProps {
  logs: TemperatureLog[];
  targetTemperature: number;
}

export function TemperatureLogsList({ logs, targetTemperature }: TemperatureLogsListProps) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Temperature (°C)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id} className={log.is_alert ? "bg-red-50 dark:bg-red-900/20" : ""}>
              <TableCell>
                {format(new Date(log.recorded_at), "MMM d, yyyy HH:mm")}
              </TableCell>
              <TableCell className={`font-medium ${getTemperatureClass(log.temperature, targetTemperature)}`}>
                {log.temperature}°C
              </TableCell>
              <TableCell>
                {log.is_alert ? (
                  <div className="flex items-center text-amber-600">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    <span>Alert</span>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>Normal</span>
                  </div>
                )}
              </TableCell>
              <TableCell>{log.device_id || 'Unknown'}</TableCell>
              <TableCell>{log.location || 'Unknown'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
