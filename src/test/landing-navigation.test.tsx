
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import CTASection from '@/components/landing/CTASection';
import Navigation from '@/components/landing/Navigation';

// Mock the react-router-dom to track navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

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
      const { getByRole } = renderWithRouter(<Navigation {...defaultProps} />);
      
      // Check desktop navigation links
      const statusLink = getByRole('link', { name: /^status$/i });
      const checkInLink = getByRole('link', { name: /^check in$/i });
      const bookLink = getByRole('link', { name: /book/i });
      
      expect(statusLink).toHaveAttribute('href', '/status');
      expect(checkInLink).toHaveAttribute('href', '/check-in');
      expect(bookLink).toHaveAttribute('href', '/customer');
    });

    it('opens mobile menu and shows navigation links', async () => {
      const user = userEvent.setup();
      const { getByRole } = renderWithRouter(<Navigation {...defaultProps} />);
      
      // Find and click the mobile menu button
      const menuButton = getByRole('button', { name: /menu/i });
      await user.click(menuButton);
      
      // Check mobile navigation links
      const mobileStatusLink = getByRole('link', { name: /check status/i });
      const mobileCheckInLink = getByRole('link', { name: /check in now/i });
      
      expect(mobileStatusLink).toHaveAttribute('href', '/status');
      expect(mobileCheckInLink).toHaveAttribute('href', '/check-in');
    });
  });
});
