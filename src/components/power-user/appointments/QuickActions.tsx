
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock, Plus } from 'lucide-react';

interface QuickActionsProps {
  onViewFullQueue: () => void;
  onAddWalkIn: () => void;
  onScheduleFollowUp: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onViewFullQueue,
  onAddWalkIn,
  onScheduleFollowUp
}) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start h-12"
          onClick={onViewFullQueue}
        >
          <Calendar className="h-4 w-4 mr-3" />
          Check In Customer
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start h-12"
          onClick={onViewFullQueue}
        >
          <Users className="h-4 w-4 mr-3" />
          View Full Queue
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start h-12"
          onClick={onAddWalkIn}
        >
          <Clock className="h-4 w-4 mr-3" />
          Add Walk-in
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start h-12"
          onClick={onScheduleFollowUp}
        >
          <Plus className="h-4 w-4 mr-3" />
          Schedule Follow-up
        </Button>
      </CardContent>
    </Card>
  );
};
