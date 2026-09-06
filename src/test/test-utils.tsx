import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { QueueProvider } from '@/context/QueueContext';

/**
 * Renders a component inside the same provider stack App.tsx uses, so
 * page-level components (which call useAuth / useQuery / useQueue) can be
 * tested without each test re-assembling the tree.
 */
export function renderWithProviders(
  ui: React.ReactElement,
  { route = '/', ...options }: RenderOptions & { route?: string } = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <QueueProvider>{children}</QueueProvider>
        </QueryClientProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  return render(ui, { wrapper: Wrapper, ...options });
}
