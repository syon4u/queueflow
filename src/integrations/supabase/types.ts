export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointment_history: {
        Row: {
          appointment_id: string | null
          change_type: string
          changed_by: string | null
          created_at: string | null
          id: string
          new_value: Json | null
          old_value: Json | null
          reason: string | null
        }
        Insert: {
          appointment_id?: string | null
          change_type: string
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          reason?: string | null
        }
        Update: {
          appointment_id?: string | null
          change_type?: string
          changed_by?: string | null
          created_at?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_history_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      appointment_reminders: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          reminder_type: string
          scheduled_for: string
          sent_at: string | null
          status: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          reminder_type: string
          scheduled_for: string
          sent_at?: string | null
          status?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          reminder_type?: string
          scheduled_for?: string
          sent_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_reminders_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          check_in_time: string | null
          created_at: string
          customer_id: string
          end_time: string | null
          id: string
          location_id: string
          notes: string | null
          reason_for_visit: string | null
          scheduled_time: string
          service_id: string
          staff_id: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
        }
        Insert: {
          check_in_time?: string | null
          created_at?: string
          customer_id: string
          end_time?: string | null
          id?: string
          location_id: string
          notes?: string | null
          reason_for_visit?: string | null
          scheduled_time: string
          service_id: string
          staff_id?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Update: {
          check_in_time?: string | null
          created_at?: string
          customer_id?: string
          end_time?: string | null
          id?: string
          location_id?: string
          notes?: string | null
          reason_for_visit?: string | null
          scheduled_time?: string
          service_id?: string
          staff_id?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_location"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_service"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_appointments_staff"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      break_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          break_type: string
          created_at: string | null
          handover_staff_id: string | null
          id: string
          notes: string | null
          requested_end: string
          requested_start: string
          staff_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          break_type: string
          created_at?: string | null
          handover_staff_id?: string | null
          id?: string
          notes?: string | null
          requested_end: string
          requested_start: string
          staff_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          break_type?: string
          created_at?: string | null
          handover_staff_id?: string | null
          id?: string
          notes?: string | null
          requested_end?: string
          requested_start?: string
          staff_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "break_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "break_requests_handover_staff_id_fkey"
            columns: ["handover_staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "break_requests_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_break_requests_handover_staff"
            columns: ["handover_staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_break_requests_staff"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          subject: string | null
          type: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          subject?: string | null
          type: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string | null
          type?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      customer_communications: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          message: string
          staff_id: string | null
          status: string
          subject: string | null
          template_used: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          message: string
          staff_id?: string | null
          status?: string
          subject?: string | null
          template_used?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          message?: string
          staff_id?: string | null
          status?: string
          subject?: string | null
          template_used?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_communications_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_customer_communications_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_customer_communications_staff"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_notes: {
        Row: {
          category: string | null
          created_at: string
          customer_id: string
          id: string
          is_important: boolean | null
          note: string
          staff_id: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_important?: boolean | null
          note: string
          staff_id?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_important?: boolean | null
          note?: string
          staff_id?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_customer_notes_customer"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_customer_notes_staff"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_surveys: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          customer_id: string | null
          feedback: string | null
          id: string
          rating: number | null
          submitted_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          feedback?: string | null
          id?: string
          rating?: number | null
          submitted_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          feedback?: string | null
          id?: string
          rating?: number | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_surveys_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_surveys_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          operating_hours: Json | null
          phone: string | null
          queue_status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          operating_hours?: Json | null
          phone?: string | null
          queue_status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          operating_hours?: Json | null
          phone?: string | null
          queue_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          appointments_completed: number | null
          avg_service_time: number | null
          created_at: string | null
          customer_satisfaction_score: number | null
          date: string
          id: string
          staff_id: string | null
          total_break_time: number | null
          updated_at: string | null
        }
        Insert: {
          appointments_completed?: number | null
          avg_service_time?: number | null
          created_at?: string | null
          customer_satisfaction_score?: number | null
          date: string
          id?: string
          staff_id?: string | null
          total_break_time?: number | null
          updated_at?: string | null
        }
        Update: {
          appointments_completed?: number | null
          avg_service_time?: number | null
          created_at?: string | null
          customer_satisfaction_score?: number | null
          date?: string
          id?: string
          staff_id?: string | null
          total_break_time?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_performance_metrics_staff"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_metrics_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          break_end_time: string | null
          break_start_time: string | null
          break_type: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          handover_staff_id: string | null
          id: string
          last_name: string | null
          location_id: string | null
          phone: string | null
          return_time: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          break_end_time?: string | null
          break_start_time?: string | null
          break_type?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          handover_staff_id?: string | null
          id: string
          last_name?: string | null
          location_id?: string | null
          phone?: string | null
          return_time?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          break_end_time?: string | null
          break_start_time?: string | null
          break_type?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          handover_staff_id?: string | null
          id?: string
          last_name?: string | null
          location_id?: string | null
          phone?: string | null
          return_time?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      queue_positions: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          estimated_call_time: string | null
          id: string
          location_id: string | null
          position: number
          priority_level: number | null
          updated_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          estimated_call_time?: string | null
          id?: string
          location_id?: string | null
          position: number
          priority_level?: number | null
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          estimated_call_time?: string | null
          id?: string
          location_id?: string | null
          position?: number
          priority_level?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_queue_positions_appointment"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_queue_positions_location"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_positions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "queue_positions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      queue_schedule: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_date: string
          event_type: string
          id: string
          location_id: string
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_date: string
          event_type: string
          id?: string
          location_id: string
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string
          event_type?: string
          id?: string
          location_id?: string
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "queue_schedule_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      queue_schedules: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_datetime: string
          id: string
          is_active: boolean | null
          location_id: string
          recurring_pattern: Json | null
          schedule_type: string
          start_datetime: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_datetime: string
          id?: string
          is_active?: boolean | null
          location_id: string
          recurring_pattern?: Json | null
          schedule_type: string
          start_datetime: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_datetime?: string
          id?: string
          is_active?: boolean | null
          location_id?: string
          recurring_pattern?: Json | null
          schedule_type?: string
          start_datetime?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          admin_access: boolean
          created_at: string
          customer_access: boolean
          id: string
          power_user_access: boolean
          role: string
          staff_access: boolean
          supervisor_access: boolean
          updated_at: string
        }
        Insert: {
          admin_access?: boolean
          created_at?: string
          customer_access?: boolean
          id?: string
          power_user_access?: boolean
          role: string
          staff_access?: boolean
          supervisor_access?: boolean
          updated_at?: string
        }
        Update: {
          admin_access?: boolean
          created_at?: string
          customer_access?: boolean
          id?: string
          power_user_access?: boolean
          role?: string
          staff_access?: boolean
          supervisor_access?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          client_identifier: string
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          success: boolean
          user_agent: string | null
        }
        Insert: {
          client_identifier: string
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Update: {
          client_identifier?: string
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          success?: boolean
          user_agent?: string | null
        }
        Relationships: []
      }
      service_wait_times: {
        Row: {
          average_wait_time: number
          created_at: string
          day_of_week: number
          hour_of_day: number
          id: string
          service_id: string
          updated_at: string
        }
        Insert: {
          average_wait_time: number
          created_at?: string
          day_of_week: number
          hour_of_day: number
          id?: string
          service_id: string
          updated_at?: string
        }
        Update: {
          average_wait_time?: number
          created_at?: string
          day_of_week?: number
          hour_of_day?: number
          id?: string
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_wait_times_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          duration: number
          id: string
          is_active: boolean | null
          location_id: string
          max_appointments_per_slot: number | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration: number
          id?: string
          is_active?: boolean | null
          location_id: string
          max_appointments_per_slot?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          is_active?: boolean | null
          location_id?: string
          max_appointments_per_slot?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_services_location"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          break_end_time: string | null
          break_start_time: string | null
          break_type: string | null
          created_at: string
          email: string | null
          first_name: string
          handover_staff_id: string | null
          id: string
          last_name: string
          location_id: string | null
          phone: string | null
          return_time: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: string | null
          updated_at: string
        }
        Insert: {
          break_end_time?: string | null
          break_start_time?: string | null
          break_type?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          handover_staff_id?: string | null
          id: string
          last_name: string
          location_id?: string | null
          phone?: string | null
          return_time?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          updated_at?: string
        }
        Update: {
          break_end_time?: string | null
          break_start_time?: string | null
          break_type?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          handover_staff_id?: string | null
          id?: string
          last_name?: string
          location_id?: string | null
          phone?: string | null
          return_time?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_handover_staff_id_fkey"
            columns: ["handover_staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          staff_id: string
          user_agent: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          staff_id: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          staff_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_audit_log_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          staff_id: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          staff_id: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          staff_id?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_staff_notifications_staff"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_notifications_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          device_info: string
          expires_at: string
          id: string
          ip_address: string | null
          is_remembered: boolean
          last_active: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_info: string
          expires_at: string
          id?: string
          ip_address?: string | null
          is_remembered?: boolean
          last_active?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_info?: string
          expires_at?: string
          id?: string
          ip_address?: string | null
          is_remembered?: boolean
          last_active?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_customer: {
        Args: { customer_uuid: string }
        Returns: boolean
      }
      can_manage_appointments: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_admin_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_staff_location_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: string
      }
      get_users_with_roles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          role: string
          created_at: string
          last_sign_in_at: string
        }[]
      }
      update_user_role: {
        Args: { target_user_id: string; new_role: string }
        Returns: boolean
      }
    }
    Enums: {
      appointment_status:
        | "scheduled"
        | "checked_in"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "no_show"
      user_role: "customer" | "staff" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: [
        "scheduled",
        "checked_in",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ],
      user_role: ["customer", "staff", "admin"],
    },
  },
} as const
