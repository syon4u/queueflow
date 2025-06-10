
// Manual Supabase type definitions to resolve TS2589 errors
export interface LocationRow {
  id: string;
  name: string;
  address: string;
  is_active?: boolean;
  max_capacity?: number;
  current_capacity?: number;
  capacity_buffer?: number;
  queue_status?: string;
  phone?: string;
  email?: string;
  operating_hours?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceRow {
  id: string;
  name: string;
  description: string;
  duration: number;
  location_id?: string;
  is_active?: boolean;
  max_appointments_per_slot?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Database {
  public: {
    Tables: {
      locations: {
        Row: LocationRow;
      };
      services: {
        Row: ServiceRow;
      };
    };
  };
}
