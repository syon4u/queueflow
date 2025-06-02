
export interface Location {
  id: string;
  name: string;
  address?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  description?: string;
}

export interface AppointmentFormData {
  location_id: string;
  service_id: string;
  scheduled_time: string;
  reason_for_visit: string;
  notes: string;
}
