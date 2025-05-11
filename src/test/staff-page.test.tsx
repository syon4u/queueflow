import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import * as testingLibrary from '@testing-library/react';
const { screen, fireEvent } = testingLibrary;
import StaffPage from '../pages/StaffPage';
import { useAuth } from '../context/AuthContext';
import QueueContext from '../context/QueueContext';

// Mock the auth context
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn().mockReturnValue({
    user: { id: 'mock-user-id' },
    role: 'staff',
  }),
}));

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
  it('renders the StaffPage component', () => {
    const contextValue = {
      appointments: [
        { id: 'appt1', status: 'waiting' },
        { id: 'appt2', status: 'in-progress' },
      ],
      loading: false,
      error: null,
      userPosition: 0,
      estimatedWaitTime: 10,
      refreshAppointments: vi.fn(),
      updateAppointmentStatus: vi.fn(),
    };

    render(
      <QueueContext.Provider value={contextValue}>
        <StaffPage />
      </QueueContext.Provider>
    );

    expect(screen.getByText('Staff Page')).toBeInTheDocument();
  });

  it('displays appointments', () => {
    const contextValue = {
      appointments: [
        { id: 'appt1', status: 'waiting' },
        { id: 'appt2', status: 'in-progress' },
      ],
      loading: false,
      error: null,
      userPosition: 0,
      estimatedWaitTime: 10,
      refreshAppointments: vi.fn(),
      updateAppointmentStatus: vi.fn(),
    };

    render(
      <QueueContext.Provider value={contextValue}>
        <StaffPage />
      </QueueContext.Provider>
    );

    expect(screen.getByText('appt1')).toBeInTheDocument();
    expect(screen.getByText('appt2')).toBeInTheDocument();
  });
});
