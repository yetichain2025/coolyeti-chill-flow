
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ShipmentType } from "@/types/shipment";
import { useToast } from "@/hooks/use-toast";

export function useTemperatureAlerts(refetch: () => void) {
  const [temperatureAlerts, setTemperatureAlerts] = useState<ShipmentType[]>([]);
  const { toast } = useToast();

  // Set up real-time subscription for temperature updates on shipments
  useEffect(() => {
    const channel = supabase
      .channel('shipments-temperature-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shipments',
        },
        (payload) => {
          const updatedShipment = payload.new as ShipmentType;
          
          // Only process temperature updates
          if (payload.old.current_temperature !== updatedShipment.current_temperature) {
            // Check for temperature alerts
            if (Math.abs(updatedShipment.current_temperature - updatedShipment.target_temperature) > 3) {
              setTemperatureAlerts(prev => {
                // Don't add duplicate alerts
                if (!prev.some(s => s.shipment_id === updatedShipment.shipment_id)) {
                  toast({
                    title: "Temperature Alert",
                    description: `Shipment ${updatedShipment.shipment_id} temperature is out of range!`,
                    variant: "destructive",
                  });
                  return [...prev, updatedShipment];
                }
                return prev;
              });
            } else {
              // Remove from alerts if temperature is back in range
              setTemperatureAlerts(prev => 
                prev.filter(s => s.shipment_id !== updatedShipment.shipment_id)
              );
            }
            
            // Update the shipment in our local data
            refetch();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

  const dismissAlert = (shipmentId: string) => {
    setTemperatureAlerts(prev => prev.filter(s => s.shipment_id !== shipmentId));
  };

  return { temperatureAlerts, dismissAlert };
}
