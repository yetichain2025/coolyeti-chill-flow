
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  ReferenceLine 
} from "recharts";
import { Thermometer } from "lucide-react";

// Demo data for the chart
const temperatureData = [
  { time: '00:00', avg: 2.1, min: -19.2, max: 3.8 },
  { time: '04:00', avg: 2.3, min: -18.7, max: 3.9 },
  { time: '08:00', avg: 2.5, min: -18.5, max: 4.1 },
  { time: '12:00', avg: 2.8, min: -18.3, max: 4.3 },
  { time: '16:00', avg: 2.6, min: -18.6, max: 4.0 },
  { time: '20:00', avg: 2.3, min: -18.9, max: 3.8 },
  { time: '24:00', avg: 2.2, min: -19.0, max: 3.7 },
];

export function TemperatureOverview() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Average Temperature</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">2.4°C</span>
            <span className="ml-2 text-xs text-muted-foreground">(across all coolers)</span>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Min Temperature</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">-19.2°C</span>
            <span className="ml-2 text-xs text-muted-foreground">(freezer units)</span>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Max Temperature</span>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">4.3°C</span>
            <span className="ml-2 text-xs text-muted-foreground">(cooler units)</span>
          </div>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={temperatureData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip formatter={(value) => `${value}°C`} />
            <Legend />
            <ReferenceLine y={4} stroke="red" strokeDasharray="3 3" label={{ value: 'Max Safe (Coolers)', position: 'top' }} />
            <ReferenceLine y={-15} stroke="red" strokeDasharray="3 3" label={{ value: 'Min Safe (Freezers)', position: 'bottom' }} />
            <Line type="monotone" dataKey="avg" name="Avg Temp" stroke="#0ea5e9" strokeWidth={2} />
            <Line type="monotone" dataKey="min" name="Min Temp" stroke="#0369a1" />
            <Line type="monotone" dataKey="max" name="Max Temp" stroke="#14b8a6" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
