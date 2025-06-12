
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n/i18n.ts';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import { AuthProvider, MinimalAuthContext } from './context/AuthContext';

// Create a container for the app
const container = document.getElementById('root');

// Ensure the container exists
if (!container) {
  throw new Error('Root element not found. Make sure there is a div with id "root" in your HTML.');
}

// Create root and render app
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <MinimalAuthContext.Provider value={{ user: null, role: null }}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </MinimalAuthContext.Provider>
    </AuthProvider>
  </React.StrictMode>
);
