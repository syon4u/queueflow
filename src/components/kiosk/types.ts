
export const KIOSK_STEPS = {
  LOCATION: 'location',
  SERVICE: 'service',
  CUSTOMER_INFO: 'customer_info',
  CONFIRMATION: 'confirmation',
  TICKET: 'ticket'
} as const;

export type KioskStep = typeof KIOSK_STEPS[keyof typeof KIOSK_STEPS];
