
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TemperatureFormValues } from "./temperatureFormSchema";
import { isTemperatureAlert } from "@/utils/temperatureUtils";

export function useTemperatureSubmit(shipmentId: string, onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitTemperature = async (values: TemperatureFormValues) => {
    if (!shipmentId) return;
    
    setIsSubmitting(true);
    
    try {
      // First, get the target temperature for this shipment
      const { data: shipmentData, error: shipmentError } = await supabase
        .from("shipments")
        .select("target_temperature")
        .eq("shipment_id", shipmentId)
        .single();
      
      if (shipmentError) throw shipmentError;
      
      const targetTemperature = shipmentData.target_temperature;
      const isAlert = isTemperatureAlert(values.temperature, targetTemperature);
      
      // Insert temperature log
      const { error } = await supabase
        .from("temperature_logs")
        .insert({
          shipment_id: shipmentId,
          temperature: values.temperature,
          device_id: values.device_id || null,
          location: values.location || null,
          is_alert: isAlert
        });

      if (error) throw error;
      
      // Update the current temperature on the shipment
      await supabase
        .from("shipments")
        .update({
          current_temperature: values.temperature,
          updated_at: new Date().toISOString()
        })
        .eq("shipment_id", shipmentId);
      
      toast({
        title: "Temperature reading added",
        description: "The temperature reading has been recorded successfully.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      toast({
        title: "Error adding temperature reading",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error adding temperature reading:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitTemperature,
    isSubmitting
  };
}
