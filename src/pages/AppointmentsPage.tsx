
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, User } from 'lucide-react';
import PageBreadcrumb from '@/components/navigation/PageBreadcrumb';
import AppointmentList from '@/components/appointments/AppointmentList';
import { useCustomerAppointments } from '@/hooks/useAppointments';

const AppointmentsPage = () => {
  const { t } = useTranslation();
  const { appointments, isLoading, cancelAppointment } = useCustomerAppointments();
  
  return (
    <div className="container mx-auto p-6">
      <PageBreadcrumb 
        items={[
          { label: 'Customer Portal', path: '/customer', icon: <User className="h-4 w-4" /> },
          { label: 'Appointments', path: '/appointments', icon: <Calendar className="h-4 w-4" /> }
        ]} 
      />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('appointments.title')}</h1>
        <Button asChild>
          <Link to="/appointments/new">{t('appointments.newAppointment')}</Link>
        </Button>
      </div>
      
      <AppointmentList 
        appointments={appointments} 
        onCancel={cancelAppointment}
        isLoading={isLoading}
      />
      
      <div className="mt-6">
        <Button asChild variant="outline">
          <Link to="/customer">{t('common.backToCustomer')}</Link>
        </Button>
      </div>
    </div>
  );
};

export default AppointmentsPage;
