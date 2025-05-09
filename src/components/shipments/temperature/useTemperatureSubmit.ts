
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TemperatureFormValues } from "./temperatureFormSchema";

export function useTemperatureSubmit(shipmentId: string, onSuccess?: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitTemperature = async (values: TemperatureFormValues) => {
    if (!shipmentId) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("temperature_logs")
        .insert({
          shipment_id: shipmentId,
          temperature: values.temperature,
          device_id: values.device_id || null,
          location: values.location || null,
        });

      if (error) throw error;
      
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
