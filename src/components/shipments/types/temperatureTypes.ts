
export interface TemperatureLog {
  id: string;
  shipment_id: string;
  temperature: number;
  recorded_at: string;
  location: string | null;
  device_id: string | null;
  is_alert: boolean;
}
