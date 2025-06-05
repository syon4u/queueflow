
import React from 'react';
import { BaseSidebar } from './BaseSidebar';
import { 
  Users, 
  MapPin, 
  Wrench, 
  MessageSquare, 
  BarChart3, 
  Calendar,
  UserCog,
  ClipboardList,
  Settings,
  Home
} from 'lucide-react';

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    href: '/power-user'
  },
  {
    id: 'appointments',
    label: 'Appointments',
    icon: Calendar,
    href: '/power-user#appointments'
  },
  {
    id: 'users',
    label: 'User Administration',
    icon: Users,
    href: '/power-user#users'
  },
  {
    id: 'locations',
    label: 'Locations & Services',
    icon: MapPin,
    href: '/power-user#locations'
  },
  {
    id: 'communications',
    label: 'SMS & Notifications',
    icon: MessageSquare,
    href: '/power-user#communications'
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: BarChart3,
    href: '/power-user#reports'
  },
  {
    id: 'overrides',
    label: 'Appointment Overrides',
    icon: ClipboardList,
    href: '/power-user#overrides'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/power-user#settings'
  }
];

export const PowerUserSidebar: React.FC = () => {
  return (
    <BaseSidebar
      title="Power User Portal"
      navigationItems={navigationItems}
      userRole="power_user"
    />
  );
};
