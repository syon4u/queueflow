
export interface NewCustomerFormValues {
  name: string;
  phone: string;
  email?: string;
  service_id: string;
  location_id: string;
  reason_for_visit?: string;
}

export interface ExistingCustomerFormValues {
  service_id: string;
  location_id: string;
  reason_for_visit?: string;
}

export type AppointmentStep = 'search' | 'new-customer' | 'existing-customer';

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
}
