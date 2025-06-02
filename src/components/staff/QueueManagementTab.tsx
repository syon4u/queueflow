
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { CustomerCallingSystem } from './CustomerCallingSystem';
import { QueueDisplayBoard } from './QueueDisplayBoard';
import { EnhancedQueueControls } from './EnhancedQueueControls';
import { EnhancedQueueManagement } from './EnhancedQueueManagement';
import { useAuth } from '@/context/AuthContext';
import { useQueue } from '@/context/QueueContext';

export const QueueManagementTab: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { customers } = useQueue();

  // Convert QueueContext customers to the format expected by CustomerCallingSystem
  const formattedCustomers = customers
    .filter(c => c.status === 'waiting')
    .map(customer => ({
      id: customer.id,
      name: customer.name,
      phone: customer.phone || '',
      service: customer.service,
      waitTime: Math.floor((new Date().getTime() - customer.joinedAt.getTime()) / 60000),
      priority: customer.priority,
      status: 'waiting' as const // Map to the expected status type
    }));

  const handleCustomerCalled = (customerId: string) => {
    console.log('Customer called:', customerId);
    // Implementation would update queue state via QueueContext
  };

  const handleNoShow = (customerId: string) => {
    console.log('Customer marked as no-show:', customerId);
    // Implementation would remove customer from queue via QueueContext
  };

  // Use a default location since User doesn't have location_id
  const locationId = 'default-location';

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
            customers={formattedCustomers}
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
