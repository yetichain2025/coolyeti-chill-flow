
export type ShipmentStatus = 'Scheduled' | 'In Transit' | 'Delayed' | 'Delivered' | 'Cancelled';

export interface ShipmentType {
  id: string;
  shipment_id: string;
  destination: string;
  product: string;
  target_temperature: number;
  current_temperature: number | null;
  departure_date: string;
  estimated_arrival: string | null;
  status: ShipmentStatus;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface NewShipmentData {
  destination: string;
  product: string;
  target_temperature: number;
  departure_date: string;
  estimated_arrival?: string | null;
  status: ShipmentStatus;
}
