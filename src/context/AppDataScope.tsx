import React from 'react';
import { Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueueProvider } from '@/context/QueueContext';

// One client for the app's lifetime, created when this chunk first loads.
const queryClient = new QueryClient();

/**
 * Layout route for every page except the landing page: react-query plus the
 * live queue (QueueProvider subscribes to Supabase as soon as it mounts).
 * App.tsx loads it lazily, so the landing route never downloads react-query,
 * the queue hooks or supabase-js just to render marketing copy.
 */
const AppDataScope: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <QueueProvider>
      <Outlet />
    </QueueProvider>
  </QueryClientProvider>
);

export default AppDataScope;
