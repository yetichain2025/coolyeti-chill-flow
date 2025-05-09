
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TemperatureReading {
  temperature: number;
  is_alert: boolean | null;
  timestamp: string;
}

export function useTemperatureData(shipmentId: string) {
  const [lastReading, setLastReading] = useState<TemperatureReading | null>(null);

  useEffect(() => {
    if (!shipmentId) return;

    const fetchLastReading = async () => {
      const { data, error } = await supabase
        .from("temperature_logs")
        .select("temperature, is_alert, recorded_at")
        .eq("shipment_id", shipmentId)
        .order("recorded_at", { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        setLastReading({
          temperature: data[0].temperature,
          is_alert: data[0].is_alert,
          timestamp: data[0].recorded_at
        });
      }
    };

    fetchLastReading();

    // Set up real-time subscription for new temperature readings
    const channel = supabase
      .channel('latest-temp-reading')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'temperature_logs',
          filter: `shipment_id=eq.${shipmentId}`
        },
        (payload) => {
          const newReading = payload.new as {
            temperature: number;
            is_alert: boolean | null;
            recorded_at: string;
          };
          
          setLastReading({
            temperature: newReading.temperature,
            is_alert: newReading.is_alert,
            timestamp: newReading.recorded_at
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shipmentId]);

  return { lastReading };
}
