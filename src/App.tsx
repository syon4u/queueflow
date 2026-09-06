
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { QueueProvider } from '@/context/QueueContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute, AdminRoute, StaffRoute, PowerUserRoute } from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Public pages
import Index from '@/pages/Index';
const CustomerPage = React.lazy(() => import('@/pages/CustomerPage'));
const AppointmentLookupPage = React.lazy(() => import('./pages/AppointmentLookupPage'));
const AuthPage = React.lazy(() => import('@/pages/AuthPage'));
const ResetPassword = React.lazy(() => import('@/pages/ResetPassword'));
const CheckInPage = React.lazy(() => import('@/pages/CheckInPage'));
const KioskPage = React.lazy(() => import('@/pages/KioskPage'));
const DigitalSignagePage = React.lazy(() => import('@/pages/DigitalSignagePage'));
const MobileQueuePage = React.lazy(() => import('@/pages/MobileQueuePage'));
const VirtualQueuePage = React.lazy(() => import('@/pages/VirtualQueuePage'));
const StatusPage = React.lazy(() => import('@/pages/StatusPage'));
const PricingPage = React.lazy(() => import('@/pages/PricingPage'));
const Unauthorized = React.lazy(() => import('@/pages/Unauthorized'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));

// Protected pages
const AdminPage = React.lazy(() => import('@/pages/AdminPage'));
const StaffPage = React.lazy(() => import('@/pages/StaffPage'));
const PowerUserPage = React.lazy(() => import('@/pages/PowerUserPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const NewAppointmentPage = React.lazy(() => import('@/pages/NewAppointmentPage'));
const PerformanceReportPage = React.lazy(() => import('@/pages/PerformanceReportPage'));
const BackendHealthPage = React.lazy(() => import('@/pages/BackendHealthPage'));

// Design system pages
const BrowardDesignSystem = React.lazy(() => import('@/pages/BrowardDesignSystem'));
const BrowardIndex = React.lazy(() => import('@/pages/BrowardIndex'));

// Create a query client instance
const queryClient = new QueryClient();

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <div className="min-h-screen bg-background">
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <QueueProvider>
              <ErrorBoundary>
              <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">Loading…</div>}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/customer" element={<CustomerPage />} />
                <Route path="/appointment-lookup" element={<AppointmentLookupPage />} />
                <Route path="/auth" element={<AuthPage />} />
                {/* /login was a second, divergent sign-in page; /auth is canonical. */}
                <Route path="/login" element={<Navigate to="/auth" replace />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/check-in" element={<CheckInPage />} />
                <Route path="/status" element={<StatusPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Kiosk and signage routes */}
                <Route path="/kiosk" element={<KioskPage />} />
                <Route path="/digital-signage" element={<DigitalSignagePage />} />
                <Route path="/mobile-queue" element={<MobileQueuePage />} />
                <Route path="/virtual-queue" element={<VirtualQueuePage />} />
                
                {/* Design system routes */}
                <Route path="/broward-design-system" element={<AdminRoute><BrowardDesignSystem /></AdminRoute>} />
                <Route path="/broward-index" element={<AdminRoute><BrowardIndex /></AdminRoute>} />
                
                {/* Protected routes - require authentication */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                <Route path="/new-appointment" element={
                  <ProtectedRoute>
                    <NewAppointmentPage />
                  </ProtectedRoute>
                } />
                
                {/* Staff-only routes */}
                <Route path="/staff" element={
                  <StaffRoute>
                    <StaffPage />
                  </StaffRoute>
                } />
                
                <Route path="/performance-report" element={
                  <StaffRoute>
                    <PerformanceReportPage />
                  </StaffRoute>
                } />
                
                {/* Power User routes */}
                <Route path="/power-user" element={
                  <PowerUserRoute>
                    <PowerUserPage />
                  </PowerUserRoute>
                } />
                
                {/* Admin-only routes */}
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
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
              </ErrorBoundary>
              <Toaster />
              <Sonner />
            </QueueProvider>
          </QueryClientProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
