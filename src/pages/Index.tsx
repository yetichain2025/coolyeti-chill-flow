
import { Truck, Thermometer, Package, AlertCircle } from "lucide-react";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { StatCard } from "@/components/dashboard/StatCard";
import { TemperatureChart } from "@/components/dashboard/TemperatureChart";
import { ShipmentTable } from "@/components/dashboard/ShipmentTable";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { TemperatureStatus } from "@/components/dashboard/TemperatureStatus";

const Index = () => {
  return (
    <div className="min-h-screen bg-muted/40 flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your cold chain logistics in real-time
            </p>
          </div>
          
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Active Shipments" 
              value="12"
              description="3 in transit, 9 scheduled" 
              icon={<Truck className="h-5 w-5" />}
              trend="up"
              trendValue="2 more than yesterday"
            />
            <StatCard 
              title="Temperature Alerts" 
              value="1"
              description="Within the last 24 hours" 
              icon={<Thermometer className="h-5 w-5" />}
              trend="down"
              trendValue="3 fewer than yesterday"
            />
            <StatCard 
              title="Inventory Units" 
              value="1,348"
              description="Across 4 storage facilities" 
              icon={<Package className="h-5 w-5" />}
              trend="stable"
              trendValue="No change since yesterday"
            />
            <StatCard 
              title="Compliance Rate" 
              value="99.2%"
              description="Temperature compliance rate" 
              icon={<AlertCircle className="h-5 w-5" />}
              trend="up"
              trendValue="0.5% improvement"
            />
          </section>
          
          <section className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <TemperatureChart />
            <TemperatureStatus />
          </section>
          
          <section className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <ShipmentTable />
            <AlertsList />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
