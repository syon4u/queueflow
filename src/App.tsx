
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute, AdminRoute, StaffRoute, PowerUserRoute } from '@/components/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Everything the landing page does not need stays out of the main chunk:
// react-query + the live queue (AppDataScope wraps every other route) and
// the two toast hosts, which render nothing until a toast fires.
const AppDataScope = React.lazy(() => import('@/context/AppDataScope'));
const Toaster = React.lazy(() => import('@/components/ui/toaster').then((m) => ({ default: m.Toaster })));
const Sonner = React.lazy(() => import('@/components/ui/sonner').then((m) => ({ default: m.Toaster })));

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
const PrivacyPage = React.lazy(() => import('@/pages/PrivacyPage'));
const TermsPage = React.lazy(() => import('@/pages/TermsPage'));
const AccessibilityPage = React.lazy(() => import('@/pages/AccessibilityPage'));
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
const DesignSystemPage = React.lazy(() => import('@/pages/DesignSystemPage'));
const DesignSystemIndexPage = React.lazy(() => import('@/pages/DesignSystemIndexPage'));

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <div className="min-h-screen bg-background">
        <AuthProvider>
          <ErrorBoundary>
          <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">Loading…</div>}>
          <Routes>
            {/* Landing page: rendered from the main chunk, without the app data layer. */}
            <Route path="/" element={<Index />} />

            {/* Every other route runs inside react-query + QueueProvider. */}
            <Route element={<AppDataScope />}>
              {/* Public routes */}
              <Route path="/customer" element={<CustomerPage />} />
              <Route path="/appointment-lookup" element={<AppointmentLookupPage />} />
              <Route path="/auth" element={<AuthPage />} />
              {/* /login was a second, divergent sign-in page; /auth is canonical. */}
              <Route path="/login" element={<Navigate to="/auth" replace />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/check-in" element={<CheckInPage />} />
              <Route path="/status" element={<StatusPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/accessibility" element={<AccessibilityPage />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
            
              {/* Kiosk and signage routes */}
              <Route path="/kiosk" element={<KioskPage />} />
              <Route path="/digital-signage" element={<DigitalSignagePage />} />
              <Route path="/mobile-queue" element={<MobileQueuePage />} />
              <Route path="/virtual-queue" element={<VirtualQueuePage />} />
            
              {/* Design system routes */}
              <Route path="/design-system" element={<AdminRoute><DesignSystemPage /></AdminRoute>} />
              <Route path="/design-system/index" element={<AdminRoute><DesignSystemIndexPage /></AdminRoute>} />
            
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
            </Route>
          </Routes>
          </Suspense>
          </ErrorBoundary>
          <Suspense fallback={null}>
            <Toaster />
            <Sonner />
          </Suspense>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
