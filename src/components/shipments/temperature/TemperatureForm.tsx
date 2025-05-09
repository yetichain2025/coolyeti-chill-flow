
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { temperatureFormSchema, TemperatureFormValues } from "./temperatureFormSchema";

interface TemperatureFormProps {
  onSubmit: (values: TemperatureFormValues) => void;
  isSubmitting: boolean;
}

export function TemperatureForm({ onSubmit, isSubmitting }: TemperatureFormProps) {
  const form = useForm<TemperatureFormValues>({
    resolver: zodResolver(temperatureFormSchema),
    defaultValues: {
      temperature: undefined,
      device_id: "",
      location: "",
    },
  });

  return (
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
  );
}
