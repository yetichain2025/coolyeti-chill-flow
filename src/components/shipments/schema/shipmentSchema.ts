
import * as z from "zod";
import { ShipmentStatus } from "@/types/shipment";

export const shipmentFormSchema = z.object({
  destination: z.string().min(3, {
    message: "Destination must be at least 3 characters.",
  }),
  product: z.string().min(2, {
    message: "Product must be at least 2 characters.",
  }),
  target_temperature: z.coerce.number({
    required_error: "A target temperature is required.",
    invalid_type_error: "Target temperature must be a number",
  }),
  departure_date: z.date({
    required_error: "A departure date is required.",
  }),
  estimated_arrival: z.date().optional().nullable(),
  status: z.enum(['Scheduled', 'In Transit', 'Delayed', 'Delivered', 'Cancelled'], {
    required_error: "Please select a shipment status.",
  }),
});

export type ShipmentFormValues = z.infer<typeof shipmentFormSchema>;
