
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Box, 
  Home, 
  Truck, 
  Package, 
  Thermometer, 
  BarChart, 
  Settings,
  Menu,
  X,
  LayoutDashboard,
  Map
} from "lucide-react";

interface NavItemProps {
  icon: React.ElementType;
  title: string;
  isActive?: boolean;
  href: string;
}

function NavItem({ icon: Icon, title, isActive, href }: NavItemProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "flex w-full items-center gap-2 justify-start px-4 py-2",
        isActive && "bg-accent text-accent-foreground"
      )}
      asChild
    >
      <a href={href}>
        <Icon className="h-5 w-5" />
        <span>{title}</span>
      </a>
    </Button>
  );
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center gap-2">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/840ddef4-8125-416e-96d5-49afe5725670.png" 
                alt="Frosty Yeti Logo" 
                className="h-8 w-8"
              />
              <span className="text-lg font-bold">CoolYeti</span>
            </div>
          )}
          {collapsed && (
            <img 
              src="/lovable-uploads/840ddef4-8125-416e-96d5-49afe5725670.png" 
              alt="Frosty Yeti Logo" 
              className="h-6 w-6 mx-auto"
            />
          )}
        </div>
        <Button
          className="ml-auto"
          size="icon"
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <Menu className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-4">
          <div className="space-y-1">
            {!collapsed && <p className="px-4 text-xs font-medium text-muted-foreground">Navigation</p>}
            <NavItem icon={LayoutDashboard} title="Dashboard" isActive href="/" />
            <NavItem icon={Truck} title="Shipments" href="/shipments" />
            <NavItem icon={Package} title="Inventory" href="/inventory" />
            <NavItem icon={Thermometer} title="Temperature" href="/temperature" />
            <NavItem icon={Map} title="Tracking" href="/tracking" />
            <NavItem icon={BarChart} title="Reports" href="/reports" />
          </div>
          <div className="mt-8 space-y-1">
            {!collapsed && <p className="px-4 text-xs font-medium text-muted-foreground">Settings</p>}
            <NavItem icon={Settings} title="Settings" href="/settings" />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
