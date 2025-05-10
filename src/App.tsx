
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Shipments from "./pages/Shipments";
import Temperature from "./pages/Temperature";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { AppSidebar } from "./components/layout/AppSidebar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="flex h-screen">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <div className="flex w-full">
                      <AppSidebar />
                      <div className="flex-1 overflow-auto">
                        <Index />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shipments"
                element={
                  <ProtectedRoute>
                    <div className="flex w-full">
                      <AppSidebar />
                      <div className="flex-1 overflow-auto">
                        <Shipments />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/temperature"
                element={
                  <ProtectedRoute>
                    <div className="flex w-full">
                      <AppSidebar />
                      <div className="flex-1 overflow-auto">
                        <Temperature />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
