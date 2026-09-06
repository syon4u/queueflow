
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Menu, X, User, Calendar, Search, BarChart3, Settings, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface NavigationProps {
  showStaffAccess: boolean;
  onToggleStaffAccess: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ showStaffAccess, onToggleStaffAccess }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, role, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getRoleBasedLinks = () => {
    const links = [];
    
    if (user) {
      links.push({ to: '/profile', icon: User, label: 'Profile' });
      links.push({ to: '/new-appointment', icon: Calendar, label: 'New Appointment' });
    }
    
    if (role === 'admin') {
      links.push({ to: '/admin', icon: Settings, label: 'Admin Dashboard' });
      links.push({ to: '/backend-health', icon: BarChart3, label: 'System Health' });
    }
    
    if (role === 'power_user') {
      links.push({ to: '/power-user', icon: BarChart3, label: 'Power User Dashboard' });
    }
    
    if (role === 'staff' || role === 'power_user' || role === 'admin') {
      links.push({ to: '/staff', icon: User, label: 'Staff Dashboard' });
      links.push({ to: '/performance-report', icon: BarChart3, label: 'Performance Report' });
    }
    
    return links;
  };

  const publicLinks = [
    { to: '/appointment-lookup', icon: Search, label: 'Find Appointment' },
    { to: '/check-in', icon: Calendar, label: "I'm Here" },
    { to: '/status', icon: Clock, label: 'Queue Status' },
    { to: '/pricing', icon: Tag, label: 'Pricing' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Queue Flow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Public Links */}
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}

            {/* Role-based Links */}
            {getRoleBasedLinks().map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}

            <LanguageSwitcher />
            
            <div className="ml-4 pl-4 border-l border-gray-200 flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {user.email} ({role})
                  </span>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={onToggleStaffAccess}>
                    Employee Login
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {/* Public Links */}
              {publicLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              ))}

              {/* Role-based Links */}
              {getRoleBasedLinks().map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              ))}

              <div className="px-4 py-2">
                <LanguageSwitcher />
              </div>
              
              <div className="px-4 py-2 border-t border-gray-200 mt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      {user.email} ({role})
                    </div>
                    <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start" onClick={onToggleStaffAccess}>
                      Employee Login
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
