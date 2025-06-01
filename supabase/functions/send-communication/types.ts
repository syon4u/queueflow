
export interface CommunicationRequest {
  customerId: string;
  type: 'email' | 'sms';
  subject?: string;
  message: string;
  templateId?: string;
}

export interface VariableContext {
  customer_name?: string;
  first_name?: string;
  last_name?: string;
  appointment_time?: string;
  service_name?: string;
  location_name?: string;
  queue_position?: string;
  estimated_wait?: string;
}

export interface CommunicationResult {
  success: boolean;
  method: 'email' | 'sms';
  id?: string;
  error?: string;
}
