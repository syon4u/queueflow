
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Coffee, 
  Clock, 
  Users, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { StaffAvailability } from '@/types/break-management';

interface BreakRequestFormProps {
  availableStaff: StaffAvailability[];
  isLoading: boolean;
  onRequestBreak: (
    breakType: 'short' | 'lunch' | 'meeting' | 'training' | 'emergency',
    duration: number,
    handoverStaffId?: string,
    reason?: string
  ) => Promise<boolean>;
}

export const BreakRequestForm: React.FC<BreakRequestFormProps> = ({
  availableStaff,
  isLoading,
  onRequestBreak
}) => {
  const [breakType, setBreakType] = useState<'short' | 'lunch' | 'meeting' | 'training' | 'emergency'>('short');
  const [duration, setDuration] = useState(15);
  const [handoverStaffId, setHandoverStaffId] = useState<string>('');
  const [reason, setReason] = useState('');

  const breakTypeOptions = [
    { value: 'short', label: 'Short Break', duration: 15, icon: Coffee },
    { value: 'lunch', label: 'Lunch Break', duration: 60, icon: Clock },
    { value: 'meeting', label: 'Meeting', duration: 30, icon: Users },
    { value: 'training', label: 'Training', duration: 120, icon: CheckCircle },
    { value: 'emergency', label: 'Emergency', duration: 30, icon: AlertCircle }
  ];

  const handleBreakTypeChange = (value: string) => {
    const type = value as typeof breakType;
    setBreakType(type);
    const option = breakTypeOptions.find(opt => opt.value === type);
    if (option) {
      setDuration(option.duration);
    }
  };

  const handleRequestBreak = async () => {
    const success = await onRequestBreak(breakType, duration, handoverStaffId || undefined, reason || undefined);
    if (success) {
      setReason('');
      setHandoverStaffId('');
    }
  };

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
          <Coffee className="h-5 w-5" />
          Smart Break Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Break Type</Label>
            <Select value={breakType} onValueChange={handleBreakTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {breakTypeOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="5"
              max="240"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Handover to (optional)</Label>
          <Select value={handoverStaffId} onValueChange={setHandoverStaffId}>
            <SelectTrigger>
              <SelectValue placeholder="Select staff member for coverage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No handover needed</SelectItem>
              {availableStaff
                .filter(staff => staff.canCover)
                .map((staff) => (
                  <SelectItem key={staff.staffId} value={staff.staffId}>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(staff.status)}`}></div>
                      {staff.name} (Workload: {staff.currentWorkload})
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Reason (optional)</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Brief description of the break purpose..."
            rows={2}
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            {duration <= 15 && availableStaff.some(s => s.canCover) ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                Auto-approval eligible
              </div>
            ) : (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="h-4 w-4" />
                Requires supervisor approval
              </div>
            )}
          </div>
          <Button 
            onClick={handleRequestBreak}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? 'Requesting...' : 'Request Break'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
