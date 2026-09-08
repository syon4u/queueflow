import React from 'react';

import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import CustomerPage from '../pages/CustomerPage';
import { useAuth } from '../context/AuthContext';
import { QueueProvider } from '../context/QueueContext';

// Extract the needed utilities from the testing library

// Mock the auth context
vi.mock('../context/AuthContext', () => {
  const auth = {
    user: { id: 'mock-user-id', email: 'test@example.com' },
    role: 'customer',
    loading: false,
    signIn: vi.fn(), signOut: vi.fn(), signUp: vi.fn(),
  };
  return {
    // renderWithProviders wraps in AuthProvider; keep it a passthrough when mocked.
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
    useAuth: () => auth,
    useMinimalAuth: () => ({ user: auth.user, role: auth.role }),
  };
});

// Mock the useAppointments hook
vi.mock('../hooks/use-appointments', () => ({
  useAppointments: vi.fn().mockReturnValue({
    appointments: [],
    loading: false,
    error: null,
    userPosition: 0,
    estimatedWaitTime: 10,
    refreshAppointments: vi.fn(),
  }),
}));

describe('CustomerPage', () => {
  it('renders the appointment request form', async () => {
    renderWithProviders(<CustomerPage />);
    expect(await screen.findByText(/request an appointment/i)).toBeInTheDocument();
  });

});
