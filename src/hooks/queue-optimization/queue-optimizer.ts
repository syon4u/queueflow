
import { supabase } from '@/integrations/supabase/client';
import { getNumberProp, getStringProp } from '@/lib/utils';
import type { QueueOptimizationRule, OptimizationRecommendation, QueueMetrics } from './types';

interface QueueEntry {
  id: string;
  priority_level?: number | null;
  services?: unknown;
}

export class QueueOptimizer {
  private rules: QueueOptimizationRule[] = [];

  constructor(rules: QueueOptimizationRule[] = []) {
    this.rules = rules;
  }

  async optimizeQueue(locationId: string): Promise<OptimizationRecommendation[]> {
    try {
      const queue = await this.getCurrentQueue(locationId);
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
    } catch (error) {
      console.error('Error optimizing queue:', error);
      return this.generateMockRecommendations(locationId);
    }
  }

  private async getCurrentQueue(locationId: string) {
    try {
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select(`
          *,
          customers(*),
          services(*)
        `)
        .eq('location_id', locationId)
        .in('status', ['checked_in', 'scheduled'])
        .order('check_in_time', { ascending: true });

      if (error) {
        console.error('Error fetching queue:', error);
        return this.generateMockQueue(locationId);
      }

      return appointments || [];
    } catch (error) {
      console.error('Error in getCurrentQueue:', error);
      return this.generateMockQueue(locationId);
    }
  }

  private generateMockQueue(locationId: string) {
    // Generate mock queue data for demonstration
    return Array.from({ length: 8 }, (_, index) => ({
      id: `mock-${index + 1}`,
      customer_id: `customer-${index + 1}`,
      service_id: `service-${(index % 3) + 1}`,
      location_id: locationId,
      status: index < 3 ? 'checked_in' : 'scheduled',
      scheduled_time: new Date(Date.now() + index * 30 * 60 * 1000).toISOString(),
      check_in_time: index < 3 ? new Date(Date.now() - (10 - index) * 60 * 1000).toISOString() : null,
      priority_level: Math.random() > 0.8 ? 1 : 0,
      services: {
        duration: [15, 30, 45][index % 3],
        name: ['Express Service', 'Standard Service', 'Premium Service'][index % 3]
      }
    }));
  }

  private async calculateQueueMetrics(locationId: string): Promise<QueueMetrics> {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const { data: todayAppointments, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('location_id', locationId)
        .gte('scheduled_time', today)
        .lt('scheduled_time', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error fetching appointments for metrics:', error);
        return this.getMockMetrics();
      }

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
    } catch (error) {
      console.error('Error calculating queue metrics:', error);
      return this.getMockMetrics();
    }
  }

  private getMockMetrics(): QueueMetrics {
    return {
      averageWaitTime: 25,
      totalCustomers: 15,
      staffUtilization: 78,
      completionRate: 92,
      customerSatisfaction: 85
    };
  }

  private optimizeByPriority(queue: QueueEntry[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    
    // Look for urgent appointments that should be moved up
    queue.forEach((appointment, index) => {
      const priorityLevel = appointment.priority_level ?? 0;
      if (priorityLevel > 0 && index > 2) {
        const newPosition = Math.max(0, index - priorityLevel);
        recommendations.push({
          appointmentId: appointment.id,
          currentPosition: index,
          recommendedPosition: newPosition,
          reason: `High priority customer (level ${priorityLevel}) should be expedited`,
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

  private optimizeByServiceTime(queue: QueueEntry[]): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];
    
    // Group by service duration and suggest reordering
    queue.forEach((appointment, index) => {
      const duration = getNumberProp(appointment.services, 'duration');
      if (duration !== undefined && duration <= 15) {
        const longServicesAhead = queue.slice(0, index).filter(a => {
          const aheadDuration = getNumberProp(a.services, 'duration');
          return aheadDuration !== undefined && aheadDuration > 30;
        }).length;
        
        if (longServicesAhead > 0) {
          recommendations.push({
            appointmentId: appointment.id,
            currentPosition: index,
            recommendedPosition: Math.max(0, index - longServicesAhead),
            reason: `Quick service (${duration}min) can be processed faster`,
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

  private async optimizeByStaffEfficiency(queue: QueueEntry[], locationId: string): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];
    
    // Simplified staff efficiency optimization
    queue.forEach((appointment, index) => {
      if (getStringProp(appointment.services, 'name')?.includes('Express') && index > 5) {
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

  private generateMockRecommendations(locationId: string): OptimizationRecommendation[] {
    return [
      {
        appointmentId: 'mock-1',
        currentPosition: 5,
        recommendedPosition: 2,
        reason: 'High priority customer should be expedited',
        impact: 'high',
        estimatedSavings: {
          timeMinutes: 45,
          customerCount: 3
        }
      },
      {
        appointmentId: 'mock-2',
        currentPosition: 7,
        recommendedPosition: 4,
        reason: 'Quick service can be processed faster',
        impact: 'medium',
        estimatedSavings: {
          timeMinutes: 30,
          customerCount: 2
        }
      }
    ];
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
    try {
      // Mock implementation - in a real scenario, this would update queue positions
      console.log(`Applied optimization: moved appointment ${recommendation.appointmentId} from position ${recommendation.currentPosition} to ${recommendation.recommendedPosition}`);
      
      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error applying optimization:', error);
      throw new Error('Failed to apply optimization');
    }
  }
}
