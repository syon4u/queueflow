
export interface BusinessHours {
  start: number; // 9 for 9 AM
  end: number;   // 17 for 5 PM
  weekdays: number[]; // [1,2,3,4,5] for Monday-Friday
}

export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  start: 9,  // 9 AM
  end: 17,   // 5 PM
  weekdays: [1, 2, 3, 4, 5] // Monday-Friday
};

export const isWithinBusinessHours = (
  date: Date, 
  businessHours: BusinessHours = DEFAULT_BUSINESS_HOURS
): boolean => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const hour = date.getHours();

  // Check if it's a weekday
  if (!businessHours.weekdays.includes(dayOfWeek)) {
    return false;
  }

  // Check if it's within business hours
  return hour >= businessHours.start && hour < businessHours.end;
};

export const getNextBusinessDay = (
  date: Date,
  businessHours: BusinessHours = DEFAULT_BUSINESS_HOURS
): Date => {
  const nextDay = new Date(date);
  
  do {
    nextDay.setDate(nextDay.getDate() + 1);
  } while (!businessHours.weekdays.includes(nextDay.getDay()));
  
  // Set to start of business hours
  nextDay.setHours(businessHours.start, 0, 0, 0);
  
  return nextDay;
};

export const formatBusinessHoursMessage = (
  businessHours: BusinessHours = DEFAULT_BUSINESS_HOURS
): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdayNames = businessHours.weekdays.map(day => days[day]);
  
  const startTime = formatHour(businessHours.start);
  const endTime = formatHour(businessHours.end);
  
  return `Business hours: ${weekdayNames.join(', ')} ${startTime} - ${endTime}`;
};

const formatHour = (hour: number): string => {
  if (hour === 0) return '12:00 AM';
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return '12:00 PM';
  return `${hour - 12}:00 PM`;
};

export const validateAppointmentTime = (
  scheduledTime: Date,
  businessHours: BusinessHours = DEFAULT_BUSINESS_HOURS
): { isValid: boolean; message?: string } => {
  const now = new Date();
  
  // Check if appointment is in the past
  if (scheduledTime < now) {
    return {
      isValid: false,
      message: 'Appointment time cannot be in the past'
    };
  }
  
  // Check if within business hours
  if (!isWithinBusinessHours(scheduledTime, businessHours)) {
    const nextBusinessDay = getNextBusinessDay(scheduledTime, businessHours);
    return {
      isValid: false,
      message: `Appointments are only available during business hours. ${formatBusinessHoursMessage(businessHours)}. Next available: ${nextBusinessDay.toLocaleDateString()}`
    };
  }
  
  return { isValid: true };
};
