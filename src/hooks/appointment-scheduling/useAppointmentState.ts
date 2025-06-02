
import { useState } from 'react';
import { Customer } from '@/components/customer/CustomerSearchBox';
import { AppointmentStep } from './types';

export const useAppointmentState = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('9:00 AM');
  const [step, setStep] = useState<AppointmentStep>('search');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setStep('existing-customer');
  };

  const handleCreateNewCustomer = () => {
    setStep('new-customer');
  };

  const handleBackToSearch = () => {
    setStep('search');
    setSelectedCustomer(null);
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    step,
    selectedCustomer,
    isSubmitting,
    setIsSubmitting,
    handleSelectCustomer,
    handleCreateNewCustomer,
    handleBackToSearch,
  };
};
