
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute, { AdminRoute, StaffRoute, PowerUserRoute } from '@/components/ProtectedRoute';
import Index from './pages/Index';
import { Loader2 } from 'lucide-react';

// Lazy load components for better performance
const AdminPage = lazy(() => import('./pages/AdminPage'));
const StaffPage = lazy(() => import('./pages/StaffPage'));
const PowerUserPage = lazy(() => import('./pages/PowerUserPage'));
const CustomerPage = lazy(() => import('./pages/CustomerPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Login = lazy(() => import('./pages/Login'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NewAppointmentPage = lazy(() => import('./pages/NewAppointmentPage'));
const CheckInPage = lazy(() => import('./pages/CheckInPage'));
const StatusPage = lazy(() => import('./pages/StatusPage'));
const KioskPage = lazy(() => import('./pages/KioskPage'));
const DigitalSignagePage = lazy(() => import('./pages/DigitalSignagePage'));
const VirtualQueuePage = lazy(() => import('./pages/VirtualQueuePage'));
const MobileQueuePage = lazy(() => import('./pages/MobileQueuePage'));
const PerformanceReportPage = lazy(() => import('./pages/PerformanceReportPage'));
const BrowardIndex = lazy(() => import('./pages/BrowardIndex'));
const BrowardDesignSystem = lazy(() => import('./pages/BrowardDesignSystem'));
const BackendHealthPage = lazy(() => import('./pages/BackendHealthPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public routes - no authentication required */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/check-in" element={<CheckInPage />} />
                  <Route path="/status" element={<StatusPage />} />
                  <Route path="/kiosk" element={<KioskPage />} />
                  <Route path="/signage" element={<DigitalSignagePage />} />
                  <Route path="/virtual-queue" element={<VirtualQueuePage />} />
                  <Route path="/mobile-queue" element={<MobileQueuePage />} />
                  <Route path="/broward" element={<BrowardIndex />} />
                  <Route path="/design-system" element={<BrowardDesignSystem />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  
                  {/* Protected routes - require authentication and specific roles */}
                  <Route 
                    path="/staff" 
                    element={
                      <StaffRoute>
                        <StaffPage />
                      </StaffRoute>
                    } 
                  />
                  <Route 
                    path="/power-user" 
                    element={
                      <PowerUserRoute>
                        <PowerUserPage />
                      </PowerUserRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <AdminRoute>
                        <AdminPage />
                      </AdminRoute>
                    } 
                  />
                  
                  {/* General protected routes - require any authenticated user */}
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
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
                    path="/customer" 
                    element={
                      <ProtectedRoute>
                        <CustomerPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/performance-report" 
                    element={
                      <ProtectedRoute requiredRole={['staff', 'power_user', 'admin']}>
                        <PerformanceReportPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/backend-health" 
                    element={
                      <ProtectedRoute requiredRole={['power_user', 'admin']}>
                        <BackendHealthPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Toaster />
              <Sonner />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
