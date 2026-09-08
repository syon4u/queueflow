
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import type { Json } from '@/integrations/supabase/types';

interface AuditLogEntry {
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: { [key: string]: Json | undefined; old_values?: Json; new_values?: Json };
}

export const useAuditLog = () => {
  const { user } = useAuth();

  const logAction = useMutation({
    mutationFn: async (entry: AuditLogEntry) => {
      console.log('Logging audit action:', entry);
      
      if (!user) {
        console.warn('User not authenticated, skipping audit log');
        return;
      }

      // Use the new audit_log table created by the migration
      const { error } = await supabase
        .from('audit_log')
        .insert({
          user_id: user.id,
          action: entry.action,
          resource_type: entry.resource_type,
          resource_id: entry.resource_id || null,
          old_values: entry.details?.old_values || null,
          new_values: entry.details?.new_values || entry.details || {},
          ip_address: null, // Will be populated by the database function
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error logging audit action:', error);
        throw error;
      }

      console.log('Audit action logged successfully');
    }
  });

  return {
    logAction: logAction.mutate,
    isLogging: logAction.isPending
  };
};
