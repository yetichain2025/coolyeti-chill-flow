
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
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Sample data
const temperatureData = [
  { time: '00:00', freezer1: -18.2, freezer2: -17.9, cooler1: 2.1, cooler2: 3.2 },
  { time: '02:00', freezer1: -18.5, freezer2: -18.1, cooler1: 2.3, cooler2: 3.0 },
  { time: '04:00', freezer1: -18.3, freezer2: -18.0, cooler1: 2.0, cooler2: 2.9 },
  { time: '06:00', freezer1: -17.9, freezer2: -17.7, cooler1: 2.2, cooler2: 3.3 },
  { time: '08:00', freezer1: -17.5, freezer2: -17.3, cooler1: 2.5, cooler2: 3.5 },
  { time: '10:00', freezer1: -18.0, freezer2: -17.8, cooler1: 2.3, cooler2: 3.2 },
  { time: '12:00', freezer1: -18.2, freezer2: -18.0, cooler1: 2.1, cooler2: 3.0 },
  { time: '14:00', freezer1: -18.4, freezer2: -18.2, cooler1: 2.0, cooler2: 2.9 },
  { time: '16:00', freezer1: -18.2, freezer2: -18.0, cooler1: 2.2, cooler2: 3.1 },
  { time: '18:00', freezer1: -18.0, freezer2: -17.9, cooler1: 2.4, cooler2: 3.3 },
  { time: '20:00', freezer1: -18.1, freezer2: -18.0, cooler1: 2.3, cooler2: 3.2 },
  { time: '22:00', freezer1: -18.3, freezer2: -18.1, cooler1: 2.2, cooler2: 3.1 },
];

export function TemperatureChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Temperature Monitoring (24h)</CardTitle>
        <CardDescription>Real-time temperature readings for cold storage units</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={temperatureData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <ReferenceLine y={4} stroke="red" strokeDasharray="3 3" label={{ value: 'Max Safe Temp (Coolers)', position: 'top' }} />
              <ReferenceLine y={-15} stroke="red" strokeDasharray="3 3" label={{ value: 'Min Safe Temp (Freezers)', position: 'bottom' }} />
              <Line type="monotone" dataKey="freezer1" name="Freezer 1" stroke="#0ea5e9" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="freezer2" name="Freezer 2" stroke="#0369a1" />
              <Line type="monotone" dataKey="cooler1" name="Cooler 1" stroke="#14b8a6" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="cooler2" name="Cooler 2" stroke="#0d9488" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
