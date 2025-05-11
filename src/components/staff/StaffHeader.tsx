
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Keyboard, Settings, UserCircle, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';

interface StaffHeaderProps {
  user: User | null;
  role: string | null;
  onToggleShortcuts: () => void;
}

const StaffHeader: React.FC<StaffHeaderProps> = ({ user, role, onToggleShortcuts }) => {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <UserCircle className="h-6 w-6 text-primary" />
          <div>
            <span className="text-sm font-medium">{user?.email}</span>
            <span className="text-xs text-muted-foreground ml-2">({t(`roles.${role || 'customer'}`)})</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={onToggleShortcuts} title={t('staff.keyboardShortcuts')}>
            <Keyboard className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" title={t('common.settings')}>
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={signOut} title={t('auth.signOut')}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default StaffHeader;
