
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function AppHeader() {
  const { user, signOut } = useAuth();
  
  const firstName = user?.user_metadata?.first_name || "User";
  const lastName = user?.user_metadata?.last_name || "";
  
  return (
    <header className="border-b shadow-sm bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="ml-auto flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{`${firstName} ${lastName}`}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={signOut}
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
