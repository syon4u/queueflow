
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useAppointmentScheduling } from '@/hooks/useAppointmentScheduling';
import CustomerSearchStep from './appointment-scheduling/CustomerSearchStep';
import NewCustomerForm from './appointment-scheduling/NewCustomerForm';
import ExistingCustomerForm from './appointment-scheduling/ExistingCustomerForm';

interface ScheduleAppointmentCardProps {
  onAppointmentScheduled: (confirmationCode: string) => void;
}

const ScheduleAppointmentCard: React.FC<ScheduleAppointmentCardProps> = ({
  onAppointmentScheduled,
}) => {
  const { t } = useTranslation();

  const {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    step,
    selectedCustomer,
    isSubmitting,
    handleSelectCustomer,
    handleCreateNewCustomer,
    handleBackToSearch,
    submitNewCustomerAppointment,
    submitExistingCustomerAppointment,
  } = useAppointmentScheduling(onAppointmentScheduled);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('appointments.newAppointment')}</CardTitle>
            <CardDescription>
              {t('appointments.scheduleDescription')}
            </CardDescription>
          </div>
          <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            No Auth Required
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {step === 'search' && (
          <CustomerSearchStep
            onSelectCustomer={handleSelectCustomer}
            onCreateNew={handleCreateNewCustomer}
          />
        )}

        {step === 'new-customer' && (
          <NewCustomerForm
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            onSubmit={submitNewCustomerAppointment}
            onBack={handleBackToSearch}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 'existing-customer' && selectedCustomer && (
          <ExistingCustomerForm
            selectedCustomer={selectedCustomer}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            onSubmit={submitExistingCustomerAppointment}
            onBack={handleBackToSearch}
            isSubmitting={isSubmitting}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleAppointmentCard;
