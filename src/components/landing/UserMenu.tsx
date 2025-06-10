
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Users, Settings, LogOut, LogIn, Shield } from 'lucide-react';

const UserMenu: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { user, role, signOut, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      setShowMenu(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleMenuItemClick = (route: string) => {
    navigate(route);
    setShowMenu(false);
  };

  return (
    <div className="absolute top-4 right-4 z-20">
      <div className="flex items-center gap-3">
        {user && (
          <div className="bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
            <div className="text-white/95 font-medium drop-shadow text-sm">
              {user.email}
            </div>
            {role && (
              <div className="text-white/75 text-xs capitalize">
                {role.replace('_', ' ')}
              </div>
            )}
          </div>
        )}
        
        <Button
          onClick={toggleMenu}
          variant="outline"
          size="sm"
          className="bg-white/20 hover:bg-white/30 text-white font-medium border-white/20 hover:border-white/40 drop-shadow-lg hover:scale-105 transition-all duration-200"
          disabled={loading}
        >
          {showMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Dropdown Menu */}
      {showMenu && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border min-w-48 z-30">
          <div className="py-2">
            {!user && (
              <button
                onClick={() => handleMenuItemClick('/auth')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <LogIn className="h-4 w-4 text-green-600" />
                Staff Login
              </button>
            )}
            
            {user && (
              <>
                {/* Show navigation options based on user role */}
                {(role === 'staff' || role === 'power_user' || role === 'admin') && (
                  <button
                    onClick={() => handleMenuItemClick('/staff')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Users className="h-4 w-4 text-blue-600" />
                    Staff Portal
                  </button>
                )}
                
                {(role === 'power_user' || role === 'admin') && (
                  <button
                    onClick={() => handleMenuItemClick('/power-user')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4 text-purple-600" />
                    Power User
                  </button>
                )}
                
                {role === 'admin' && (
                  <button
                    onClick={() => handleMenuItemClick('/admin')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4 text-amber-600" />
                    Admin Portal
                  </button>
                )}
                
                <div className="border-t my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
