
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckmarkAnimation } from '@/components/ui/broward-icons';
import ThemeToggle from '@/components/ui/theme-toggle';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, User, Settings, BarChart3, Home } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

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
    <header className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 border-b border-white/20 shadow-lg overflow-hidden">
      {/* Background pattern inspired by consumer protection */}
      <div className="absolute inset-0">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-bc-blue/90 via-purple-600/90 to-pink-500/90"></div>
        
        {/* Flowing wave pattern */}
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 90% 80%, rgba(255,255,255,0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)
          `
        }}></div>
        
        {/* Consumer protection icons pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-8 w-6 h-6 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="absolute top-4 right-16 w-5 h-5 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <path d="M14 9V5a3 3 0 0 0-6 0v4"/>
              <rect x="2" y="9" width="20" height="12" rx="2" ry="2"/>
            </svg>
          </div>
          <div className="absolute top-1 right-1/3 w-4 h-4 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <path d="M9 12l2 2 4-4"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <div className="absolute top-3 left-1/4 w-5 h-5 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <path d="M20 8v6M23 11h-6"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <ShieldCheckmarkAnimation size={40} className="text-white drop-shadow-lg group-hover:scale-105 transition-transform duration-200" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-white drop-shadow-lg">
                  Broward County
                </h1>
                <p className="text-sm text-white/95 drop-shadow font-medium">
                  {title}
                </p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex">
              <ul className="flex gap-1">
                <li></li>
                <li></li>
                <li></li>
                {(role === 'staff' || role === 'admin') && <li></li>}
                {role === 'admin' && <li></li>}
              </ul>
            </nav>
            
            <div className="flex items-center gap-4">
              {/* Language Switcher - moved to the left */}
              <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                <LanguageSwitcher />
              </div>
              
              {/* Dark Mode Toggle */}
              <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                <ThemeToggle />
              </div>
              
              {/* Hamburger menu - always visible */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {/* Customer Services - Always visible */}
                    <Link
                      to="/customer"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Home className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Customer Services</p>
                        <p className="text-sm text-muted-foreground">Schedule appointments and check queue</p>
                      </div>
                    </Link>

                    {/* Staff Dashboard - Show for staff and admin */}
                    {(role === 'staff' || role === 'admin') && (
                      <Link
                        to="/staff"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <User className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Staff Dashboard</p>
                          <p className="text-sm text-muted-foreground">Manage appointments and queue</p>
                        </div>
                      </Link>
                    )}
                    
                    {/* Admin Dashboard - Show only for admin */}
                    {role === 'admin' && (
                      <>
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <Settings className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Admin Dashboard</p>
                            <p className="text-sm text-muted-foreground">System administration</p>
                          </div>
                        </Link>
                        
                        <Link
                          to="/performance"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <BarChart3 className="h-5 w-5" />
                          <div>
                            <p className="font-medium">Performance Reports</p>
                            <p className="text-sm text-muted-foreground">Analytics and insights</p>
                          </div>
                        </Link>
                      </>
                    )}
                    
                    {/* Show message only for customers without additional roles */}
                    {(!role || role === 'customer') && (
                      <div className="p-3 text-center text-muted-foreground border-t">
                        <p className="text-sm">Additional options available for staff and administrators</p>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BrowardHeader;
