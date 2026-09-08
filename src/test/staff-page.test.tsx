import React from 'react';

import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './test-utils';
import StaffPage from '../pages/StaffPage';
import { useAuth } from '../context/AuthContext';
import { QueueProvider } from '../context/QueueContext';

// Extract the needed utilities from the testing library

// Mock the auth context
vi.mock('../context/AuthContext', () => {
  const auth = {
    user: { id: 'mock-user-id', email: 'test@example.com' },
    role: 'staff',
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
    appointments: [
      { id: 'appt1', status: 'waiting' },
      { id: 'appt2', status: 'in-progress' },
    ],
    loading: false,
    error: null,
    userPosition: 0,
    estimatedWaitTime: 10,
    refreshAppointments: vi.fn(),
  }),
}));

describe('StaffPage', () => {
  it('renders the staff dashboard heading', async () => {
    renderWithProviders(<StaffPage />);
    // i18n is mocked to echo keys in setup.ts
    expect(await screen.findByRole('heading', { name: 'Staff Dashboard' })).toBeInTheDocument();
  });

  it('mounts without throwing when the queue hook returns appointments', async () => {
    const { container } = renderWithProviders(<StaffPage />);
    await screen.findByRole('heading', { name: 'Staff Dashboard' });
    expect(container.firstChild).not.toBeNull();
  });
});
