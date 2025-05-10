
import { Button } from "@/components/ui/button";

interface TemperatureFiltersProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export function TemperatureFilters({ activeFilter, setActiveFilter }: TemperatureFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <Button 
        variant={activeFilter === "all" ? "default" : "outline"} 
        size="sm"
        onClick={() => setActiveFilter("all")}
      >
        All
      </Button>
      <Button 
        variant={activeFilter === "normal" ? "default" : "outline"} 
        size="sm"
        onClick={() => setActiveFilter("normal")}
        className="text-green-600"
      >
        Normal
      </Button>
      <Button 
        variant={activeFilter === "warning" ? "default" : "outline"} 
        size="sm"
        onClick={() => setActiveFilter("warning")}
        className="text-amber-600"
      >
        Warning
      </Button>
      <Button 
        variant={activeFilter === "critical" ? "default" : "outline"} 
        size="sm"
        onClick={() => setActiveFilter("critical")}
        className="text-red-600"
      >
        Critical
      </Button>
    </div>
  );
}
