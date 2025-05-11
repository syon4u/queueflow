import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Menu, X, ChevronDown, PieChart } from 'lucide-react';

interface StaffHeaderProps {
  user?: User | null;
  role?: string;
  onToggleShortcuts?: () => void;
}

const StaffHeader: React.FC<StaffHeaderProps> = ({ user, role, onToggleShortcuts }) => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                alt="Workflow"
              />
            </Link>
            
            <nav className="hidden md:flex items-center space-x-4">
              <Link to="/staff" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                {t('staff.dashboard')}
              </Link>
              
              <Link to="/performance" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                <PieChart className="h-4 w-4 mr-1" />
                {t('performance.reports')}
              </Link>
              
              {role === 'admin' && (
                <Link to="/admin" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  {t('admin.dashboard')}
                </Link>
              )}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            <Button variant="outline" size="sm" onClick={onToggleShortcuts}>
              {t('common.shortcuts')}
            </Button>
            
            <div className="hidden md:flex items-center">
              {user && (
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">{user.email}</div>
                  <div className="text-xs text-gray-500">
                    {t('staff.loggedInAs')} {role}
                  </div>
                </div>
              )}
            </div>
            
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMobileMenu}
                type="button"
                className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden absolute top-16 inset-x-0 z-50 bg-white shadow-lg rounded-b-lg`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/staff" 
            className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMobileMenu}
          >
            {t('staff.dashboard')}
          </Link>
          
          <Link 
            to="/performance" 
            className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMobileMenu}
          >
            {t('performance.reports')}
          </Link>
          
          {role === 'admin' && (
            <Link 
              to="/admin" 
              className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMobileMenu}
            >
              {t('admin.dashboard')}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default StaffHeader;
