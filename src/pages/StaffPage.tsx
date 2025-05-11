
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAppointments } from '@/hooks/use-appointments';
import StaffAppointmentTable from '@/components/StaffAppointmentTable';
import { useTranslation } from 'react-i18next';

const StaffPage = () => {
  const { user, role } = useAuth();
  const { appointments, loading, refreshAppointments } = useAppointments();
  const { t } = useTranslation();
  
  // Filter to only show active appointments (not completed or cancelled)
  const activeAppointments = appointments.filter(
    (appointment) => !['completed', 'cancelled', 'no_show'].includes(appointment.status)
  );
  
  const handleStatusChange = () => {
    refreshAppointments();
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t('staff.dashboard')}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('staff.activeAppointments')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('staff.loggedInAs')} {user?.email} ({t('staff.role')} {role})
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" aria-label={t('common.loading')}></div>
          </div>
        ) : (
          <StaffAppointmentTable 
            appointments={activeAppointments} 
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
      
      <div className="flex space-x-4">
        <Button asChild>
          <Link to="/">{t('common.backToHome')}</Link>
        </Button>
        {role === 'admin' && (
          <Button asChild>
            <Link to="/admin">{t('admin.dashboard')}</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default StaffPage;
