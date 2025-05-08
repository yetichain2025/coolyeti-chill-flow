
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

export async function addTemperatureReading(
  shipmentId: string, 
  temperature: number, 
  options?: { 
    device_id?: string; 
    location?: string; 
  }
) {
  const { data, error } = await supabase.from("temperature_logs").insert({
    shipment_id: shipmentId,
    temperature,
    device_id: options?.device_id || null,
    location: options?.location || null,
  });
  
  if (error) throw error;
  
  return data;
}

export async function getShipmentTemperatureHistory(shipmentId: string) {
  const { data, error } = await supabase
    .from("temperature_logs")
    .select("*")
    .eq("shipment_id", shipmentId)
    .order("recorded_at", { ascending: false });
    
  if (error) throw error;
  
  return data;
}

export async function getShipmentDetails(shipmentId: string) {
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .eq("shipment_id", shipmentId)
    .single();
    
  if (error) throw error;
  
  return data;
}
