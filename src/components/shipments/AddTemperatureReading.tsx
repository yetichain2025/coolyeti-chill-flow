
import { useState, useEffect } from "react";
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
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [lastReading, setLastReading] = useState<{
    temperature: number;
    is_alert: boolean | null;
    timestamp: string;
  } | null>(null);
  const { toast } = useToast();

  const form = useForm<TemperatureFormValues>({
    resolver: zodResolver(temperatureFormSchema),
    defaultValues: {
      temperature: undefined,
      device_id: "",
      location: "",
    },
  });

  // Fetch the most recent temperature reading for this shipment
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
            is_alert: boolean;
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
      <CardContent className="space-y-4">
        {lastReading && (
          <div className="mb-4">
            <p className="text-sm font-medium">Last recorded temperature:</p>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className={`text-lg font-bold ${
                  lastReading.is_alert 
                    ? "text-red-600" 
                    : "text-green-600"
                }`}
              >
                {lastReading.temperature}°C
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(lastReading.timestamp).toLocaleString()}
              </span>
            </div>
            
            {lastReading.is_alert && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Temperature Alert</AlertTitle>
                <AlertDescription>
                  This reading exceeds the acceptable temperature range for this shipment.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      
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
