import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckmarkAnimation } from '@/components/ui/broward-icons';
import ThemeToggle from '@/components/ui/theme-toggle';
import { useAuth } from '@/context/AuthContext';

interface BrowardHeaderProps {
  title?: string;
  subtitle?: string;
}

const BrowardHeader: React.FC<BrowardHeaderProps> = ({ 
  title = "Consumer Protection Division", 
  subtitle = "Protecting Broward County residents through education, mediation, and enforcement"
}) => {
  const { user, role } = useAuth();

  return (
    <header className="bg-white border-b border-neutral-200 shadow-sm dark:bg-neutral-100 dark:border-neutral-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex">
              <ul className="flex gap-1">
                <li>
                  <Link to="/" className="nav-item">Home</Link>
                </li>
                <li>
                  <Link to="/services" className="nav-item">Services</Link>
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
                <div className="text-sm">
                  <span className="text-neutral-500 dark:text-neutral-400">
                    {user.email}
                  </span>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BrowardHeader;