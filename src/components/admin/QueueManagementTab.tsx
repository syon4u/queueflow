
import React from 'react';
import { UnifiedQueueManagement } from '@/components/shared/queue/UnifiedQueueManagement';
import Breadcrumb from '@/components/navigation/Breadcrumb';

export const QueueManagementTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: 'Admin Dashboard', href: '/admin' },
          { label: 'Queue Management', isActive: true }
        ]}
        className="mb-6"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Queue Management</h1>
          <p className="text-gray-600 mt-1">Monitor and control active queues across all locations</p>
        </div>
      </div>
      
      {/* Unified Queue Management with Admin Controls */}
      <UnifiedQueueManagement 
        variant="admin"
        showAdvancedControls={true}
        showAllStatuses={true}
      />
    </div>
  );
};
