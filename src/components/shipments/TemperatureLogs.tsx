
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { TemperatureLogsList } from "./temperature/TemperatureLogsList";
import { TemperatureChart } from "./temperature/TemperatureChart";
import { EmptyTemperatureState } from "./temperature/EmptyTemperatureState";
import { TemperatureLogsLoading } from "./temperature/TemperatureLogsLoading";
import { TemperatureLog } from "./types/temperatureTypes";
import { getShipmentTemperatureHistory } from "./utils/shipmentUtils";

interface TemperatureLogsProps {
  shipmentId: string;
  targetTemperature: number;
}

export function TemperatureLogs({ shipmentId, targetTemperature }: TemperatureLogsProps) {
  const [logs, setLogs] = useState<TemperatureLog[]>([]);
  const { toast } = useToast();
  
  const { 
    data: temperatureLogs, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["temperature-logs", shipmentId],
    queryFn: () => getShipmentTemperatureHistory(shipmentId),
    enabled: !!shipmentId
  });

  useEffect(() => {
    if (temperatureLogs) {
      setLogs(temperatureLogs as TemperatureLog[]);
    }
  }, [temperatureLogs]);

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
    return <TemperatureLogsLoading />;
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
    return <EmptyTemperatureState />;
  }
      
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
          {currentLogs.length > 0 && (
            <div className="h-72 w-full">
              <TemperatureChart 
                data={currentLogs} 
                targetTemperature={targetTemperature} 
              />
            </div>
          )}
        </CardContent>
      </Card>

      <TemperatureLogsList 
        logs={currentLogs}
        targetTemperature={targetTemperature}
      />
    </div>
  );
}
