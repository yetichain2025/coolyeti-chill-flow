
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const fetchShipments = async () => {
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export function useShipments() {
  const { toast } = useToast();

  const { 
    data: shipments, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["shipments"],
    queryFn: fetchShipments,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching shipments",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return {
    shipments,
    isLoading,
    error,
    refetch
  };
}
