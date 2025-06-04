import React, { useState } from 'react';
import { DashboardTab } from './DashboardTab';
import { QueueManagementTab } from './QueueManagementTab';
import { StaffTab } from './StaffTab';
import { CustomerManagementTab } from './CustomerManagementTab';
import { LocationsTab } from './LocationsTab';
import { ServicesTab } from './ServicesTab';
import { CommunicationTemplatesTab } from './CommunicationTemplatesTab';
import { UserManagementTab } from './UserManagementTab';
import { EmployeeTab } from './EmployeeTab';
import { MergedUsersTab } from './MergedUsersTab';
import { QueueFlow2Tab } from './QueueFlow2Tab';
import { StatsTab } from './StatsTab';
import { SecurityMetricsTab } from './SecurityMetricsTab';
import { SystemSettingsTab } from './SystemSettingsTab';
import { SMSCommandsTab } from './SMSCommandsTab';
import {
  BarChart3,
  Users,
  UserCheck,
  UserPlus,
  MapPin,
  Settings,
  MessageSquare,
  Shield,
  Briefcase,
  UserX,
  Zap,
  MessageCircle,
  TrendingUp
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'queue-management', label: 'Queue Management', icon: Users },
    { id: 'staff', label: 'Staff Management', icon: UserCheck },
    { id: 'customers', label: 'Customer Management', icon: UserPlus },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'templates', label: 'Communication Templates', icon: MessageSquare },
    { id: 'users', label: 'User Management', icon: Shield },
    { id: 'employees', label: 'Employee Management', icon: Briefcase },
    { id: 'merged-users', label: 'Merged Users', icon: UserX },
    { id: 'queueflow2', label: 'QueueFlow 2.0', icon: Zap },
    { id: 'sms-commands', label: 'SMS Commands', icon: MessageCircle },
    { id: 'stats', label: 'Statistics', icon: TrendingUp },
    { id: 'security', label: 'Security Metrics', icon: Shield },
    { id: 'system-settings', label: 'System Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'queue-management':
        return <QueueManagementTab />;
      case 'staff':
        return <StaffTab />;
      case 'customers':
        return <CustomerManagementTab />;
      case 'locations':
        return <LocationsTab />;
      case 'services':
        return <ServicesTab />;
      case 'templates':
        return <CommunicationTemplatesTab />;
      case 'users':
        return <UserManagementTab />;
      case 'employees':
        return <EmployeeTab />;
      case 'merged-users':
        return <MergedUsersTab />;
      case 'queueflow2':
        return <QueueFlow2Tab />;
      case 'sms-commands':
        return <SMSCommandsTab />;
      case 'stats':
        return <StatsTab />;
      case 'security':
        return <SecurityMetricsTab />;
      case 'system-settings':
        return <SystemSettingsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    
      
        
          Admin Panel
        
        
          {tabItems.map((tab) => (
            
              
                {tab.label}
              
            
          ))}
        
      
      
        {renderTabContent()}
      
    
  );
};
