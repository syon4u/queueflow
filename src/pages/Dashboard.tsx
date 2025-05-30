
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PortalGrid from '@/components/dashboard/PortalGrid';

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <DashboardHeader />
      
      {/* Main content */}
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to the Service Portal</h2>
            <p className="text-lg text-gray-600">
              Please select the section you'd like to access
            </p>
          </div>

          <PortalGrid />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-4 px-6 text-center text-sm text-gray-500">
        <p>&copy; 2025 Service Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
