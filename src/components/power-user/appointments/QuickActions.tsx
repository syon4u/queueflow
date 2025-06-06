
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
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Button 
            variant="outline" 
            className="h-10 text-sm"
            onClick={onViewFullQueue}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Check In Customer
          </Button>
          <Button 
            variant="outline" 
            className="h-10 text-sm"
            onClick={onViewFullQueue}
          >
            <Users className="h-4 w-4 mr-2" />
            View Full Queue
          </Button>
          <Button 
            variant="outline" 
            className="h-10 text-sm"
            onClick={onAddWalkIn}
          >
            <Clock className="h-4 w-4 mr-2" />
            Add Walk-in
          </Button>
          <Button 
            variant="outline" 
            className="h-10 text-sm"
            onClick={onScheduleFollowUp}
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Follow-up
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
