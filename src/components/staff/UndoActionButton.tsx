
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Undo2 } from 'lucide-react';
import { useStaffActions } from '@/hooks/use-staff-actions';

export const UndoActionButton: React.FC = () => {
  const { getRecentActions, undoAction, isLoading } = useStaffActions();
  const [recentActions, setRecentActions] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecentActions = async () => {
      const actions = await getRecentActions(1);
      setRecentActions(actions);
    };

    fetchRecentActions();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchRecentActions, 10000);
    return () => clearInterval(interval);
  }, [getRecentActions]);

  const latestAction = recentActions[0];

  if (!latestAction) {
    return null;
  }

  const getActionDescription = (action: any) => {
    switch (action.action_type) {
      case 'call_customer':
        return 'Called customer';
      case 'mark_served':
        return 'Marked as served';
      case 'mark_no_show':
        return 'Marked as no-show';
      default:
        return 'Last action';
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => undoAction(latestAction.id)}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <Undo2 className="h-4 w-4" />
      Undo: {getActionDescription(latestAction)}
    </Button>
  );
};
