
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Settings } from 'lucide-react';

export type StaffRole = 'clerk' | 'supervisor' | 'admin';

interface RoleSelectorProps {
  currentRole: StaffRole;
  onRoleChange: (role: StaffRole) => void;
}

const roleConfig = {
  clerk: {
    label: 'Customer Representative',
    description: 'Front-line staff handling daily customer interactions',
    icon: User,
    color: 'bg-green-100 text-green-800 border-green-200'
  },
  supervisor: {
    label: 'Supervisor',
    description: 'Power user with reporting and operational oversight',
    icon: Shield,
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  admin: {
    label: 'System Administrator',
    description: 'Full system management and configuration access',
    icon: Settings,
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  }
};

export const RoleSelector: React.FC<RoleSelectorProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="bg-white border rounded-lg p-4 mb-6">
      <h3 className="font-semibold text-gray-900 mb-3">Staff Role Simulation</h3>
      <p className="text-sm text-gray-600 mb-4">
        Select a role to see the corresponding dashboard and functionality
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(roleConfig).map(([role, config]) => {
          const IconComponent = config.icon;
          const isActive = currentRole === role;
          
          return (
            <Button
              key={role}
              variant={isActive ? "default" : "outline"}
              onClick={() => onRoleChange(role as StaffRole)}
              className="h-auto p-4 justify-start text-left"
            >
              <div className="flex items-start gap-3 w-full">
                <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{config.label}</div>
                  <div className="text-xs opacity-75 mt-1">{config.description}</div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t">
        <Badge className={roleConfig[currentRole].color}>
          Current Role: {roleConfig[currentRole].label}
        </Badge>
      </div>
    </div>
  );
};
