
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

export const replaceTemplateVariables = (
  text: string, 
  context: VariableContext
): string => {
  if (!text) return text;
  
  let result = text;
  
  // Replace customer variables
  if (context.customer_name) {
    result = result.replace(/\{\{customer_name\}\}/g, context.customer_name);
  }
  if (context.first_name) {
    result = result.replace(/\{\{first_name\}\}/g, context.first_name);
  }
  if (context.last_name) {
    result = result.replace(/\{\{last_name\}\}/g, context.last_name);
  }
  
  // Replace appointment variables
  if (context.appointment_time) {
    result = result.replace(/\{\{appointment_time\}\}/g, context.appointment_time);
  }
  if (context.service_name) {
    result = result.replace(/\{\{service_name\}\}/g, context.service_name);
  }
  if (context.location_name) {
    result = result.replace(/\{\{location_name\}\}/g, context.location_name);
  }
  
  // Replace queue variables
  if (context.queue_position) {
    result = result.replace(/\{\{queue_position\}\}/g, context.queue_position);
  }
  if (context.estimated_wait) {
    result = result.replace(/\{\{estimated_wait\}\}/g, context.estimated_wait);
  }
  
  return result;
};

export const getAvailableVariables = (): string[] => {
  return [
    'customer_name',
    'first_name', 
    'last_name',
    'appointment_time',
    'service_name',
    'location_name',
    'queue_position',
    'estimated_wait'
  ];
};

export const formatVariableForDisplay = (variable: string): string => {
  return `{{${variable}}}`;
};
