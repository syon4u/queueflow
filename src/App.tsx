
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CustomerPage from "./pages/CustomerPage";
import NewAppointmentPage from "./pages/NewAppointmentPage";
import CustomerAppointmentPage from "./pages/CustomerAppointmentPage";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PowerUserDashboard from "./pages/PowerUserDashboard";
import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/Login";
import AuthPage from "./pages/AuthPage";
import ResetPassword from "./pages/ResetPassword";
import Unauthorized from "./pages/Unauthorized";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/new-appointment" element={<NewAppointmentPage />} />
          <Route path="/customer-appointment" element={<CustomerAppointmentPage />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/power-user" element={<PowerUserDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
