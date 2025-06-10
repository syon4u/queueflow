
import React from 'react';

export const AuthHeader: React.FC = () => {
  return (
    <div className="text-center">
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
        QueueFlow Staff Portal
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Sign in to manage appointments and queues
      </p>
    </div>
  );
};
