
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShipmentList } from "@/components/shipments/ShipmentList";
import { NewShipmentDialog } from "@/components/shipments/NewShipmentDialog";
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

const Shipments = () => {
  const [isNewShipmentDialogOpen, setIsNewShipmentDialogOpen] = useState(false);
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

  const handleShipmentAdded = () => {
    refetch();
    setIsNewShipmentDialogOpen(false);
    toast({
      title: "Shipment created",
      description: "Your new shipment has been created successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-muted/40 flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Shipments</h1>
              <p className="text-muted-foreground">
                Manage and track your cold chain shipments
              </p>
            </div>
            <Button onClick={() => setIsNewShipmentDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Shipment
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>All Shipments</CardTitle>
              <CardDescription>
                View and manage all your cold chain shipments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShipmentList shipments={shipments || []} isLoading={isLoading} />
            </CardContent>
          </Card>
        </main>
      </div>
      <NewShipmentDialog 
        open={isNewShipmentDialogOpen}
        onOpenChange={setIsNewShipmentDialogOpen}
        onShipmentAdded={handleShipmentAdded}
      />
    </div>
  );
};

export default Shipments;
