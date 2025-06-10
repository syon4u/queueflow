
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { QueueProvider } from "@/context/QueueContext";
import { SessionProvider } from "@/context/SessionContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const CustomerPage = lazy(() => import("./pages/CustomerPage"));
const StaffPage = lazy(() => import("./pages/StaffPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const PowerUserPage = lazy(() => import("./pages/PowerUserPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const Login = lazy(() => import("./pages/Login"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CheckInPage = lazy(() => import("./pages/CheckInPage"));
const KioskPage = lazy(() => import("./pages/KioskPage"));
const VirtualQueuePage = lazy(() => import("./pages/VirtualQueuePage"));
const MobileQueuePage = lazy(() => import("./pages/MobileQueuePage"));
const DigitalSignagePage = lazy(() => import("./pages/DigitalSignagePage"));
const NewAppointmentPage = lazy(() => import("./pages/NewAppointmentPage"));
const PerformanceReportPage = lazy(() => import("./pages/PerformanceReportPage"));
const StatusPage = lazy(() => import("./pages/StatusPage"));
const BackendHealthPage = lazy(() => import("./pages/BackendHealthPage"));
const BrowardIndex = lazy(() => import("./pages/BrowardIndex"));
const BrowardDesignSystem = lazy(() => import("./pages/BrowardDesignSystem"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <SessionProvider>
              <QueueProvider>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/customer" element={<CustomerPage />} />
                      <Route path="/check-in" element={<CheckInPage />} />
                      <Route path="/kiosk" element={<KioskPage />} />
                      <Route path="/virtual-queue" element={<VirtualQueuePage />} />
                      <Route path="/mobile-queue" element={<MobileQueuePage />} />
                      <Route path="/signage" element={<DigitalSignagePage />} />
                      <Route path="/status" element={<StatusPage />} />
                      <Route path="/health" element={<BackendHealthPage />} />
                      <Route path="/broward" element={<BrowardIndex />} />
                      <Route path="/broward/design-system" element={<BrowardDesignSystem />} />
                      
                      {/* Auth Routes */}
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/auth/reset-password" element={<ResetPassword />} />
                      
                      {/* Protected Routes */}
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute>
                            <ProfilePage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/staff" 
                        element={
                          <ProtectedRoute requiredRole={['staff', 'power_user', 'admin']}>
                            <StaffPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/admin" 
                        element={
                          <ProtectedRoute requiredRole="admin">
                            <AdminPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/power-user" 
                        element={
                          <ProtectedRoute requiredRole={['power_user', 'admin']}>
                            <PowerUserPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/appointments/new" 
                        element={
                          <ProtectedRoute requiredRole={['staff', 'power_user', 'admin']}>
                            <NewAppointmentPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/reports/performance" 
                        element={
                          <ProtectedRoute requiredRole={['staff', 'power_user', 'admin']}>
                            <PerformanceReportPage />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Error Routes */}
                      <Route path="/unauthorized" element={<Unauthorized />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </div>
                <Toaster />
                <Sonner />
              </QueueProvider>
            </SessionProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
