
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Users, Settings, LogOut, LogIn } from 'lucide-react';

const UserMenu: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
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
            <span className="text-white/95 font-medium drop-shadow text-sm">
              {user.email}
            </span>
          </div>
        )}
        
        <Button
          onClick={toggleMenu}
          variant="outline"
          size="sm"
          className="bg-white/20 hover:bg-white/30 text-white font-medium border-white/20 hover:border-white/40 drop-shadow-lg hover:scale-105 transition-all duration-200"
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
                onClick={() => handleMenuItemClick('/login')}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
              >
                <LogIn className="h-4 w-4 text-green-600" />
                Staff Login
              </button>
            )}
            {user && (
              <>
                <button
                  onClick={() => handleMenuItemClick('/staff')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Users className="h-4 w-4 text-blue-600" />
                  Staff Portal
                </button>
                <button
                  onClick={() => handleMenuItemClick('/admin')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Settings className="h-4 w-4 text-amber-600" />
                  Admin Portal
                </button>
                <div className="border-t my-1"></div>
                <button
                  onClick={() => {
                    handleLogout();
                    setShowMenu(false);
                  }}
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
