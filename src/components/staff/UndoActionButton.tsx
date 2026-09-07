
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Undo2 } from 'lucide-react';
import { useStaffActions } from '@/hooks/use-staff-actions';

export const UndoActionButton: React.FC = () => {
  const { getRecentActions, undoAction, isLoading } = useStaffActions();
  const [recentActions, setRecentActions] = useState<any[]>([]);

  const fetchRecentActions = useCallback(async () => {
    // getRecentActions already filters to can_undo = true and undone_at is null.
    const actions = await getRecentActions(1);
    setRecentActions(actions);
  }, [getRecentActions]);

  useEffect(() => {
    fetchRecentActions();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchRecentActions, 10000);
    return () => clearInterval(interval);
  }, [fetchRecentActions]);

  const handleUndo = async (actionId: string) => {
    await undoAction(actionId);
    // Drop the button immediately rather than on the next 10 s refresh.
    await fetchRecentActions();
  };

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
      onClick={() => handleUndo(latestAction.id)}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <Undo2 className="h-4 w-4" />
      Undo: {getActionDescription(latestAction)}
    </Button>
  );
};
