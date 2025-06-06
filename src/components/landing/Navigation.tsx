
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface NavigationProps {
  showStaffAccess: boolean;
  onToggleStaffAccess: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ showStaffAccess, onToggleStaffAccess }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Queue Flow</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            <div className="ml-4 pl-4 border-l border-gray-200">
              <Button variant="outline" size="sm" onClick={onToggleStaffAccess}>
                Employee Login
              </Button>
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
              <div className="px-4 py-2">
                <LanguageSwitcher />
              </div>
              <Button variant="outline" className="justify-start mt-4" onClick={onToggleStaffAccess}>
                Employee Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
