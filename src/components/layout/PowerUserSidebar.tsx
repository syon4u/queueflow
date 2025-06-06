
import React, { useState } from 'react';
import { BaseSidebar } from './BaseSidebar';
import { 
  Users, 
  MapPin, 
  MessageSquare, 
  BarChart3, 
  Calendar,
  ClipboardList,
  Settings,
  Home,
  Plus,
  Bell
} from 'lucide-react';

const navigationGroups = [
  {
    label: 'Operations',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: Home,
        description: 'Overview and today\'s activities'
      },
      {
        id: 'appointments',
        label: 'Appointments',
        icon: Calendar,
        description: 'Manage today\'s schedule'
      }
    ]
  },
  {
    label: 'Administration',
    items: [
      {
        id: 'users',
        label: 'User Administration',
        icon: Users,
        description: 'Manage user accounts and roles'
      },
      {
        id: 'locations',
        label: 'Locations & Services',
        icon: MapPin,
        description: 'Configure locations and services'
      },
      {
        id: 'communications',
        label: 'SMS & Notifications',
        icon: MessageSquare,
        description: 'Manage communication templates'
      }
    ]
  },
  {
    label: 'Analytics & Management',
    items: [
      {
        id: 'reports',
        label: 'Reports & Analytics',
        icon: BarChart3,
        description: 'View performance metrics'
      },
      {
        id: 'overrides',
        label: 'Appointment Overrides',
        icon: ClipboardList,
        description: 'Special appointment management'
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        description: 'Power user preferences'
      }
    ]
  }
];

const quickActions = [
  {
    label: 'New Appointment',
    icon: Plus,
    onClick: () => {
      console.log('Create new appointment');
      // TODO: Implement new appointment creation
    },
    iconColor: 'text-blue-600'
  },
  {
    label: 'Send Notification',
    icon: Bell,
    onClick: () => {
      console.log('Send bulk notification');
      // TODO: Implement bulk notification
    },
    iconColor: 'text-green-600'
  }
];

interface PowerUserSidebarProps {
  activeItem: string;
  onItemChange: (item: string) => void;
}

export const PowerUserSidebar: React.FC<PowerUserSidebarProps> = ({
  activeItem,
  onItemChange
}) => {
  return (
    <BaseSidebar
      title="Power User Portal"
      subtitle="Comprehensive Management Tools"
      userRole="Power User"
      navigationGroups={navigationGroups}
      quickActions={quickActions}
      activeItem={activeItem}
      onItemChange={onItemChange}
    />
  );
};
