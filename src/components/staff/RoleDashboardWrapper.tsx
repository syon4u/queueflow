
import React, { useState } from 'react';
import { RoleSelector, StaffRole } from './RoleSelector';
import { ClerkDashboard } from './clerk/ClerkDashboard';
import { SupervisorDashboard } from './supervisor/SupervisorDashboard';
import { AdminDashboard } from './admin/AdminDashboard';

export const RoleDashboardWrapper: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<StaffRole>('clerk');

  const renderDashboard = () => {
    switch (currentRole) {
      case 'clerk':
        return <ClerkDashboard />;
      case 'supervisor':
        return <SupervisorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <ClerkDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Staff Portal - Role-Based Interface
          </h1>
          <p className="text-gray-600">
            Demonstrating different access levels and functionality based on staff roles
          </p>
        </div>

        <RoleSelector 
          currentRole={currentRole} 
          onRoleChange={setCurrentRole} 
        />

        {renderDashboard()}
      </div>
    </div>
  );
};
