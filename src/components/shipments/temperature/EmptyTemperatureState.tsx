
import { ThermometerIcon } from "lucide-react";

export function EmptyTemperatureState() {
  return (
    <div className="p-6 text-center border border-dashed rounded-md bg-muted/20">
      <ThermometerIcon className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-lg font-medium">No temperature data</h3>
      <p className="text-muted-foreground">
        This shipment doesn't have any temperature readings recorded yet.
      </p>
    </div>
  );
}
