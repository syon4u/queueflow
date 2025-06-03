
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
// import { SessionProvider } from "@/context/SessionContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import StaffPage from "./pages/StaffPage";
import CustomerPage from "./pages/CustomerPage";
import ProfilePage from "./pages/ProfilePage";
import AppointmentsPage from "./pages/AppointmentsPage";
import NewAppointmentPage from "./pages/NewAppointmentPage";
import PerformanceReportPage from "./pages/PerformanceReportPage";
import BackendHealthPage from "./pages/BackendHealthPage";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import BrowardIndex from "./pages/BrowardIndex";
import BrowardDesignSystem from "./pages/BrowardDesignSystem";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            {/* Temporarily disabled SessionProvider to debug infinite recursion */}
            {/* <SessionProvider> */}
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/broward" element={<BrowardIndex />} />
                <Route path="/broward/design-system" element={<BrowardDesignSystem />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Protected routes */}
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/staff" 
                  element={
                    <ProtectedRoute requiredRole={['staff', 'admin']}>
                      <StaffPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/customer" 
                  element={
                    <ProtectedRoute>
                      <CustomerPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/appointments" 
                  element={
                    <ProtectedRoute>
                      <AppointmentsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/appointments/new" 
                  element={
                    <ProtectedRoute>
                      <NewAppointmentPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/performance" 
                  element={
                    <ProtectedRoute requiredRole={['staff', 'admin']}>
                      <PerformanceReportPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/health" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <BackendHealthPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            {/* </SessionProvider> */}
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
