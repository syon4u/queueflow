
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import LoginDrawer from './LoginDrawer';

interface NavigationProps {
  showStaffAccess: boolean;
  onToggleStaffAccess: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ showStaffAccess, onToggleStaffAccess }) => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginDrawerOpen, setLoginDrawerOpen] = useState(false);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {t('landing.appName', 'Queue Flow')}
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSelector />
              <div className="ml-4 pl-4 border-l border-gray-200">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setLoginDrawerOpen(true)}
                >
                  {t('auth.access', 'Access')}
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
                <div className="flex justify-center mb-4">
                  <LanguageSelector />
                </div>
                <Button 
                  variant="outline" 
                  className="justify-start" 
                  onClick={() => {
                    setLoginDrawerOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  {t('auth.access', 'Access')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <LoginDrawer 
        isOpen={loginDrawerOpen} 
        onClose={() => setLoginDrawerOpen(false)} 
      />
    </>
  );
};

export default Navigation;
