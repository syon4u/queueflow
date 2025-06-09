
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface AuditLogEntry {
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
}

export const useAuditLog = () => {
  const { user } = useAuth();

  const logAction = useMutation({
    mutationFn: async (entry: AuditLogEntry) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('staff_audit_log')
        .insert({
          staff_id: user.id,
          action: entry.action,
          resource_type: entry.resource_type,
          resource_id: entry.resource_id || null,
          details: entry.details || {}
        });

      if (error) throw error;
    }
  });

  return {
    logAction: logAction.mutate,
    isLogging: logAction.isPending
  };
};
