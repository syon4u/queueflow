
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSMSStats = () => {
  return useQuery({
    queryKey: ['sms-stats'],
    queryFn: async () => {
      // Get SMS communications from the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: communications, error } = await supabase
        .from('customer_communications')
        .select('*')
        .eq('type', 'sms')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (error) throw error;

      // Get communication templates
      const { data: templates, error: templatesError } = await supabase
        .from('communication_templates')
        .select('*')
        .eq('type', 'sms')
        .eq('is_active', true);

      if (templatesError) throw templatesError;

      // Calculate statistics
      const totalSent = communications?.length || 0;
      const successful = communications?.filter(c => c.status === 'sent').length || 0;
      const failed = communications?.filter(c => c.status === 'failed').length || 0;
      const pending = communications?.filter(c => c.status === 'pending').length || 0;

      // Template usage statistics
      const templateUsage = communications?.reduce((acc, comm) => {
        if (comm.template_used) {
          acc[comm.template_used] = (acc[comm.template_used] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>) || {};

      // Daily sending patterns
      const dailyStats = communications?.reduce((acc, comm) => {
        const date = new Date(comm.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { sent: 0, failed: 0, pending: 0 };
        }
        acc[date][comm.status as keyof typeof acc[typeof date]]++;
        return acc;
      }, {} as Record<string, Record<string, number>>) || {};

      return {
        totalSent,
        successful,
        failed,
        pending,
        successRate: totalSent > 0 ? Math.round((successful / totalSent) * 100) : 0,
        failureRate: totalSent > 0 ? Math.round((failed / totalSent) * 100) : 0,
        templates: templates || [],
        templateUsage,
        dailyStats,
        communications: communications || []
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};
