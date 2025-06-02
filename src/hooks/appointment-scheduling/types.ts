
import { Customer } from '@/components/customer/CustomerSearchBox';
import { NewCustomerFormValues } from '@/components/customer/appointment-scheduling/NewCustomerForm';
import { ExistingCustomerFormValues } from '@/components/customer/appointment-scheduling/ExistingCustomerForm';

export type AppointmentStep = 'search' | 'new-customer' | 'existing-customer';

export interface AppointmentSchedulingState {
  selectedDate: Date | undefined;
  selectedTime: string;
  step: AppointmentStep;
  selectedCustomer: Customer | null;
  isSubmitting: boolean;
}

export interface AppointmentSchedulingActions {
  setSelectedDate: (date: Date | undefined) => void;
  setSelectedTime: (time: string) => void;
  handleSelectCustomer: (customer: Customer) => void;
  handleCreateNewCustomer: () => void;
  handleBackToSearch: () => void;
  submitNewCustomerAppointment: (data: NewCustomerFormValues) => Promise<void>;
  submitExistingCustomerAppointment: (data: ExistingCustomerFormValues) => Promise<void>;
}

export type { NewCustomerFormValues, ExistingCustomerFormValues, Customer };
