
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { QueueProvider } from '@/context/QueueContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CustomerPage from '@/pages/CustomerPage';
import AppointmentLookupPage from './pages/AppointmentLookupPage';

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
                <Route path="/" element={<CustomerPage />} />
                <Route path="/customer" element={<CustomerPage />} />
                <Route path="/appointment-lookup" element={<AppointmentLookupPage />} />
              </Routes>
            </QueueProvider>
          </QueryClientProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
