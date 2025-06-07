
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCheck, UserX, Coffee, Users } from 'lucide-react';
import { useStaffAvailability, AvailabilityStatus } from '@/hooks/use-staff-availability';

export const StaffAvailabilityControl: React.FC = () => {
  const { currentStatus, unavailableReason, isUpdating, updateAvailability } = useStaffAvailability();
  const [reason, setReason] = useState('');

  const statusConfig = {
    available: { icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50', label: 'Available' },
    unavailable: { icon: UserX, color: 'text-red-600', bg: 'bg-red-50', label: 'Unavailable' },
    on_break: { icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-50', label: 'On Break' },
    in_meeting: { icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', label: 'In Meeting' }
  };

  const currentConfig = statusConfig[currentStatus as AvailabilityStatus] || statusConfig.available;
  const IconComponent = currentConfig.icon;

  const handleStatusChange = (newStatus: AvailabilityStatus) => {
    if (newStatus === 'available') {
      updateAvailability(newStatus);
    } else {
      updateAvailability(newStatus, reason || undefined);
    }
    setReason('');
  };

  return (
    <Card className={`border-2 ${currentConfig.bg}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <IconComponent className={`h-5 w-5 ${currentConfig.color}`} />
          Staff Status: {currentConfig.label}
        </CardTitle>
        {unavailableReason && (
          <p className="text-sm text-muted-foreground">Reason: {unavailableReason}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={currentStatus === 'available' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('available')}
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            <UserCheck className="h-4 w-4" />
            Available
          </Button>
          
          <Button
            variant={currentStatus === 'on_break' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('on_break')}
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            <Coffee className="h-4 w-4" />
            On Break
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status-reason">Reason (optional)</Label>
          <Input
            id="status-reason"
            placeholder="e.g., Lunch, Training, Personal"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={currentStatus === 'in_meeting' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('in_meeting')}
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            In Meeting
          </Button>
          
          <Button
            variant={currentStatus === 'unavailable' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusChange('unavailable')}
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            <UserX className="h-4 w-4" />
            Unavailable
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
