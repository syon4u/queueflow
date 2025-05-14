
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Circle, Square, Triangle, Star, Hexagon, User, Users, UserCog, FileText, Shield } from 'lucide-react';
import { UserRole } from '@/hooks/useUserRole';
import PortalCard from './PortalCard';

const PortalGrid = () => {
  const { role } = useAuth();
  
  // Determine which cards to show based on role
  const showCustomerCard = true; // Everyone can access customer pages
  const showStaffCard = ['staff', 'supervisor', 'power_user', 'admin'].includes(role as UserRole);
  const showSupervisorCard = ['supervisor', 'admin'].includes(role as UserRole);
  const showPowerUserCard = ['power_user', 'admin'].includes(role as UserRole);
  const showAdminCard = role === 'admin';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Customer Card - Always shown */}
      {showCustomerCard && (
        <PortalCard
          title="Customer Portal"
          description="Book appointments and manage your profile"
          content="Access your appointments, book new services, and update your personal information."
          icon={User}
          linkText="Enter Customer Portal"
          linkUrl="/customer"
          accentColor="border-blue-500"
          gradientFrom="from-blue-600"
          gradientTo="to-indigo-600"
        />
      )}

      {/* Staff Card */}
      {showStaffCard && (
        <PortalCard
          title="Staff Portal"
          description="Manage appointments and customer service"
          content="View your schedule, manage appointments, and track your performance."
          icon={Users}
          linkText="Enter Staff Portal"
          linkUrl="/staff"
          accentColor="border-green-500"
          gradientFrom="from-green-600"
          gradientTo="to-teal-600"
        />
      )}

      {/* Supervisor Card */}
      {showSupervisorCard && (
        <PortalCard
          title="Supervisor Portal"
          description="Staff management and team metrics"
          content="Manage staff schedules, review performance metrics, and handle escalations."
          icon={UserCog}
          linkText="Enter Supervisor Portal"
          linkUrl="/supervisor"
          accentColor="border-amber-500"
          gradientFrom="from-amber-600"
          gradientTo="to-orange-500"
        />
      )}

      {/* Power User Card */}
      {showPowerUserCard && (
        <PortalCard
          title="Power User Portal"
          description="Advanced features and reporting"
          content="Access advanced system features, generate reports, and customize workflows."
          icon={FileText}
          linkText="Enter Power User Portal"
          linkUrl="/power-user"
          accentColor="border-indigo-500"
          gradientFrom="from-indigo-600"
          gradientTo="to-violet-600"
        />
      )}

      {/* Admin Card */}
      {showAdminCard && (
        <PortalCard
          title="Admin Portal"
          description="System configuration and management"
          content="Manage users, configure services, and view system-wide reports and analytics."
          icon={Shield}
          linkText="Enter Admin Portal"
          linkUrl="/admin"
          accentColor="border-purple-500"
          gradientFrom="from-purple-600"
          gradientTo="to-pink-600"
        />
      )}
    </div>
  );
};

export default PortalGrid;
