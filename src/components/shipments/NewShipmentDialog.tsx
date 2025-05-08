
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { ShipmentForm } from "./ShipmentForm";
import { createShipment } from "./utils/shipmentUtils";
import { ShipmentFormValues } from "./schema/shipmentSchema";

interface NewShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShipmentAdded: () => void;
}

export function NewShipmentDialog({ open, onOpenChange, onShipmentAdded }: NewShipmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (values: ShipmentFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      await createShipment(values, user.id);
      onShipmentAdded();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating shipment:", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Shipment</DialogTitle>
          <DialogDescription>
            Enter the details for your new cold chain shipment.
          </DialogDescription>
        </DialogHeader>
        
        <ShipmentForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
}
