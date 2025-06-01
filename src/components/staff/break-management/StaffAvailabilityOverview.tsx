
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck } from 'lucide-react';
import { StaffAvailability } from '@/types/break-management';

interface StaffAvailabilityOverviewProps {
  availableStaff: StaffAvailability[];
}

export const StaffAvailabilityOverview: React.FC<StaffAvailabilityOverviewProps> = ({
  availableStaff
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'break': return 'bg-orange-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Staff Availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableStaff.map((staff) => (
            <div key={staff.staffId} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${getStatusColor(staff.status)}`}></div>
                <span className="font-medium">{staff.name}</span>
              </div>
              <div className="text-right">
                <Badge variant={staff.canCover ? 'secondary' : 'outline'}>
                  {staff.canCover ? 'Available' : 'Busy'}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">
                  Workload: {staff.currentWorkload}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {availableStaff.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No other staff members found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
