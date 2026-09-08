
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Activity, Clock, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import StaffBreakDialog from './StaffBreakDialog';

interface StaffStatusSectionProps {
  onStatusChange: () => void;
}

const StaffStatusSection: React.FC<StaffStatusSectionProps> = ({ onStatusChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [currentStatus, setCurrentStatus] = useState<string>('inactive');
  const [returnTime, setReturnTime] = useState<string | null>(null);
  const [showBreakDialog, setShowBreakDialog] = useState(false);
  
  const userId = user?.id;

  const fetchStatus = useCallback(async () => {
    if (!userId) return;
    
    try {
      // Use profiles table instead of staff table
      const { data, error } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      setCurrentStatus(data?.status || 'inactive');
      // Note: return_time is no longer stored in profiles, would need separate table for breaks
      setReturnTime(null);
    } catch (error) {
      console.error('Error fetching staff status:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('staff.statusFetchError')
      });
    }
  }, [userId, toast, t]);
  
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);
  
  const handleStatusChange = async (newStatus: string) => {
    if (!user) return;
    
    try {
      // Update profiles table instead of staff table
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setCurrentStatus(newStatus);
      setReturnTime(null);
      onStatusChange();
      
      toast({
        title: t('staff.statusUpdated'),
        description: t('staff.statusUpdatedDescription', { status: newStatus })
      });
    } catch (error) {
      console.error('Error updating staff status:', error);
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: t('staff.statusUpdateError')
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg border p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-medium mb-1">{t('staff.yourStatus')}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`h-2 w-2 rounded-full ${
              currentStatus === 'active' ? 'bg-green-500' : 
              currentStatus === 'break' ? 'bg-amber-500' : 'bg-gray-400'
            }`}></div>
            {currentStatus === 'active' ? t('staff.statusActive') : 
             currentStatus === 'break' ? t('staff.statusOnBreak') : t('staff.statusInactive')}
            
            {/* Show return time if on break */}
            {currentStatus === 'break' && returnTime && (
              <span className="ml-2">
                {t('staff.returningAt')} {format(new Date(returnTime), 'p')}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {currentStatus !== 'active' && (
            <Button 
              variant="default" 
              size="sm"
              onClick={() => handleStatusChange('active')}
            >
              <Activity className="mr-2 h-4 w-4" />
              {t('staff.setActive')}
            </Button>
          )}
          
          {currentStatus !== 'break' && currentStatus !== 'inactive' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowBreakDialog(true)}
            >
              <Clock className="mr-2 h-4 w-4" />
              {t('staff.takeBreak')}
            </Button>
          )}
          
          {currentStatus !== 'inactive' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleStatusChange('inactive')}
            >
              <XCircle className="mr-2 h-4 w-4" />
              {t('staff.setInactive')}
            </Button>
          )}
        </div>
      </div>
      
      {/* Staff Break Dialog */}
      <StaffBreakDialog
        open={showBreakDialog}
        onOpenChange={setShowBreakDialog}
        onBreakStatusChange={() => {
          onStatusChange();
          // Force a refresh of the status
          fetchStatus();
        }}
      />
    </div>
  );
};

export default StaffStatusSection;
