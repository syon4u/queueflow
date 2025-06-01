
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Breadcrumb from '@/components/navigation/Breadcrumb';

interface AppointmentPageHeaderProps {
  onBackNavigation: () => void;
}

const AppointmentPageHeader: React.FC<AppointmentPageHeaderProps> = ({ onBackNavigation }) => {
  const { role } = useAuth();

  const getDashboardHref = () => {
    if (role === 'admin') return '/admin';
    if (role === 'staff') return '/staff';
    return '/customer';
  };

  return (
    <div className="mb-6">
      <Breadcrumb 
        items={[
          { label: 'Dashboard', href: getDashboardHref() },
          { label: 'New Appointment', isActive: true }
        ]}
        className="mb-4"
      />
      
      <Button
        variant="ghost"
        onClick={onBackNavigation}
        className="flex items-center gap-2 text-broward-navy hover:text-broward-teal"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </Button>
    </div>
  );
};

export default AppointmentPageHeader;
