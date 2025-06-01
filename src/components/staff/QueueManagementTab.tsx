import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { CustomerCallingSystem } from './CustomerCallingSystem';
import { QueueDisplayBoard } from './QueueDisplayBoard';
import { EnhancedQueueControls } from './EnhancedQueueControls';
import { EnhancedQueueManagement } from './EnhancedQueueManagement';
import { useAuth } from '@/context/AuthContext';

// Mock data for demonstration - keep existing mock data
const mockCustomers = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    service: 'Document Review',
    waitTime: 25,
    priority: 'normal' as const,
    status: 'waiting' as const
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '+1 (555) 987-6543',
    service: 'Application Process',
    waitTime: 45,
    priority: 'priority' as const,
    status: 'waiting' as const
  },
  {
    id: '3',
    name: 'Bob Johnson',
    service: 'Consultation',
    waitTime: 15,
    priority: 'normal' as const,
    status: 'waiting' as const
  }
];

export const QueueManagementTab: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const handleCustomerCalled = (customerId: string) => {
    console.log('Customer called:', customerId);
    // Implementation would update queue state
  };

  const handleNoShow = (customerId: string) => {
    console.log('Customer marked as no-show:', customerId);
    // Implementation would remove customer from queue
  };

  // Mock location ID - in real app this would come from user/context
  const locationId = 'mock-location-id';

  return (
    <div className="space-y-6">
      <Tabs defaultValue="enhanced" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="enhanced">{t('queue.enhancedQueue')}</TabsTrigger>
          <TabsTrigger value="calling">{t('queue.customerCalling')}</TabsTrigger>
          <TabsTrigger value="display">{t('queue.displayBoard')}</TabsTrigger>
          <TabsTrigger value="controls">{t('queue.queueControls')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enhanced" className="space-y-4">
          <EnhancedQueueManagement locationId={locationId} />
        </TabsContent>
        
        <TabsContent value="calling" className="space-y-4">
          <CustomerCallingSystem
            customers={mockCustomers}
            onCustomerCalled={handleCustomerCalled}
            onNoShow={handleNoShow}
          />
        </TabsContent>
        
        <TabsContent value="display" className="space-y-4">
          <QueueDisplayBoard />
        </TabsContent>
        
        <TabsContent value="controls" className="space-y-4">
          <EnhancedQueueControls />
        </TabsContent>
      </Tabs>
    </div>
  );
};
