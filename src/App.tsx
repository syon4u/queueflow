
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute, { AdminRoute, StaffRoute, CustomerRoute } from './components/ProtectedRoute';
import './App.css';

// Lazy load pages for better performance
const Index = lazy(() => import('./pages/Index'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const CustomerPage = lazy(() => import('./pages/CustomerPage'));
const StaffPage = lazy(() => import('./pages/StaffPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage'));
const NewAppointmentPage = lazy(() => import('./pages/NewAppointmentPage'));
const PerformanceReportPage = lazy(() => import('./pages/PerformanceReportPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const BackendHealthPage = lazy(() => import('./pages/BackendHealthPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  console.log('App: Rendering application');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  
                  {/* Protected routes - require authentication */}
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Customer routes - require customer, staff, or admin role */}
                  <Route path="/customer" element={
                    <CustomerRoute>
                      <CustomerPage />
                    </CustomerRoute>
                  } />
                  
                  <Route path="/appointments" element={
                    <CustomerRoute>
                      <AppointmentsPage />
                    </CustomerRoute>
                  } />
                  
                  <Route path="/appointments/new" element={
                    <CustomerRoute>
                      <NewAppointmentPage />
                    </CustomerRoute>
                  } />
                  
                  {/* Staff routes - require staff or admin role */}
                  <Route path="/staff" element={
                    <StaffRoute>
                      <StaffPage />
                    </StaffRoute>
                  } />
                  
                  <Route path="/performance" element={
                    <StaffRoute>
                      <PerformanceReportPage />
                    </StaffRoute>
                  } />
                  
                  {/* Admin routes - require admin role */}
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  } />
                  
                  <Route path="/backend-health" element={
                    <AdminRoute>
                      <BackendHealthPage />
                    </AdminRoute>
                  } />
                  
                  {/* Catch all - redirect to 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
            <Toaster />
            <Sonner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
