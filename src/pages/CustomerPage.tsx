
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

  console.log('CustomerPage - Component rendering');

  const handleAppointmentSubmit = async (customerData: CustomerAppointmentData) => {
    console.log('CustomerPage - Handling appointment submission:', customerData);
    
    try {
      const result = await createAppointment(customerData);
      console.log('CustomerPage - Appointment creation result:', result);
      
      if (result) {
        setConfirmationCode(result);
      }
    } catch (error) {
      console.error('CustomerPage - Error creating appointment:', error);
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationCode(null);
    navigate('/');
  };

  return (
    <PageLayout 
      headerTitle="Consumer Protection Division"
      headerSubtitle="Schedule your appointment with Broward County services"
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
          isOpen={true}
          onClose={handleConfirmationClose}
          confirmationCode={confirmationCode}
        />
      )}
    </PageLayout>
  );
};

export default CustomerPage;
