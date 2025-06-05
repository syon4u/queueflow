
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { SessionProvider } from './context/SessionContext';
import Index from "./pages/Index";
import Login from "./pages/Login";
import CustomerPage from "./pages/CustomerPage";
import StaffPage from "./pages/StaffPage";
import AdminPage from "./pages/AdminPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import ProfilePage from "./pages/ProfilePage";
import NewAppointmentPage from "./pages/NewAppointmentPage";
import VirtualQueuePage from "./pages/VirtualQueuePage";
import MobileQueuePage from "./pages/MobileQueuePage";
import DigitalSignagePage from "./pages/DigitalSignagePage";
import PerformanceReportPage from "./pages/PerformanceReportPage";
import BackendHealthPage from "./pages/BackendHealthPage";
import BrowardIndex from "./pages/BrowardIndex";
import BrowardDesignSystem from "./pages/BrowardDesignSystem";
import ProtectedRoute from "./components/ProtectedRoute";
import { PWAInstallPrompt } from "./components/pwa/PWAInstallPrompt";
import './i18n/i18n';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SessionProvider>
            <Toaster />
            <Sonner />
            <PWAInstallPrompt />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/customer" element={<CustomerPage />} />
                <Route path="/staff" element={
                  <ProtectedRoute requiredRole="staff">
                    <StaffPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPage />
                  </ProtectedRoute>
                } />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/new-appointment" element={<NewAppointmentPage />} />
                <Route path="/virtual-queue" element={<VirtualQueuePage />} />
                <Route path="/mobile-queue" element={<MobileQueuePage />} />
                <Route path="/digital-signage" element={<DigitalSignagePage />} />
                <Route path="/performance" element={
                  <ProtectedRoute requiredRole="staff">
                    <PerformanceReportPage />
                  </ProtectedRoute>
                } />
                <Route path="/backend-health" element={<BackendHealthPage />} />
                <Route path="/broward" element={<BrowardIndex />} />
                <Route path="/broward-design" element={<BrowardDesignSystem />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SessionProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
