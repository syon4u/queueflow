
import React from 'react';
import { DigitalSignageDisplay } from '@/components/signage/DigitalSignageDisplay';
import { useAppData } from '@/hooks/useAppData';

const DigitalSignagePage = () => {
  const { isLoading } = useAppData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <DigitalSignageDisplay />;
};

export default DigitalSignagePage;
