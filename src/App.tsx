
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { QueueProvider } from '@/context/QueueContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute, AdminRoute, StaffRoute, PowerUserRoute } from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';

// Public pages
import Index from '@/pages/Index';
import CustomerPage from '@/pages/CustomerPage';
import AppointmentLookupPage from './pages/AppointmentLookupPage';
import AuthPage from '@/pages/AuthPage';
import Login from '@/pages/Login';
import ResetPassword from '@/pages/ResetPassword';
import CheckInPage from '@/pages/CheckInPage';
import KioskPage from '@/pages/KioskPage';
import DigitalSignagePage from '@/pages/DigitalSignagePage';
import MobileQueuePage from '@/pages/MobileQueuePage';
import VirtualQueuePage from '@/pages/VirtualQueuePage';
import StatusPage from '@/pages/StatusPage';
import PricingPage from '@/pages/PricingPage';
import Unauthorized from '@/pages/Unauthorized';
import NotFound from '@/pages/NotFound';

// Protected pages
import AdminPage from '@/pages/AdminPage';
import StaffPage from '@/pages/StaffPage';
import PowerUserPage from '@/pages/PowerUserPage';
import ProfilePage from '@/pages/ProfilePage';
import NewAppointmentPage from '@/pages/NewAppointmentPage';
import PerformanceReportPage from '@/pages/PerformanceReportPage';
import BackendHealthPage from '@/pages/BackendHealthPage';

// Design system pages
import BrowardDesignSystem from '@/pages/BrowardDesignSystem';
import BrowardIndex from '@/pages/BrowardIndex';

// Create a query client instance
const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <QueueProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/customer" element={<CustomerPage />} />
                <Route path="/appointment-lookup" element={<AppointmentLookupPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/login" element={<Login />} />
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
