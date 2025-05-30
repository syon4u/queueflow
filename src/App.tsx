
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Index from './pages/Index';
import CustomerPage from './pages/CustomerPage';
import NotFound from './pages/NotFound';

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  }
});

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
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/customer" element={<CustomerPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
