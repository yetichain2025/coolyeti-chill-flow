
import { Skeleton } from "@/components/ui/skeleton";

export function TemperatureLogsLoading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-72 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
