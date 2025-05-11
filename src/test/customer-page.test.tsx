
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomerPage from '@/pages/CustomerPage';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/components/ServiceSelector', () => ({
  default: ({ value, onChange }: any) => (
    <select 
      data-testid="service-selector" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select Service</option>
      <option value="service-1">Service 1</option>
    </select>
  ),
}));

vi.mock('@/components/LocationSelector', () => ({
  default: ({ value, onChange }: any) => (
    <select 
      data-testid="location-selector" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select Location</option>
      <option value="location-1">Location 1</option>
    </select>
  ),
}));

vi.mock('@/components/TimePicker', () => ({
  default: ({ date, onDateChange, time, onTimeChange }: any) => (
    <div>
      <input 
        data-testid="date-picker" 
        type="date" 
        value={date ? date.toISOString().split('T')[0] : ''} 
        onChange={(e) => onDateChange(new Date(e.target.value))}
      />
      <select 
        data-testid="time-picker" 
        value={time} 
        onChange={(e) => onTimeChange(e.target.value)}
      >
        <option value="9:00 AM">9:00 AM</option>
        <option value="10:00 AM">10:00 AM</option>
      </select>
    </div>
  ),
}));

vi.mock('@/hooks/use-appointments', () => ({
  useAppointments: () => ({
    userPosition: 3,
    estimatedWaitTime: 15,
    refreshAppointments: vi.fn(),
  }),
}));

describe('CustomerPage', () => {
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

  it('should render form and submit appointment', async () => {
    // Mock successful appointment creation
    vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
      data: { id: 'new-appointment-id' },
      error: null,
    } as any);

    render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CustomerPage />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    );

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: 'Test User' },
    });
    
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '1234567890' },
    });
    
    fireEvent.change(screen.getByTestId('service-selector'), {
      target: { value: 'service-1' },
    });
    
    fireEvent.change(screen.getByTestId('location-selector'), {
      target: { value: 'location-1' },
    });
    
    fireEvent.change(screen.getByTestId('date-picker'), {
      target: { value: '2025-06-01' },
    });
    
    fireEvent.change(screen.getByTestId('time-picker'), {
      target: { value: '10:00 AM' },
    });
    
    fireEvent.change(screen.getByLabelText(/Notes/i), {
      target: { value: 'Test notes' },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Schedule Appointment/i));

    // Verify appointment creation was called
    await waitFor(() => {
      expect(supabase.functions.invoke).toHaveBeenCalledWith('appointments', {
        method: 'POST',
        body: expect.any(String),
      });
    });
  });
});
