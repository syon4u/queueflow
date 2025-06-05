
import React from 'react';
import { QueueOperationsPanel } from './QueueOperationsPanel';
import { QueueStatsCards } from './QueueStatsCards';
import { SharedQueueTable } from './SharedQueueTable';
import { useAuth } from '@/context/AuthContext';

interface UnifiedQueueManagementProps {
  variant?: 'staff' | 'admin';
  showAdvancedControls?: boolean;
  showAllStatuses?: boolean;
}

export const UnifiedQueueManagement: React.FC<UnifiedQueueManagementProps> = ({
  variant = 'staff',
  showAdvancedControls = false,
  showAllStatuses = false
}) => {
  const { role } = useAuth();

  // Determine actual variant based on user role if not explicitly set
  const effectiveVariant = variant === 'admin' || role === 'admin' ? 'admin' : 'staff';
  const effectiveAdvancedControls = showAdvancedControls || role === 'admin';
  const effectiveShowAllStatuses = showAllStatuses || role === 'admin';

  return (
    <div className="space-y-6">
      {/* Queue Statistics */}
      <QueueStatsCards variant={effectiveVariant} />
      
      {/* Queue Operations */}
      <QueueOperationsPanel 
        variant={effectiveVariant} 
        showAdvancedControls={effectiveAdvancedControls}
      />
      
      {/* Queue Table */}
      <SharedQueueTable 
        variant={effectiveVariant}
        showAllStatuses={effectiveShowAllStatuses}
      />
    </div>
  );
};
