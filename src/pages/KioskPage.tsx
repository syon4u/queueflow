
import React from 'react';
import { KioskWalkInFlow } from '@/components/kiosk/KioskWalkInFlow';

const KioskPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Kiosk Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            QueueFlow Kiosk
          </h1>
          <p className="text-xl text-gray-600">
            Walk-in Service - Get Your Ticket
          </p>
        </div>

        {/* Main Kiosk Interface */}
        <div className="max-w-2xl mx-auto">
          <KioskWalkInFlow />
        </div>

        {/* Footer Instructions */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-lg">
            Need help? Ask a staff member for assistance
          </p>
        </div>
      </div>
    </div>
  );
};

export default KioskPage;
