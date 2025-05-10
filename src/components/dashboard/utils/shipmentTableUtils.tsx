
import { ShipmentType } from "@/types/shipment";

// Helper function for status badge styling
export function getStatusColor(status: string) {
  switch (status) {
    case "In Transit":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Delayed":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
    case "Cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
}

// Helper function for ETA display
export function getETADisplay(shipment: ShipmentType | any) {
  if (shipment.status === "Delivered") {
    return "-";
  }
  
  // For demo data
  if (shipment.eta) {
    return shipment.eta;
  }
  
  // For real data
  if (shipment.estimated_arrival) {
    const now = new Date();
    const eta = new Date(shipment.estimated_arrival);
    const diffHours = Math.round((eta.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      const days = Math.floor(diffHours / 24);
      return `${days}d`;
    }
  }
  
  return "N/A";
}
