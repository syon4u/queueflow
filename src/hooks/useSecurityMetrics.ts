
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SecurityMetrics } from '@/types/security';

export const useSecurityMetrics = (timeRange: 'hour' | 'day' | 'week' = 'day') => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Calculate time window
        const now = new Date();
        let startTime: Date;
        
        switch (timeRange) {
          case 'hour':
            startTime = new Date(now.getTime() - 60 * 60 * 1000);
            break;
          case 'day':
            startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case 'week':
            startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        }

        // Fetch security audit logs
        const { data: auditLogs, error: auditError } = await supabase
          .from('security_audit_log')
          .select('*')
          .gte('created_at', startTime.toISOString())
          .order('created_at', { ascending: false });

        if (auditError) {
          console.error('Error fetching security metrics:', auditError);
          setError('Failed to fetch security metrics');
          return;
        }

        if (!auditLogs) {
          setMetrics({
            failedAttempts: 0,
            successfulAttempts: 0,
            blockedAttempts: 0,
            uniqueClients: 0,
            topFailureReasons: []
          });
          return;
        }

        // Process metrics
        const failedAttempts = auditLogs.filter(log => !log.success).length;
        const successfulAttempts = auditLogs.filter(log => log.success).length;
        const blockedAttempts = auditLogs.filter(log => 
          log.event_type === 'rate_limit_exceeded'
        ).length;
        
        const uniqueClients = new Set(auditLogs.map(log => log.client_identifier)).size;

        // Calculate top failure reasons
        const failureReasons = new Map<string, number>();
        auditLogs
          .filter(log => !log.success)
          .forEach(log => {
            try {
              const details = JSON.parse(log.details);
              const reason = details.error || log.event_type;
              failureReasons.set(reason, (failureReasons.get(reason) || 0) + 1);
            } catch {
              failureReasons.set('Unknown error', (failureReasons.get('Unknown error') || 0) + 1);
            }
          });

        const topFailureReasons = Array.from(failureReasons.entries())
          .map(([reason, count]) => ({ reason, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setMetrics({
          failedAttempts,
          successfulAttempts,
          blockedAttempts,
          uniqueClients,
          topFailureReasons
        });

      } catch (error) {
        console.error('Error processing security metrics:', error);
        setError('Failed to process security metrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [timeRange]);

  return { metrics, isLoading, error, refetch: () => setIsLoading(true) };
};
