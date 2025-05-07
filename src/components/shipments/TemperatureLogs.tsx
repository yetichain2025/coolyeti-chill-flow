
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  AlertTriangle,
  CheckCircle,
  ThermometerIcon 
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TemperatureChart } from "@/components/dashboard/TemperatureChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TemperatureLog {
  id: string;
  shipment_id: string;
  temperature: number;
  recorded_at: string;
  location: string | null;
  device_id: string | null;
  is_alert: boolean;
}

interface TemperatureLogsProps {
  shipmentId: string;
  targetTemperature: number;
}

export function TemperatureLogs({ shipmentId, targetTemperature }: TemperatureLogsProps) {
  const fetchTemperatureLogs = async () => {
    const { data, error } = await supabase
      .from("temperature_logs")
      .select("*")
      .eq("shipment_id", shipmentId)
      .order("recorded_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    
    return data as TemperatureLog[];
  };

  const { 
    data: temperatureLogs, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["temperature-logs", shipmentId],
    queryFn: fetchTemperatureLogs,
    enabled: !!shipmentId,
  });

  if (isLoading) {
    return <TemperatureLogsSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 mb-4">
        <p className="font-medium">Error loading temperature logs</p>
        <p className="text-sm">{(error as Error).message}</p>
      </div>
    );
  }

  if (temperatureLogs?.length === 0) {
    return (
      <div className="p-6 text-center border border-dashed rounded-md bg-muted/20">
        <ThermometerIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-lg font-medium">No temperature data</h3>
        <p className="text-muted-foreground">
          This shipment doesn't have any temperature readings recorded yet.
        </p>
      </div>
    );
  }

  // Format data for chart
  const chartData = temperatureLogs ? 
    temperatureLogs
      .slice()
      .reverse()
      .map(log => ({
        time: format(new Date(log.recorded_at), "HH:mm"),
        temperature: log.temperature,
        date: format(new Date(log.recorded_at), "MMM dd"),
      })) : [];
      
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Temperature History</CardTitle>
          <CardDescription>
            Temperature logs for this shipment with target temperature of {targetTemperature}°C
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 && (
            <div className="h-72 w-full">
              <TemperatureHistoryChart 
                data={chartData} 
                targetTemperature={targetTemperature} 
              />
            </div>
          )}
        </CardContent>
      </Card>

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
            {temperatureLogs?.map((log) => (
              <TableRow key={log.id}>
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
    </div>
  );
}

function TemperatureHistoryChart({ data, targetTemperature }: { data: any[], targetTemperature: number }) {
  return (
    <div className="h-full w-full">
      {/* Use the data from the logs to render a chart */}
      {/* This is a placeholder - you would implement an actual chart here */}
      <div className="h-full flex items-center justify-center border rounded">
        <p className="text-muted-foreground">Temperature chart visualization goes here</p>
      </div>
    </div>
  );
}

function getTemperatureClass(current: number, target: number) {
  // Calculate acceptable range (±2 degrees from target)
  const diff = Math.abs(current - target);
  if (diff <= 2) {
    return "text-green-600";
  } else if (diff <= 4) {
    return "text-amber-500";
  } else {
    return "text-red-500";
  }
}

function TemperatureLogsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-72 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
