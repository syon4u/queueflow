
import { useAppointmentState } from './appointment-scheduling/useAppointmentState';
import { useAppointmentSubmission } from './appointment-scheduling/useAppointmentSubmission';
import { NewCustomerFormValues, ExistingCustomerFormValues } from './appointment-scheduling/types';

export const useAppointmentScheduling = (onAppointmentScheduled: (code: string) => void) => {
  const {
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
  } = useAppointmentState();

  const {
    submitNewCustomerAppointment: baseSubmitNewCustomer,
    submitExistingCustomerAppointment: baseSubmitExistingCustomer,
  } = useAppointmentSubmission(onAppointmentScheduled);

  const submitNewCustomerAppointment = async (data: NewCustomerFormValues) => {
    await baseSubmitNewCustomer(
      data,
      selectedDate,
      selectedTime,
      setIsSubmitting,
      (step) => {} // setStep is handled internally in useAppointmentState
    );
  };

  const submitExistingCustomerAppointment = async (data: ExistingCustomerFormValues) => {
    await baseSubmitExistingCustomer(
      data,
      selectedDate,
      selectedTime,
      selectedCustomer,
      setIsSubmitting,
      (step) => {} // setStep is handled internally in useAppointmentState
    );
  };

  return {
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
  };
};
