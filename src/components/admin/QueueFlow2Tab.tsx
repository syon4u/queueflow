
import React from 'react';
import QueueFlow2TaskTracker from './QueueFlow2TaskTracker';

export const QueueFlow2Tab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">QueueFlow 2.0 Implementation</h2>
        <p className="text-gray-600">
          Track progress towards implementing all QueueFlow 2.0 features as outlined in the PRD.
          Complete tasks in order of priority to ensure systematic implementation.
        </p>
      </div>
      
      <QueueFlow2TaskTracker />
    </div>
  );
};
