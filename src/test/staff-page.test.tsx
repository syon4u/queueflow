
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import StaffPage from '@/pages/StaffPage';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/components/StaffAppointmentTable', () => ({
  default: ({ appointments, onStatusChange }: any) => (
    <div>
      <div data-testid="appointment-count">{appointments.length}</div>
      <button data-testid="status-change-btn" onClick={onStatusChange}>
        Change Status
      </button>
    </div>
  ),
}));

vi.mock('@/hooks/use-appointments', () => ({
  useAppointments: () => ({
    appointments: [
      { id: '1', status: 'waiting' },
      { id: '2', status: 'in_progress' },
      { id: '3', status: 'completed' },
      { id: '4', status: 'cancelled' },
    ],
    loading: false,
    refreshAppointments: vi.fn(),
  }),
}));

vi.mock('@/context/AuthContext', async () => {
  const actual = await vi.importActual('@/context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      user: { email: 'staff@example.com' },
      role: 'staff',
    }),
  };
});

describe('StaffPage', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      }
    });
    
    vi.clearAllMocks();
  });

  it('should filter active appointments correctly', () => {
    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <StaffPage />
        </QueryClientProvider>
      </BrowserRouter>
    );

    // Should show only 2 appointments that are active (waiting and in_progress)
    expect(screen.getByTestId('appointment-count').textContent).toBe('2');
  });

  it('should call refresh function when status changes', async () => {
    const refreshMock = vi.fn();
    vi.mocked(useAppointments).mockReturnValue({
      appointments: [
        { id: '1', status: 'waiting' },
        { id: '2', status: 'in_progress' },
      ],
      loading: false,
      refreshAppointments: refreshMock,
    });

    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <StaffPage />
        </QueryClientProvider>
      </BrowserRouter>
    );

    // Click status change button
    fireEvent.click(screen.getByTestId('status-change-btn'));
    
    // Should call the refresh function
    expect(refreshMock).toHaveBeenCalled();
  });
});
