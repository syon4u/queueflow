
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { CustomerCallingSystem } from './CustomerCallingSystem';
import { QueueDisplayBoard } from './QueueDisplayBoard';
import { EnhancedQueueControls } from './EnhancedQueueControls';
import { EnhancedQueueManagement } from './EnhancedQueueManagement';
import { useAuth } from '@/context/AuthContext';
import { useQueue } from '@/context/QueueContext';

// Define the interface expected by CustomerCallingSystem
interface QueueCustomer {
  id: string;
  name: string;
  phone?: string;
  service: string;
  waitTime: number;
  priority: 'normal' | 'priority';
  status: 'waiting' | 'called' | 'no_show';
}

export const QueueManagementTab: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { customers, updateCustomer, removeCustomer, stats } = useQueue();

  // Debug logging for QueueManagementTab
  console.log('QueueManagementTab - customers:', customers);
  console.log('QueueManagementTab - stats:', stats);
  console.log('QueueManagementTab - stats.waitingCustomers:', stats.waitingCustomers);

  // Convert QueueContext customers to the format expected by CustomerCallingSystem
  const formattedCustomers: QueueCustomer[] = customers
    .filter(c => c.status === 'waiting')
    .map(customer => ({
      id: customer.id,
      name: customer.name,
      phone: customer.phone || '',
      service: customer.service,
      waitTime: Math.floor((new Date().getTime() - customer.joinedAt.getTime()) / 60000),
      priority: customer.priority,
      status: 'waiting' as const // Always 'waiting' since we filter for waiting customers
    }));

  console.log('QueueManagementTab - formattedCustomers count:', formattedCustomers.length);

  const handleCustomerCalled = (customerId: string) => {
    console.log('Customer called:', customerId);
    // Update customer status to 'serving' in QueueContext
    updateCustomer(customerId, { 
      status: 'serving',
      calledAt: new Date()
    });
  };

  const handleNoShow = (customerId: string) => {
    console.log('Customer marked as no-show:', customerId);
    // Update customer status to 'no_show' in QueueContext
    updateCustomer(customerId, { status: 'no_show' });
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
