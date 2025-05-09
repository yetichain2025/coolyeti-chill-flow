
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TemperatureForm } from "./temperature/TemperatureForm";
import { LastTemperatureReading } from "./temperature/LastTemperatureReading";
import { useTemperatureData } from "./temperature/useTemperatureData";
import { useTemperatureSubmit } from "./temperature/useTemperatureSubmit";
import { TemperatureFormValues } from "./temperature/temperatureFormSchema";

interface AddTemperatureReadingProps {
  shipmentId: string;
  onReadingAdded?: () => void;
}

export function AddTemperatureReading({ shipmentId, onReadingAdded }: AddTemperatureReadingProps) {
  const { lastReading } = useTemperatureData(shipmentId);
  const { submitTemperature, isSubmitting } = useTemperatureSubmit(shipmentId, onReadingAdded);

  const onSubmit = (values: TemperatureFormValues) => {
    submitTemperature(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Temperature Reading</CardTitle>
        <CardDescription>
          Record a new temperature reading for this shipment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {lastReading && (
          <LastTemperatureReading lastReading={lastReading} />
        )}
        
        <TemperatureForm 
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}
