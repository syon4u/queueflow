
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const DashboardHeader = () => {
  const { user, role, signOut } = useAuth();

  // Get proper role display name
  const getRoleDisplayName = (role?: string | null): string => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'power_user': return 'Power User';
      case 'supervisor': return 'Supervisor';
      case 'staff': return 'Staff';
      case 'customer': return 'Customer';
      default: return 'Customer';
    }
  };

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Home className="h-5 w-5 text-blue-600" />
        <h1 className="text-xl font-semibold text-gray-800">Welcome Dashboard</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          {user?.email} ({getRoleDisplayName(role)})
        </span>
        <Button variant="outline" size="sm" onClick={signOut}>
          Sign Out
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
