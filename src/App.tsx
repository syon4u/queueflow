
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from '@/context/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RoleDashboardWrapper } from "./components/staff/RoleDashboardWrapper";
import Index from "./pages/Index";
import CustomerPage from "./pages/CustomerPage";
import StaffPage from "./pages/StaffPage";
import AdminPage from "./components/admin/AdminPage";
import { VirtualQueuePage } from "./pages/VirtualQueuePage";
import AuthPage from "./pages/AuthPage";
import KioskPage from "./pages/KioskPage";
import DigitalSignagePage from "./pages/DigitalSignagePage";
import MobileQueuePage from "./pages/MobileQueuePage";
import PowerUserPage from "./pages/PowerUserPage";
import StatusPage from "./pages/StatusPage";
import CheckInPage from "./pages/CheckInPage";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connection Restored",
        description: "You're back online!",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Connection Lost",
        description: "You're currently offline. Some features may be limited.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Monitor Supabase connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('locations').select('count').limit(1);
        if (error) {
          console.error('Supabase connection error:', error);
        }
      } catch (error) {
        console.error('Database connection failed:', error);
        if (isOnline) {
          toast({
            title: "Database Connection Issue",
            description: "Having trouble connecting to the database. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    // Check connection on mount and every 30 seconds
    checkConnection();
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, [isOnline, toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              {!isOnline && (
                <div className="bg-yellow-500 text-yellow-900 text-center py-2 px-4 text-sm font-medium">
                  You're currently offline. Some features may not be available.
                </div>
              )}
              
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/customer" element={<CustomerPage />} />
                <Route path="/staff" element={<StaffPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/power-user" element={<PowerUserPage />} />
                <Route path="/queue" element={<VirtualQueuePage />} />
                <Route path="/status" element={<StatusPage />} />
                <Route path="/check-in" element={<CheckInPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/kiosk" element={<KioskPage />} />
                <Route path="/signage" element={<DigitalSignagePage />} />
                <Route path="/mobile-queue" element={<MobileQueuePage />} />
                <Route path="/staff-roles" element={
                  <div>
                    <RoleDashboardWrapper />
                  </div>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
