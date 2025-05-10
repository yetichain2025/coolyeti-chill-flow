
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Truck, 
  Thermometer, 
  Users, 
  Settings,
  Package,
  Map,
  BarChart,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    icon: <Home className="h-5 w-5" />,
    href: "/",
  },
  {
    title: "Shipments",
    icon: <Truck className="h-5 w-5" />,
    href: "/shipments",
  },
  {
    title: "Temperature",
    icon: <Thermometer className="h-5 w-5" />,
    href: "/temperature",
  },
  {
    title: "Inventory",
    icon: <Package className="h-5 w-5" />,
    href: "/inventory",
  },
  {
    title: "Routes",
    icon: <Map className="h-5 w-5" />,
    href: "/routes",
  },
  {
    title: "Analytics",
    icon: <BarChart className="h-5 w-5" />,
    href: "/analytics",
  },
  {
    title: "Team",
    icon: <Users className="h-5 w-5" />,
    href: "/team",
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/settings",
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
            C
          </span>
          <span>ColdChain</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="px-2 space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
                  location.pathname === item.href && "bg-accent text-accent-foreground"
                )}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            BS
          </div>
          <div>
            <p className="text-sm font-medium leading-none">Bambang Sadikin</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
