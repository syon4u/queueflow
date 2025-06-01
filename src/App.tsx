import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { QueueProvider } from "./context/QueueContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import CustomerPage from "./pages/CustomerPage";
import StaffPage from "./pages/StaffPage";
import AdminPage from "./pages/AdminPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import NewAppointmentPage from "./pages/NewAppointmentPage";
import PerformanceReportPage from "./pages/PerformanceReportPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import BackendHealthPage from "./pages/BackendHealthPage";
import BrowardDesignSystem from "./pages/BrowardDesignSystem";
import BrowardIndex from "./pages/BrowardIndex";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <QueueProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/design-system" element={<BrowardDesignSystem />} />
                <Route path="/broward" element={<BrowardIndex />} />
                
                {/* Customer routes */}
                <Route 
                  path="/customer" 
                  element={
                    <ProtectedRoute requiredRoles={['customer', 'staff', 'admin']}>
                      <CustomerPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Staff routes */}
                <Route 
                  path="/staff" 
                  element={
                    <ProtectedRoute requiredRoles={['staff', 'admin']}>
                      <StaffPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/appointments" 
                  element={
                    <ProtectedRoute requiredRoles={['staff', 'admin']}>
                      <AppointmentsPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/appointments/new" 
                  element={
                    <ProtectedRoute requiredRoles={['staff', 'admin']}>
                      <NewAppointmentPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/performance" 
                  element={
                    <ProtectedRoute requiredRoles={['staff', 'admin']}>
                      <PerformanceReportPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRoles={['admin']}>
                      <AdminPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Backend Health Check - Admin only */}
                <Route 
                  path="/admin/health" 
                  element={
                    <ProtectedRoute requiredRoles={['admin']}>
                      <BackendHealthPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Profile - All authenticated users */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </QueueProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;