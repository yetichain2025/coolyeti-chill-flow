
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useToast } from "@/hooks/use-toast";

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
  const [logs, setLogs] = useState<TemperatureLog[]>([]);
  const { toast } = useToast();
  
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
    onSuccess: (data) => {
      setLogs(data);
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!shipmentId) return;

    const channel = supabase
      .channel('temp-logs-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'temperature_logs',
          filter: `shipment_id=eq.${shipmentId}`
        },
        (payload) => {
          const newLog = payload.new as TemperatureLog;
          
          // Add the new log to the state
          setLogs(prevLogs => [newLog, ...prevLogs]);
          
          // Show alert notification if temperature deviation is critical
          if (newLog.is_alert) {
            toast({
              title: "Temperature Alert!",
              description: `Temperature reading of ${newLog.temperature}°C exceeds threshold for shipment ${shipmentId}`,
              variant: "destructive",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shipmentId, toast]);

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

  const currentLogs = logs.length > 0 ? logs : temperatureLogs || [];

  if (currentLogs.length === 0) {
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
  const chartData = currentLogs
    .slice()
    .reverse()
    .slice(-20) // Just take last 20 readings for chart clarity
    .map(log => ({
      time: format(new Date(log.recorded_at), "HH:mm"),
      temperature: log.temperature,
      date: format(new Date(log.recorded_at), "MMM dd"),
      alert: log.is_alert,
    }));
      
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
              <TemperatureChart 
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
            {currentLogs.map((log) => (
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
    </div>
  );
}

function TemperatureChart({ data, targetTemperature }: { data: any[], targetTemperature: number }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => `${value}°C`} 
          labelFormatter={(label) => `Time: ${label}`}
        />
        <ReferenceLine 
          y={targetTemperature} 
          stroke="green" 
          strokeDasharray="3 3" 
          label={{ value: 'Target', position: 'left' }} 
        />
        <ReferenceLine 
          y={targetTemperature + 3} 
          stroke="red" 
          strokeDasharray="3 3" 
          label={{ value: 'Upper Limit', position: 'right' }} 
        />
        <ReferenceLine 
          y={targetTemperature - 3} 
          stroke="red" 
          strokeDasharray="3 3" 
          label={{ value: 'Lower Limit', position: 'left' }} 
        />
        <Line 
          type="monotone" 
          dataKey="temperature" 
          stroke="#0ea5e9" 
          strokeWidth={2}
          dot={{ stroke: '#0ea5e9', strokeWidth: 2, r: 4 }}
          activeDot={{ 
            stroke: '#0284c7', 
            strokeWidth: 2, 
            r: 6,
            fill: (entry: any) => entry.alert ? '#ef4444' : '#0ea5e9'
          }}
        />
      </LineChart>
    </ResponsiveContainer>
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
