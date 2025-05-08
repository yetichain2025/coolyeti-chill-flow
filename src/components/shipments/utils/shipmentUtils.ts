
import { supabase } from "@/integrations/supabase/client";
import type { ShipmentFormValues } from "../schema/shipmentSchema";

export async function createShipment(values: ShipmentFormValues, userId: string) {
  const newShipmentData = {
    destination: values.destination,
    product: values.product,
    target_temperature: values.target_temperature,
    departure_date: values.departure_date.toISOString(),
    estimated_arrival: values.estimated_arrival ? values.estimated_arrival.toISOString() : null,
    status: values.status,
    user_id: userId,
    // Generate a temporary ID that will be replaced by the database trigger
    shipment_id: `SH-${Math.random().toString(36).substr(2, 5)}`
  };
  
  const { data, error } = await supabase
    .from("shipments")
    .insert(newShipmentData);
    
  if (error) throw error;
  
  return data;
}
