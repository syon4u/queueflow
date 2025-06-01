import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { getVersionString } from '@/version';
import { useAuth } from '@/context/AuthContext';
import BrowardLayout from '@/components/layout/BrowardLayout';
import BrowardHero from '@/components/layout/BrowardHero';
import BrowardCard from '@/components/ui/broward-card';
import BrowardButton from '@/components/ui/broward-button';

const Unauthorized = () => {
  const { t } = useTranslation();
  const { role, user } = useAuth();
  const location = useLocation();
  
  // Extract the page the user was trying to access
  const fromPage = location.state?.from?.pathname || "/restricted-page";
  
  return (
    <BrowardLayout headerTitle="Access Denied">
      <BrowardHero 
        title="Unauthorized Access" 
        subtitle="You don't have permission to access this page"
        backgroundStyle="gradient"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <BrowardCard elevation="md">
            <div className="flex justify-center mb-6">
              <ShieldAlert size={64} className="text-bc-gold" />
            </div>
            
            <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md text-left mb-6">
              <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">User details:</div>
              <div className="font-medium text-bc-navy dark:text-bc-blue">{user?.email}</div>
              <div className="text-sm mt-2 text-neutral-600 dark:text-neutral-400 mb-1">Current role:</div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bc-blue/10 text-bc-blue">
                {role || 'customer'}
              </span>
            </div>
            
            <div className="space-y-4">
              <BrowardButton asChild className="w-full">
                <Link to="/">{t('unauthorized.backToHome', 'Return to Home')}</Link>
              </BrowardButton>
              
              {role === 'customer' && (
                <BrowardButton asChild variant="outline" className="w-full">
                  <Link to="/customer">{t('unauthorized.customerDashboard', 'Go to Customer Dashboard')}</Link>
                </BrowardButton>
              )}
              
              {role === 'staff' && (
                <BrowardButton asChild variant="outline" className="w-full">
                  <Link to="/staff">{t('unauthorized.staffDashboard', 'Go to Staff Dashboard')}</Link>
                </BrowardButton>
              )}
              
              {role === 'admin' && (
                <BrowardButton asChild variant="outline" className="w-full">
                  <Link to="/admin">{t('unauthorized.adminDashboard', 'Go to Admin Dashboard')}</Link>
                </BrowardButton>
              )}
            </div>
            
            <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
              <p>QUEUE FLOW {getVersionString()}</p>
            </div>
          </BrowardCard>
        </div>
      </div>
    </BrowardLayout>
  );
};

export default Unauthorized;