
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Lazy load components
const CustomerPage = lazy(() => import("./pages/CustomerPage"));
const StaffPage = lazy(() => import("./pages/StaffPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AppointmentsPage = lazy(() => import("./pages/AppointmentsPage"));
const NewAppointmentPage = lazy(() => import("./pages/NewAppointmentPage"));
const Login = lazy(() => import("./pages/Login"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PerformanceReportPage = lazy(() => import("./pages/PerformanceReportPage"));
const BackendHealthPage = lazy(() => import("./pages/BackendHealthPage"));
const BrowardDesignSystem = lazy(() => import("./pages/BrowardDesignSystem"));
const BrowardIndex = lazy(() => import("./pages/BrowardIndex"));

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* Public customer routes - no authentication required */}
                <Route path="/customer" element={<CustomerPage />} />
                <Route path="/new-appointment" element={<NewAppointmentPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                
                {/* Authentication routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/auth" element={<AuthPage />} />
                
                {/* Protected staff routes */}
                <Route 
                  path="/staff" 
                  element={
                    <ProtectedRoute requiredRoles={['staff', 'admin']}>
                      <StaffPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected admin routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requiredRoles={['admin']}>
                      <AdminPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected user profile routes */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected performance reports */}
                <Route 
                  path="/performance" 
                  element={
                    <ProtectedRoute requiredRoles={['staff', 'admin']}>
                      <PerformanceReportPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Health check and design system - accessible to all */}
                <Route path="/health" element={<BackendHealthPage />} />
                <Route path="/design" element={<BrowardDesignSystem />} />
                <Route path="/broward" element={<BrowardIndex />} />
                
                {/* Error routes */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
