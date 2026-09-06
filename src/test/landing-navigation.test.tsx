
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CTASection from '@/components/landing/CTASection';
import Navigation from '@/components/landing/Navigation';
import { renderWithProviders } from './test-utils';
import StatusPage from '@/pages/StatusPage';

// Mock the react-router-dom to track navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the useQueueStatus hook
vi.mock('@/hooks/useQueueStatus', () => ({
  useQueueStatus: () => ({
    data: {
      id: 'test-id',
      status: 'scheduled',
      is_checked_in: false,
      customer_name: 'Test User',
      location_name: 'Test Location',
      service_name: 'Test Service',
      scheduled_at: '2025-06-06T10:00:00Z',
      position: null,
      estimated_wait_time_minutes: 0,
      check_in_time: null,
      ticket_number: 'TEST-123'
    },
    isLoading: false,
    error: null,
    refetch: vi.fn()
  })
}));

// Navigation reads useAuth(); render it inside the full provider stack.
const renderWithRouter = (component: React.ReactElement) => renderWithProviders(component);

describe('Landing Page Navigation', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('CTASection', () => {
    it('renders Check Status button with correct link', () => {
      const { getByRole } = renderWithRouter(<CTASection />);
      
      const checkStatusButton = getByRole('link', { name: /check status/i });
      expect(checkStatusButton).toBeInTheDocument();
      expect(checkStatusButton).toHaveAttribute('href', '/status');
    });

    it('renders Check In Now button with correct link', () => {
      const { getByRole } = renderWithRouter(<CTASection />);
      
      const checkInButton = getByRole('link', { name: /check in now/i });
      expect(checkInButton).toBeInTheDocument();
      expect(checkInButton).toHaveAttribute('href', '/check-in');
    });

    it('renders Book Appointment button with correct link', () => {
      const { getByRole } = renderWithRouter(<CTASection />);
      
      const bookButton = getByRole('link', { name: /book appointment/i });
      expect(bookButton).toBeInTheDocument();
      expect(bookButton).toHaveAttribute('href', '/customer');
    });
  });

  describe('Navigation', () => {
    const defaultProps = {
      showStaffAccess: false,
      onToggleStaffAccess: vi.fn(),
    };

    it('renders desktop navigation links correctly', () => {
      // Check desktop navigation links
      const { getAllByRole } = renderWithRouter(<Navigation {...defaultProps} />);
      const hrefs = getAllByRole('link').map((a) => a.getAttribute('href'));
      expect(hrefs).toContain('/status');
      expect(hrefs).toContain('/check-in');
      expect(hrefs).toContain('/appointment-lookup');
      expect(hrefs).toContain('/pricing');
    });

    it('opens mobile menu and shows navigation links', async () => {
      const user = userEvent.setup();
      const { getByRole, getAllByRole } = renderWithRouter(<Navigation {...defaultProps} />);
      
      // Find and click the mobile menu button
      const menuButton = getByRole('button', { name: /open menu/i });
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      await user.click(menuButton);
      expect(getByRole('button', { name: /close menu/i })).toHaveAttribute('aria-expanded', 'true');

      // Mobile menu duplicates the public links
      const statusLinks = getAllByRole('link').filter((a) => a.getAttribute('href') === '/status');
      expect(statusLinks.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('StatusPage Check In Navigation', () => {
    it('renders Check In Now button with correct link when appointment is scheduled', () => {
      const { getByRole } = renderWithRouter(<StatusPage />);
      
      // First submit the form to show status data
      const confirmationInput = getByRole('textbox', { name: /confirmation number/i });
      const submitButton = getByRole('button', { name: /find my status/i });
      
      // Mock form submission would trigger the status display
      // The Check In Now button should appear for scheduled appointments
      const checkInButton = getByRole('link', { name: /check in now/i });
      expect(checkInButton).toBeInTheDocument();
      expect(checkInButton).toHaveAttribute('href', '/check-in');
    });
  });
});
