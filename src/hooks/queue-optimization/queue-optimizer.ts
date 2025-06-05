
import { supabase } from '@/integrations/supabase/client';
import type { QueueOptimizationRule, OptimizationRecommendation, QueueMetrics } from './types';

export class QueueOptimizer {
  private rules: QueueOptimizationRule[] = [];

  constructor(rules: QueueOptimizationRule[] = []) {
    this.rules = rules;
  }

  async optimizeQueue(locationId: string): Promise<OptimizationRecommendation[]> {
    const queue = await this.getCurrentQueue(locationId);
    const metrics = await this.calculateQueueMetrics(locationId);
    const recommendations: OptimizationRecommendation[] = [];

    // Priority-based optimization
    const priorityOptimizations = this.optimizeByPriority(queue);
    recommendations.push(...priorityOptimizations);

    // Service time optimization
    const serviceOptimizations = this.optimizeByServiceTime(queue);
    recommendations.push(...serviceOptimizations);

    // Staff efficiency optimization
    const staffOptimizations = await this.optimizeByStaffEfficiency(queue, locationId);
    recommendations.push(...staffOptimizations);

    // Remove duplicates and sort by impact
    const uniqueRecommendations = this.deduplicateRecommendations(recommendations);
    return uniqueRecommendations.sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });
  }

  private async getCurrentQueue(locationId: string) {
    const { data: appointments, error } = await supabase
      .from('appointments' as any)
      .select(`
        *,
        customers(*),
        services(*),
        queue_positions(*)
      `)
      .eq('location_id', locationId)
      .in('status', ['checked_in', 'scheduled'])
      .order('check_in_time', { ascending: true });

    if (error) throw error;
    return appointments || [];
  }

  private async calculateQueueMetrics(locationId: string): Promise<QueueMetrics> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: todayAppointments, error } = await supabase
      .from('appointments' as any)
      .select('*')
      .eq('location_id', locationId)
      .gte('scheduled_time', today)
      .lt('scheduled_time', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    const appointments = todayAppointments || [];
    const completedCount = appointments.filter(a => a.status === 'completed').length;
    const totalCount = appointments.length;
    
    // Calculate average wait time for completed appointments
    const completedWithTimes = appointments.filter(a => 
      a.status === 'completed' && a.check_in_time && a.start_time
    );
    
    const totalWaitTime = completedWithTimes.reduce((sum, a) => {
      const waitTime = new Date(a.start_time).getTime() - new Date(a.check_in_time).getTime();
      return sum + (waitTime / (1000 * 60)); // Convert to minutes
    }, 0);

    return {
      averageWaitTime: completedWithTimes.length > 0 ? totalWaitTime / completedWithTimes.length : 0,
      totalCustomers: totalCount,
      staffUtilization: completedCount / Math.max(totalCount, 1) * 100,
      completionRate: completedCount / Math.max(totalCount, 1) * 100,
      customerSatisfaction: 85 // This would come from actual survey data
    };
  }

  private optimizeByPriority(queue: any[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    
    // Look for urgent appointments that should be moved up
    queue.forEach((appointment, index) => {
      if (appointment.priority_level > 0 && index > 2) {
        const newPosition = Math.max(0, index - appointment.priority_level);
        recommendations.push({
          appointmentId: appointment.id,
          currentPosition: index,
          recommendedPosition: newPosition,
          reason: `High priority customer (level ${appointment.priority_level}) should be expedited`,
          impact: 'high',
          estimatedSavings: {
            timeMinutes: (index - newPosition) * 15,
            customerCount: 1
          }
        });
      }
    });

    return recommendations;
  }

  private optimizeByServiceTime(queue: any[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    
    // Group by service duration and suggest reordering
    const shortServices = queue.filter(a => a.services?.duration <= 15);
    const longServices = queue.filter(a => a.services?.duration > 30);

    // If we have short services after long ones, suggest moving them up
    queue.forEach((appointment, index) => {
      if (appointment.services?.duration <= 15) {
        const longServicesAhead = queue.slice(0, index).filter(a => a.services?.duration > 30).length;
        
        if (longServicesAhead > 0) {
          recommendations.push({
            appointmentId: appointment.id,
            currentPosition: index,
            recommendedPosition: Math.max(0, index - longServicesAhead),
            reason: `Quick service (${appointment.services.duration}min) can be processed faster`,
            impact: 'medium',
            estimatedSavings: {
              timeMinutes: longServicesAhead * 10,
              customerCount: longServicesAhead
            }
          });
        }
      }
    });

    return recommendations;
  }

  private async optimizeByStaffEfficiency(queue: any[], locationId: string): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];
    
    // Get staff performance data
    const { data: staffMetrics } = await supabase
      .from('performance_metrics' as any)
      .select('*')
      .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    // This is a simplified version - in reality you'd have more complex logic
    // to match appointments with the most efficient staff for that service type
    queue.forEach((appointment, index) => {
      if (appointment.services?.name?.includes('Express') && index > 5) {
        recommendations.push({
          appointmentId: appointment.id,
          currentPosition: index,
          recommendedPosition: Math.max(0, index - 3),
          reason: 'Express service can be handled more efficiently by available staff',
          impact: 'medium',
          estimatedSavings: {
            timeMinutes: 20,
            customerCount: 3
          }
        });
      }
    });

    return recommendations;
  }

  private deduplicateRecommendations(recommendations: OptimizationRecommendation[]): OptimizationRecommendation[] {
    const seen = new Set();
    return recommendations.filter(rec => {
      if (seen.has(rec.appointmentId)) {
        return false;
      }
      seen.add(rec.appointmentId);
      return true;
    });
  }

  async applyOptimization(recommendation: OptimizationRecommendation): Promise<void> {
    // Update queue position
    const { error } = await supabase
      .from('queue_positions' as any)
      .update({
        position: recommendation.recommendedPosition,
        updated_at: new Date().toISOString()
      })
      .eq('appointment_id', recommendation.appointmentId);

    if (error) throw error;

    console.log(`Applied optimization: moved appointment ${recommendation.appointmentId} from position ${recommendation.currentPosition} to ${recommendation.recommendedPosition}`);
  }
}
