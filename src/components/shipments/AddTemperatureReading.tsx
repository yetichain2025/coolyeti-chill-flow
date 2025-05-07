
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AddTemperatureReadingProps {
  shipmentId: string;
  onReadingAdded?: () => void;
}

const temperatureFormSchema = z.object({
  temperature: z.coerce
    .number({
      required_error: "Temperature is required.",
      invalid_type_error: "Temperature must be a number",
    })
    .min(-50, { message: "Temperature must be at least -50°C" })
    .max(100, { message: "Temperature must be below 100°C" }),
  device_id: z.string().optional(),
  location: z.string().optional(),
});

type TemperatureFormValues = z.infer<typeof temperatureFormSchema>;

export function AddTemperatureReading({ shipmentId, onReadingAdded }: AddTemperatureReadingProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<TemperatureFormValues>({
    resolver: zodResolver(temperatureFormSchema),
    defaultValues: {
      temperature: undefined,
      device_id: "",
      location: "",
    },
  });

  async function onSubmit(values: TemperatureFormValues) {
    if (!shipmentId) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("temperature_logs").insert({
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
      
      form.reset();
      
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
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature (°C)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1" 
                      placeholder="Enter temperature" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="device_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Device identifier" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Current location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Recording..." : "Record Temperature"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
