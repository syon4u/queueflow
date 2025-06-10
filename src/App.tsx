import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { QueueProvider } from '@/context/QueueContext';
import { QueryClient } from '@tanstack/react-query';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import CustomerPage from '@/pages/CustomerPage';
import StatusPage from '@/pages/StatusPage';
import CheckInPage from '@/pages/CheckInPage';
import NewAppointmentPage from '@/pages/NewAppointmentPage';
import AppointmentLookupPage from './pages/AppointmentLookupPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <AuthProvider>
          <QueueProvider>
            <QueryClient>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/customer" element={<CustomerPage />} />
                <Route path="/status" element={<StatusPage />} />
                <Route path="/check-in" element={<CheckInPage />} />
                <Route path="/new-appointment" element={<NewAppointmentPage />} />
                <Route path="/appointment-lookup" element={<AppointmentLookupPage />} />
              </Routes>
            </QueryClient>
          </QueueProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
