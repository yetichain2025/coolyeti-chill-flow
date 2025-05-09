
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShipmentType } from "@/types/shipment";

const fetchRecentShipments = async () => {
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }
  return data || [];
};

export function useRecentShipments() {
  return useQuery({
    queryKey: ["recent-shipments"],
    queryFn: fetchRecentShipments,
    placeholderData: [],
  });
}

// Demo data for initial display or when no shipments are available
export function getDemoShipments() {
  return [
    {
      shipment_id: 'SH-12345',
      destination: 'Jakarta Cold Storage',
      product: 'Frozen Seafood',
      target_temperature: -18,
      current_temperature: -18.2,
      departureDate: '2025-05-05',
      status: 'In Transit',
      eta: '3h 15m',
    },
    {
      shipment_id: 'SH-12346',
      destination: 'Medan Distribution',
      product: 'Dairy Products',
      target_temperature: 2,
      current_temperature: 2.1,
      departureDate: '2025-05-04',
      status: 'Delivered',
      eta: '-',
    },
    {
      shipment_id: 'SH-12347',
      destination: 'Surabaya Market',
      product: 'Vaccines',
      target_temperature: 3,
      current_temperature: 3.2,
      departureDate: '2025-05-05',
      status: 'In Transit',
      eta: '1h 45m',
    },
    {
      shipment_id: 'SH-12348',
      destination: 'Makassar Medical',
      product: 'Pharmaceuticals',
      target_temperature: 2,
      current_temperature: 2.9,
      departureDate: '2025-05-05',
      status: 'Delayed',
      eta: '5h 30m',
    },
    {
      shipment_id: 'SH-12349',
      destination: 'Batam Cold Chain',
      product: 'Fresh Produce',
      target_temperature: 3,
      current_temperature: 3.5,
      departureDate: '2025-05-03',
      status: 'Delivered',
      eta: '-',
    },
  ];
}
