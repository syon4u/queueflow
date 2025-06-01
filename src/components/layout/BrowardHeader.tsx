import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckmarkAnimation } from '@/components/ui/broward-icons';
import ThemeToggle from '@/components/ui/theme-toggle';
import { useAuth } from '@/context/AuthContext';
import { Menu, X } from 'lucide-react';

interface BrowardHeaderProps {
  title?: string;
  subtitle?: string;
}

const BrowardHeader: React.FC<BrowardHeaderProps> = ({ 
  title = "Consumer Protection Division", 
  subtitle = "Protecting Broward County residents through education, mediation, and enforcement"
}) => {
  const { user, role, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm dark:bg-neutral-100 dark:border-neutral-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <ShieldCheckmarkAnimation size={40} />
              <div>
                <h1 className="text-xl font-serif font-bold text-bc-navy dark:text-bc-blue">
                  Broward County
                </h1>
                <p className="text-sm text-bc-teal dark:text-bc-teal">
                  {title}
                </p>
              </div>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-neutral-700 hover:bg-neutral-100"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav>
              <ul className="flex gap-1">
                <li>
                  <Link to="/" className="nav-item">Home</Link>
                </li>
                <li>
                  <Link to="/customer" className="nav-item">Customer</Link>
                </li>
                <li>
                  <Link to="/appointments" className="nav-item">Appointments</Link>
                </li>
                {(role === 'staff' || role === 'admin') && (
                  <li>
                    <Link to="/staff" className="nav-item">Staff Portal</Link>
                  </li>
                )}
                {role === 'admin' && (
                  <li>
                    <Link to="/admin" className="nav-item">Admin</Link>
                  </li>
                )}
              </ul>
            </nav>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400 hidden sm:inline">
                    {user.email}
                  </span>
                  <button 
                    onClick={() => signOut()}
                    className="text-sm text-bc-blue dark:text-bc-teal hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary text-sm py-1 px-3">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-2">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="nav-item" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/customer" className="nav-item" onClick={() => setMobileMenuOpen(false)}>Customer</Link>
              <Link to="/appointments" className="nav-item" onClick={() => setMobileMenuOpen(false)}>Appointments</Link>
              {(role === 'staff' || role === 'admin') && (
                <Link to="/staff" className="nav-item" onClick={() => setMobileMenuOpen(false)}>Staff Portal</Link>
              )}
              {role === 'admin' && (
                <Link to="/admin" className="nav-item" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
              )}
            </nav>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200">
              <ThemeToggle />
              
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {user.email}
                  </span>
                  <button 
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-sm text-bc-blue dark:text-bc-teal hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="btn btn-primary text-sm py-1 px-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default BrowardHeader;