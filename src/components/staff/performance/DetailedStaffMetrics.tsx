
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { StaffMetric } from './types';

interface DetailedStaffMetricsProps {
  staffMetrics: StaffMetric[] | undefined;
}

const DetailedStaffMetrics: React.FC<DetailedStaffMetricsProps> = ({ staffMetrics }) => {
  const [sortBy, setSortBy] = useState<'appointments' | 'service_time' | 'efficiency'>('appointments');

  const sortedStaffMetrics = React.useMemo(() => {
    if (!staffMetrics) return [];
    
    return [...staffMetrics].sort((a, b) => {
      switch (sortBy) {
        case 'appointments':
          return b.appointments_served - a.appointments_served;
        case 'service_time':
          return a.average_service_time - b.average_service_time;
        case 'efficiency':
          const efficiencyA = a.appointments_served / (a.average_service_time || 1);
          const efficiencyB = b.appointments_served / (b.average_service_time || 1);
          return efficiencyB - efficiencyA;
        default:
          return 0;
      }
    });
  }, [staffMetrics, sortBy]);

  const getPerformanceRating = (staff: StaffMetric) => {
    const efficiency = staff.appointments_served / (staff.average_service_time || 1);
    const noShowRate = staff.appointments_served > 0 ? staff.no_shows / staff.appointments_served : 0;
    
    if (efficiency > 2 && noShowRate < 0.1) return 'Excellent';
    if (efficiency > 1.5 && noShowRate < 0.15) return 'Good';
    if (efficiency > 1 && noShowRate < 0.2) return 'Average';
    return 'Needs Improvement';
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Excellent': return 'bg-green-100 text-green-800';
      case 'Good': return 'bg-blue-100 text-blue-800';
      case 'Average': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Detailed Staff Performance
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'appointments' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('appointments')}
            >
              Appointments
            </Button>
            <Button
              variant={sortBy === 'service_time' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('service_time')}
            >
              Speed
            </Button>
            <Button
              variant={sortBy === 'efficiency' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('efficiency')}
            >
              Efficiency
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedStaffMetrics.length > 0 ? (
            sortedStaffMetrics.map((staff, index) => {
              const rating = getPerformanceRating(staff);
              const efficiency = staff.appointments_served / (staff.average_service_time || 1);
              const noShowRate = staff.appointments_served > 0 ? 
                (staff.no_shows / staff.appointments_served * 100).toFixed(1) : '0';

              return (
                <div key={staff.staff_id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{staff.staff_name}</h3>
                        <Badge className={getRatingColor(rating)}>
                          {rating}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{staff.appointments_served}</div>
                      <div className="text-sm text-muted-foreground">appointments</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{staff.average_service_time.toFixed(1)} min</div>
                        <div className="text-muted-foreground">Avg. service time</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{efficiency.toFixed(2)}</div>
                        <div className="text-muted-foreground">Efficiency ratio</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{noShowRate}%</div>
                        <div className="text-muted-foreground">No-show rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No staff performance data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedStaffMetrics;
