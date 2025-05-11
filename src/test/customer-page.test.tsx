import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import * as testingLibrary from '@testing-library/react';
const { screen, fireEvent, waitFor } = testingLibrary;
import CustomerPage from '../pages/CustomerPage';
import { BrowserRouter } from 'react-router-dom';

describe('CustomerPage', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <CustomerPage />
      </BrowserRouter>
    );
    expect(screen.getByText('Customer Page')).toBeInTheDocument();
  });

  it('displays a message when no appointments are available', () => {
    // Mock the useAppointments hook to return no appointments
    vi.mock('../hooks/use-appointments', () => ({
      useAppointments: vi.fn().mockReturnValue({
        appointments: [],
        loading: false,
        error: null,
        userPosition: null,
        estimatedWaitTime: null,
        refreshAppointments: vi.fn(),
      }),
    }));

    render(
      <BrowserRouter>
        <CustomerPage />
      </BrowserRouter>
    );
    expect(screen.getByText('No appointments available.')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    // Mock the useAppointments hook to return loading state
    vi.mock('../hooks/use-appointments', () => ({
      useAppointments: vi.fn().mockReturnValue({
        appointments: [],
        loading: true,
        error: null,
        userPosition: null,
        estimatedWaitTime: null,
        refreshAppointments: vi.fn(),
      }),
    }));

    render(
      <BrowserRouter>
        <CustomerPage />
      </BrowserRouter>
    );
    expect(screen.getByText('Loading appointments...')).toBeInTheDocument();
  });

  it('displays error message when there is an error', () => {
    // Mock the useAppointments hook to return an error
    vi.mock('../hooks/use-appointments', () => ({
      useAppointments: vi.fn().mockReturnValue({
        appointments: [],
        loading: false,
        error: 'Failed to fetch appointments',
        userPosition: null,
        estimatedWaitTime: null,
        refreshAppointments: vi.fn(),
      }),
    }));

    render(
      <BrowserRouter>
        <CustomerPage />
      </BrowserRouter>
    );
    expect(screen.getByText('Error: Failed to fetch appointments')).toBeInTheDocument();
  });

  it('displays user position and estimated wait time when appointments are available', () => {
    // Mock the useAppointments hook to return appointments
    vi.mock('../hooks/use-appointments', () => ({
      useAppointments: vi.fn().mockReturnValue({
        appointments: [{ id: '1' }, { id: '2' }],
        loading: false,
        error: null,
        userPosition: 1,
        estimatedWaitTime: 10,
        refreshAppointments: vi.fn(),
      }),
    }));

    render(
      <BrowserRouter>
        <CustomerPage />
      </BrowserRouter>
    );
    expect(screen.getByText('Your position in the queue: 1')).toBeInTheDocument();
    expect(screen.getByText('Estimated wait time: 10 minutes')).toBeInTheDocument();
  });
});
