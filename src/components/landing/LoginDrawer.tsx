
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { useAuthMethods } from '@/context/auth/useAuthMethods';
import { useNavigate } from 'react-router-dom';

interface LoginDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginDrawer: React.FC<LoginDrawerProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { signInWithEmail } = useAuthMethods();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    admin: { email: '', password: '' },
    powerUser: { email: '', password: '' },
    staff: { email: '', password: '' }
  });

  const handleLogin = async (role: 'admin' | 'powerUser' | 'staff') => {
    setIsLoading(true);
    try {
      const data = formData[role];
      await signInWithEmail(data.email, data.password);
      
      // Route based on role
      const routes = {
        admin: '/admin',
        powerUser: '/power-user',
        staff: '/staff'
      };
      
      navigate(routes[role]);
      onClose();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (role: 'admin' | 'powerUser' | 'staff', field: 'email' | 'password', value: string) => {
    setFormData(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [field]: value
      }
    }));
  };

  const renderLoginForm = (role: 'admin' | 'powerUser' | 'staff', title: string) => (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor={`${role}-email`}>{t('common.email', 'Email')}</Label>
        <Input
          id={`${role}-email`}
          type="email"
          placeholder={t('auth.emailPlaceholder', 'Enter your email')}
          value={formData[role].email}
          onChange={(e) => handleInputChange(role, 'email', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${role}-password`}>{t('common.password', 'Password')}</Label>
        <Input
          id={`${role}-password`}
          type="password"
          placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
          value={formData[role].password}
          onChange={(e) => handleInputChange(role, 'password', e.target.value)}
        />
      </div>
      <Button 
        className="w-full" 
        onClick={() => handleLogin(role)}
        disabled={isLoading || !formData[role].email || !formData[role].password}
      >
        {isLoading ? t('auth.signingIn', 'Signing in...') : t('auth.signIn', 'Sign In')}
      </Button>
    </div>
  );

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[600px] w-full sm:w-96 ml-auto">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle>{t('auth.accessPanel', 'Access Panel')}</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="flex-1 px-4">
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="admin">{t('auth.admin', 'Admin')}</TabsTrigger>
              <TabsTrigger value="powerUser">{t('auth.powerUser', 'Power User')}</TabsTrigger>
              <TabsTrigger value="staff">{t('auth.staff', 'Staff')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="admin">
              {renderLoginForm('admin', t('auth.adminLogin', 'Admin Login'))}
            </TabsContent>
            
            <TabsContent value="powerUser">
              {renderLoginForm('powerUser', t('auth.powerUserLogin', 'Power User Login'))}
            </TabsContent>
            
            <TabsContent value="staff">
              {renderLoginForm('staff', t('auth.staffLogin', 'Staff Login'))}
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default LoginDrawer;
