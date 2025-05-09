
import { format } from "date-fns";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { TemperatureLog } from "../types/temperatureTypes";

interface ChartDataPoint {
  time: string;
  temperature: number;
  date: string;
  alert: boolean;
}

interface TemperatureChartProps {
  data: TemperatureLog[];
  targetTemperature: number;
}

export function TemperatureChart({ data, targetTemperature }: TemperatureChartProps) {
  // Format data for chart
  const chartData: ChartDataPoint[] = data
    .slice()
    .reverse()
    .slice(-20) // Just take last 20 readings for chart clarity
    .map(log => ({
      time: format(new Date(log.recorded_at), "HH:mm"),
      temperature: log.temperature,
      date: format(new Date(log.recorded_at), "MMM dd"),
      alert: log.is_alert || false,
    }));
    
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => `${value}°C`} 
          labelFormatter={(label) => `Time: ${label}`}
        />
        <ReferenceLine 
          y={targetTemperature} 
          stroke="green" 
          strokeDasharray="3 3" 
          label={{ value: 'Target', position: 'left' }} 
        />
        <ReferenceLine 
          y={targetTemperature + 3} 
          stroke="red" 
          strokeDasharray="3 3" 
          label={{ value: 'Upper Limit', position: 'right' }} 
        />
        <ReferenceLine 
          y={targetTemperature - 3} 
          stroke="red" 
          strokeDasharray="3 3" 
          label={{ value: 'Lower Limit', position: 'left' }} 
        />
        <Line 
          type="monotone" 
          dataKey="temperature" 
          stroke="#0ea5e9" 
          strokeWidth={2}
          dot={{ stroke: '#0ea5e9', strokeWidth: 2, r: 4 }}
          activeDot={{ 
            stroke: '#0284c7', 
            strokeWidth: 2, 
            r: 6,
            fill: (entry) => {
              return (entry as ChartDataPoint).alert ? '#ef4444' : '#0ea5e9';
            }
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
