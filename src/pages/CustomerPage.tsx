
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import SimpleAppointmentForm from '@/components/customer/SimpleAppointmentForm';
import AppointmentConfirmationDialog from '@/components/customer/AppointmentConfirmationDialog';
import { useCustomerAppointmentFlow } from '@/hooks/customer/useCustomerAppointmentFlow';
import { CustomerAppointmentData } from '@/hooks/customer/useSimpleAppointmentForm';

const CustomerPage = () => {
  const navigate = useNavigate();
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const { createAppointment, isSubmitting } = useCustomerAppointmentFlow();

  /** Returns true only when the booking was actually created. */
  const handleAppointmentSubmit = async (customerData: CustomerAppointmentData): Promise<boolean> => {
    const result = await createAppointment(customerData);
    if (result) {
      setConfirmationCode(result);
      return true;
    }
    return false;
  };

  const handleConfirmationClose = (open: boolean) => {
    if (!open) {
      setConfirmationCode(null);
      navigate('/');
    }
  };

  return (
    <PageLayout 
      headerTitle="Book an Appointment"
      headerSubtitle="Choose a service, location and time that works for you"
    >
      <div className="min-h-screen bg-pattern-bubbles bg-gradient-overlay-blue">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <SimpleAppointmentForm onSubmit={handleAppointmentSubmit} />
          </div>
        </div>
      </div>

      {confirmationCode && (
        <AppointmentConfirmationDialog
          open={true}
          onOpenChange={handleConfirmationClose}
          confirmationCode={confirmationCode}
        />
      )}
    </PageLayout>
  );
};

export default CustomerPage;
