
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import Index from './pages/Index';
import Login from './pages/Login';
import StaffPage from './pages/StaffPage';
import AdminPage from './pages/AdminPage';
import CustomerPage from './pages/CustomerPage';
import ProfilePage from './pages/ProfilePage';
import AppointmentsPage from './pages/AppointmentsPage';
import NewAppointmentPage from './pages/NewAppointmentPage';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import PerformanceReportPage from './pages/PerformanceReportPage';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set default language based on browser settings or a default value
    const storedLanguage = localStorage.getItem('i18nextLng') || navigator.language || 'en';
    i18n.changeLanguage(storedLanguage);
  }, [i18n]);
  
  return (
    <div className="App">
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/staff" 
              element={
                <ProtectedRoute requiredRoles={['staff', 'admin']}>
                  <StaffPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/performance" 
              element={
                <ProtectedRoute requiredRoles={['staff', 'admin']}>
                  <PerformanceReportPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/customer" 
              element={
                <ProtectedRoute requiredRoles={['customer']}>
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
                <ProtectedRoute requiredRoles={['customer']}>
                  <NewAppointmentPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
