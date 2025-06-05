import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from './components/ui/toaster';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import StaffPage from './pages/StaffPage';
import CustomerPage from './pages/CustomerPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import StaffManagementPage from './pages/StaffManagementPage';
import EmployeeManagementPage from './pages/EmployeeManagementPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
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
                
                {/* Consolidated user management routes */}
                <Route 
                  path="/staff-management" 
                  element={
                    <ProtectedRoute>
                      <StaffManagementPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/employee-management" 
                  element={
                    <ProtectedRoute>
                      <EmployeeManagementPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Keep existing /staff route for backward compatibility */}
                <Route 
                  path="/staff" 
                  element={
                    <ProtectedRoute>
                      <StaffPage />
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
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </div>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
