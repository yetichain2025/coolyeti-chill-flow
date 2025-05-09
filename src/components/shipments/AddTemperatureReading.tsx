
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TemperatureForm } from "./temperature/TemperatureForm";
import { LastTemperatureReading } from "./temperature/LastTemperatureReading";
import { useTemperatureData } from "./temperature/useTemperatureData";
import { TemperatureFormValues } from "./temperature/temperatureFormSchema";

interface AddTemperatureReadingProps {
  shipmentId: string;
  onReadingAdded?: () => void;
}

export function AddTemperatureReading({ shipmentId, onReadingAdded }: AddTemperatureReadingProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { lastReading } = useTemperatureData(shipmentId);
  const { toast } = useToast();

  async function onSubmit(values: TemperatureFormValues) {
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
      
      if (onReadingAdded) {
        onReadingAdded();
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
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Temperature Reading</CardTitle>
        <CardDescription>
          Record a new temperature reading for this shipment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {lastReading && (
          <LastTemperatureReading lastReading={lastReading} />
        )}
        
        <TemperatureForm 
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}
